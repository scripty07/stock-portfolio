import React, { useState, useEffect, useRef, useCallback } from 'react';

import ReactDOM from 'react-dom';
import { IoIosSearch } from 'react-icons/io';

import type {
  AutocompleteAsyncProps,
  DropdownPortalProps,
  Option,
} from './types';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';

export const AutocompleteAsync: React.FC<AutocompleteAsyncProps> = ({
  placeholder = 'Search...',
  fetchSuggestions,
  onSelect,
  debounceDelay = 500,
}) => {
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState<Option[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});

  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedInputValue = useDebouncedValue(inputValue, debounceDelay);

  // Click anywhere to close option menu
  useEffect(() => {
    const handleClickOutside = (e: PointerEvent) => {
      const inputEl = inputRef.current;
      const dropdownEl = document.getElementById('autocomplete-dropdown');

      if (
        inputEl &&
        !inputEl.contains(e.target as Node) &&
        dropdownEl &&
        !dropdownEl.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('pointerdown', handleClickOutside);
    return () =>
      document.removeEventListener('pointerdown', handleClickOutside);
  }, []);

  // Fetch suggestions with debounced query
  useEffect(() => {
    const fetchOptions = async () => {
      if (!debouncedInputValue.trim()) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      setShowSuggestions(true);

      if (debouncedInputValue.length < 3) {
        setSuggestions([
          {
            id: 'MinLength',
            label: 'Enter 3 or more letters',
            disabled: true,
          },
        ]);

        return;
      }

      setLoading(true);

      try {
        const results = await fetchSuggestions(debouncedInputValue);
        setSuggestions(results);
      } catch (err) {
        const errorMessage = (err as Error)?.message ?? 'Error occured';

        setSuggestions([
          {
            id: 'Error',
            label: errorMessage,
            disabled: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [debouncedInputValue, fetchSuggestions]);

  // Recalculate dropdown position
  const updateDropdownPosition = useCallback(() => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'absolute',
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        zIndex: 9999,
      });
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setActiveIndex(-1);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions || suggestions.length === 0) return;

      if (e.key === 'ArrowDown') {
        setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
      } else if (e.key === 'ArrowUp') {
        setActiveIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        const selected = suggestions[activeIndex];
        onSelect(selected);
        setShowSuggestions(false);
      }
    },
    [activeIndex, onSelect, showSuggestions, suggestions]
  );

  const handleClick = useCallback(
    (value: Option) => {
      onSelect(value);
      setInputValue('');
      setShowSuggestions(false);
    },
    [onSelect]
  );

  const handleInputFocus = useCallback(() => {
    updateDropdownPosition();

    if (!!inputRef.current?.value) {
      setShowSuggestions(true);
    }
  }, [updateDropdownPosition]);

  return (
    <div ref={wrapperRef}>
      <div className="w-full bg-white rounded-full px-5 outline-0 text-sm flex items-center gap-2">
        <input
          type="text"
          ref={inputRef}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          className="w-full bg-white py-3 outline-0 text-sm flex-1"
          placeholder={placeholder}
        />

        <IoIosSearch size="1.2rem" />
      </div>

      <DropdownPortal visible={showSuggestions} style={dropdownStyle}>
        {loading ? (
          <li className="px-4 py-2 italic text-gray-500 ">Loading...</li>
        ) : suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <li
              key={suggestion.id}
              onClick={
                !suggestion.disabled ? () => handleClick(suggestion) : undefined
              }
              className={`px-4 py-2 ${
                index === activeIndex ? 'bg-gray-300' : 'hover:bg-gray-100'
              } ${suggestion.disabled ? 'cursor-not-allowed italic text-gray-500' : 'cursor-pointer text-gray-900'}`}
            >
              {suggestion.label}
            </li>
          ))
        ) : (
          <li className="px-4 py-2 italic text-gray-500">
            No suggestions found
          </li>
        )}
      </DropdownPortal>
    </div>
  );
};

export const DropdownPortal: React.FC<DropdownPortalProps> = ({
  visible,
  style,
  children,
}) => {
  if (!visible) {
    return null;
  }

  return ReactDOM.createPortal(
    <ul
      id="autocomplete-dropdown"
      className="bg-white border border-gray-300 rounded-xl shadow-md max-h-60 overflow-y-auto"
      style={style}
    >
      {children}
    </ul>,
    document.body
  );
};
