import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AutocompleteAsync } from '../AutocompleteAsync';
import type { Option } from '../types';

const mockOptions: Option[] = [
  { id: '1', label: 'Apple' },
  { id: '2', label: 'Banana' },
  { id: '3', label: 'Cherry' },
];

const fetchSuggestions = vi.fn((query: string) =>
  Promise.resolve(
    mockOptions.filter((opt) =>
      opt.label.toLowerCase().includes(query.toLowerCase())
    )
  )
);

afterEach(() => {
  cleanup();
  fetchSuggestions.mockClear();
});

describe('AutocompleteAsync', () => {
  const onSelect = vi.fn();

  it('renders input with placeholder', () => {
    render(
      <AutocompleteAsync
        placeholder="Search fruit"
        fetchSuggestions={fetchSuggestions}
        onSelect={onSelect}
      />
    );
    expect(screen.getByPlaceholderText('Search fruit')).toBeInTheDocument();
  });

  it('shows suggestions after debounce and minimum length', async () => {
    render(
      <AutocompleteAsync
        fetchSuggestions={fetchSuggestions}
        onSelect={onSelect}
      />
    );

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'App');

    await waitFor(() => {
      expect(fetchSuggestions).toHaveBeenCalledWith('App');
      expect(screen.getByText('Apple')).toBeInTheDocument();
    });
  });

  it('shows loading state', async () => {
    const slowFetch = vi.fn(
      (_q: string) =>
        new Promise<Option[]>((res) => setTimeout(() => res(mockOptions), 200))
    );

    render(
      <AutocompleteAsync fetchSuggestions={slowFetch} onSelect={onSelect} />
    );

    await userEvent.type(screen.getByRole('textbox'), 'App');

    expect(await screen.findByText('Loading...')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument()
    );
  });

  it('shows "Enter 3 or more letters" for short input', async () => {
    render(
      <AutocompleteAsync
        fetchSuggestions={fetchSuggestions}
        onSelect={onSelect}
      />
    );

    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Ap');

    expect(
      await screen.findByText('Enter 3 or more letters')
    ).toBeInTheDocument();
    expect(fetchSuggestions).not.toHaveBeenCalled();
  });

  it('calls onSelect when a suggestion is clicked', async () => {
    render(
      <AutocompleteAsync
        fetchSuggestions={fetchSuggestions}
        onSelect={onSelect}
      />
    );

    await userEvent.type(screen.getByRole('textbox'), 'Ban');

    await waitFor(() => expect(screen.getByText('Banana')).toBeInTheDocument());
    await userEvent.click(screen.getByText('Banana'));

    expect(onSelect).toHaveBeenCalledWith({ id: '2', label: 'Banana' });
  });

  it('shows error message on fetch failure', async () => {
    const failFetch = vi.fn(() => Promise.reject(new Error('Network error')));

    render(
      <AutocompleteAsync fetchSuggestions={failFetch} onSelect={onSelect} />
    );

    await userEvent.type(screen.getByRole('textbox'), 'Any');

    expect(await screen.findByText('Network error')).toBeInTheDocument();
  });
});
