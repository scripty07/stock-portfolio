import type { ButtonSelectorGroupProps } from './types';

export const ButtonSelectorGroup = (props: ButtonSelectorGroupProps) => {
  const { options, selectedButton, onChange } = props;

  return (
    <div className="flex gap-2 items-center">
      {options.map((duration) => (
        <button
          key={duration.value}
          onClick={() => onChange(duration.value)}
          className={`px-2 py-1 rounded-full text-sm font-medium cursor-pointer transition-all duration-200 border 
            ${
              selectedButton === duration.value
                ? 'bg-blue-500 text-white border-blue-400'
                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-200'
            }`}
        >
          {duration.label}
        </button>
      ))}
    </div>
  );
};
