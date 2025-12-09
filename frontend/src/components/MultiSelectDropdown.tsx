import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface MultiSelectDropdownProps {
    label: string;
    values: string[];
    options: { value: string; label: string }[];
    onChange: (values: string[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ label, values, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleToggle = (optionValue: string) => {
        const newValues = values.includes(optionValue)
            ? values.filter(v => v !== optionValue)
            : [...values, optionValue];
        onChange(newValues);
    };

    const handleSelectAll = () => {
        onChange(options.map(opt => opt.value));
    };

    const handleClear = () => {
        onChange([]);
    };

    const getDisplayText = () => {
        if (values.length === 0) return label;
        if (values.length === 1) {
            const option = options.find(opt => opt.value === values[0]);
            return option?.label || label;
        }
        return `${label} (${values.length})`;
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center space-x-2 px-3 py-1.5 pr-8 border rounded-lg hover:bg-gray-50 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${values.length > 0 ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 text-gray-700'
                    }`}
            >
                <span>{getDisplayText()}</span>
            </button>
            <ChevronDown className={`w-4 h-4 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none transition-transform ${isOpen ? 'rotate-180' : ''
                } ${values.length > 0 ? 'text-blue-700' : 'text-gray-500'}`} />

            {isOpen && (
                <div className="absolute z-50 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                    {/* Header with Select All and Clear */}
                    <div className="sticky top-0 bg-gray-50 border-b border-gray-200 px-3 py-2 flex justify-between items-center">
                        <button
                            type="button"
                            onClick={handleSelectAll}
                            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                        >
                            Select All
                        </button>
                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-xs text-gray-600 hover:text-gray-800 font-medium"
                        >
                            Clear
                        </button>
                    </div>

                    {/* Options */}
                    <div className="py-1">
                        {options.map((option) => (
                            <label
                                key={option.value}
                                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={values.includes(option.value)}
                                    onChange={() => handleToggle(option.value)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;
