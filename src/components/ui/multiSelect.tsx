'use client';

import { useState } from 'react';
import CreatableSelect from 'react-select/creatable';
import { MultiValue, ActionMeta } from 'react-select';
import Select from 'react-select';

type OptionType = {
    label: string;
    value: string;
};

type Props = {
    items: OptionType[];
    onChange?: (values: OptionType[]) => void;
    defaultValue?: OptionType[];
    placeholder?: string;
    enableCreate?: boolean;
    isMulti?: boolean;
    className?: string;
};

const createOption = (label: string): OptionType => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ''),
});

export default function MultiSelect({
    items,
    onChange,
    defaultValue = [],
    placeholder = 'Choisir...',
    enableCreate = false,
    isMulti = true,
    className = '',
}: Readonly<Props>) {
    const [selected, setSelected] = useState<MultiValue<OptionType>>(defaultValue);
    const [options, setOptions] = useState<OptionType[]>(items);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (
        newValue: MultiValue<OptionType>,
        _actionMeta: ActionMeta<OptionType>
    ) => {
        setSelected(newValue);
        onChange?.(newValue as OptionType[]);
    };

    const handleCreate = (inputValue: string) => {
        setIsLoading(true);
        const newOption = createOption(inputValue);
        setTimeout(() => {
            setOptions((prev) => [...prev, newOption]);
            setSelected((prev) => [...(prev as OptionType[]), newOption]);
            onChange?.([...(selected as OptionType[]), newOption]);
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="">
            {enableCreate ? <CreatableSelect
                className={className +'w-full rounded-xl border-gray-300 border p-2 text-gray-800 outline-none transition-all text-sm'}
                isMulti={isMulti}
                isDisabled={isLoading}
                isLoading={isLoading}
                options={options}
                value={selected}
                onChange={handleChange}
                onCreateOption={enableCreate ? handleCreate : undefined}
                placeholder={placeholder}
                isClearable
                classNamePrefix="react-select"
                noOptionsMessage={() => 'Aucune option disponible'}
            /> : <Select
                className={className +'w-full rounded-xl border-gray-300 border p-2 text-gray-800 outline-none transition-all text-sm'}
                isMulti={isMulti}
                isDisabled={isLoading}
                isLoading={isLoading}
                options={options}
                value={selected}
                onChange={handleChange}
                placeholder={placeholder}
                isClearable
                classNamePrefix="react-select"
                noOptionsMessage={() => 'Aucune option disponible'}
            />}
        </div>
    );
}
