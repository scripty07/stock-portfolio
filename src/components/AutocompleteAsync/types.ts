export interface Option {
  id: string;
  label: string;
  disabled?: boolean;
}

export interface AutocompleteAsyncProps {
  placeholder?: string;
  fetchSuggestions: (query: string) => Promise<Option[]>;
  onSelect: (value: Option) => void;
  debounceDelay?: number;
}

export interface DropdownPortalProps {
  visible: boolean;
  style: React.CSSProperties;
  children: React.ReactNode;
}
