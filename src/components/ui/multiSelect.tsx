'use client';

import { useState, useEffect } from 'react';
import CreatableSelect from 'react-select/creatable';
import { MultiValue, ActionMeta, SingleValue } from 'react-select';
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
    onCreateOption?: (inputValue: string) => Promise<OptionType | null>;
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
    onCreateOption,
}: Readonly<Props>) {
    const [selected, setSelected] = useState<MultiValue<OptionType> | SingleValue<OptionType>>(defaultValue);
    const [options, setOptions] = useState<OptionType[]>(items);
    const [isLoading, setIsLoading] = useState(false);

    // Mettre à jour les options quand les items changent
    useEffect(() => {
        setOptions(items);
    }, [items]);

    const handleChange = (
        newValue: MultiValue<OptionType> | SingleValue<OptionType>,
        _actionMeta: ActionMeta<OptionType>
    ) => {
        setSelected(newValue);
        onChange?.(newValue as OptionType[]);
    };

    const handleCreate = async (inputValue: string) => {
        setIsLoading(true);
        try {
            if (onCreateOption) {
                const createdOption = await onCreateOption(inputValue);
                if (createdOption) {
                    const newOptions = [...options, createdOption];
                    const newSelected = [...(selected as OptionType[]), createdOption];
                    
                    setOptions(newOptions);
                    setSelected(newSelected);
                    onChange?.(newSelected);
                }
            } else {
                // Fallback vers l'ancienne logique
                const newOption = createOption(inputValue);
                const newOptions = [...options, newOption];
                const newSelected = [...(selected as OptionType[]), newOption];
                
                setOptions(newOptions);
                setSelected(newSelected);
                onChange?.(newSelected);
            }
        } catch (error) {
            console.error('Erreur lors de la création:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="">
            {enableCreate ? <CreatableSelect
                className={className + 'w-full rounded-xl border-gray-300 border p-2 text-gray-800 outline-none transition-all text-sm'}
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
                className={className + 'w-full rounded-xl border-gray-300 border p-2 text-gray-800 outline-none transition-all text-sm'}
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
