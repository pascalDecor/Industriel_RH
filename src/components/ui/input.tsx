"use client";
import clsx from "clsx";
import { useState } from "react";

interface FloatingLabelInputProps {
    label: string;
    type?: string;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    errorClassName?: string;
    focusClassName?: string;
    disableClassName?: string;
}

export default function FloatingLabelInput({
    label,
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    error,
    icon,
    disabled = false,
    required = false,
}: Readonly<FloatingLabelInputProps>) {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);

    return (
        <div className="relative w-full">
            {/* Input Field */}
            <input
                type={type}
                id={name}
                name={name}
                value={value}
                onChange={(e) => {
                    setHasValue(!!e.target.value);
                    if (onChange) onChange(e);
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={(e) => {
                    setIsFocused(false);
                    setHasValue(!!e.target.value);
                }}
                placeholder={error ? "" : placeholder}
                disabled={disabled}
                required={required}
                className={clsx(
                    "w-full px-4 pt-5 pb-2 border rounded-xl text-sm text-light outline-none transition-all text-gray-600",
                    {
                        "border-gray-600": isFocused || hasValue,
                        "border-gray-300": !isFocused && !hasValue,
                        "border-red-500 text-red-600": error,
                        "bg-gray-100 cursor-not-allowed": disabled,
                        "bg-white": !disabled,
                        "pl-10": icon
                    }
                )}
            />

            {/* Label */}
            <label
                htmlFor={name}
                className={`absolute left-4 top-1/2 font-light transform -translate-y-1/2 text-gray-400 transition-all text-sm
          ${isFocused || hasValue ? "text-[11px] top-4 text-gray-400 font-light " : "text-base top-1/2"}
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
