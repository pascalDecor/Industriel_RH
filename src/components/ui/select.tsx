"use client";
import clsx from "clsx";
import { useState } from "react";

interface FloatingLabelSelectProps {
    label: string;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { label: string; value: string }[];
    error?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    required?: boolean;
    className?: string;
}

export default function FloatingLabelSelect({
    label,
    name,
    value,
    onChange,
    options,
    error,
    icon,
    disabled = false,
    required = false,
}: Readonly<FloatingLabelSelectProps>) {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);

    return (
        <div className="relative w-full">
            {/* Select Field */}
            <select
                id={name}
                name={name}
                value={value}
                onChange={(e) => {
                    setHasValue(!!e.target.value);
                    if (onChange) onChange(e);
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                disabled={disabled}
                required={required}
                className={clsx(
                    "w-full px-4 pt-5 pb-2 border rounded-xl text-sm text-light outline-none transition-all text-gray-600 appearance-none",
                    {
                        "border-gray-600": isFocused || hasValue,
                        "border-gray-300": !isFocused && !hasValue,
                        "border-red-500 text-red-600": error,
                        "bg-gray-100 cursor-not-allowed": disabled,
                        "bg-white": !disabled,
                        "pl-10": icon
                    }
                )}
            >
                <option value="" disabled selected>
                    {label}
                </option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>

            {/* Label flottant */}
            <label
                htmlFor={name}
                className={`absolute left-4 top-2/3 font-light transform -translate-y-1/2 text-transparent transition-all text-sm
          ${isFocused || hasValue ? "text-[11px] top-4 !text-gray-400 font-light " : "text-base top-1/2"}
          ${error ? "text-red-500 top-1/3" : ""}
          ${icon ? "left-10" : ""}
        `}
            >
                {label} {required && "*"}
            </label>

            {/* Icon */}
            {icon && <div className={`absolute left-4 top-1/2 transform -translate-y-1/2
                 ${error ? "!text-red-500 top-1/3" : ""}`}>{icon}</div>}

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}
