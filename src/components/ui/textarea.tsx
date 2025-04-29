"use client";
import clsx from "clsx";
import { useState } from "react";

interface FloatingLabelTextareaProps {
    label: string;
    name?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    rows?: number;
}

export default function FloatingLabelTextarea({
    label,
    name,
    value,
    onChange,
    placeholder,
    error,
    disabled = false,
    required = false,
    rows = 4
}: Readonly<FloatingLabelTextareaProps>) {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(!!value);

    return (
        <div className="relative w-full">
            {/* Textarea Field */}
            <textarea
                id={name}
                name={name}
                value={value}
                rows={rows}
                onChange={(e) => {
                    setHasValue(!!e.target.value);
                    if (onChange) onChange(e);
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={error ? "" : placeholder}
                disabled={disabled}
                required={required}
                className={clsx(
                    "w-full px-4 pt-5 pb-2 border rounded-xl text-sm text-light outline-none transition-all text-gray-600 resize-none",
                    {
                        "border-gray-600": isFocused || hasValue,
                        "border-gray-300": !isFocused && !hasValue,
                        "border-red-500 text-red-600": error,
                        "bg-gray-100 cursor-not-allowed": disabled,
                        "bg-white": !disabled,
                    }
                )}
            />

            {/* Label flottant */}
            <label
                htmlFor={name}
                className={`absolute left-4 top-1/2 font-light transform -translate-y-1/2 text-transparent transition-all text-sm
          ${isFocused || hasValue ? "text-[11px] top-4 !text-gray-400 font-light " : "text-base top-1/2"}
          ${error ? "!text-red-500 top-1/3" : ""}
        `}
            >
                {label} {required && "*"}
            </label>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}
