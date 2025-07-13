export interface ButtonGroupOption {
  label: string;
  value: string;
}

export interface ButtonSelectorGroupProps {
  options: Array<ButtonGroupOption>;
  selectedButton: string;
  onChange: (value: string) => void;
}
