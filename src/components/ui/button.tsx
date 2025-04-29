"use client";

import React from "react";
import clsx from "clsx";
import { LoadingSpinner } from "@/lib/load.helper";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success" | "warning" | "light" | "dark";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  loadingColor?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  className,
  isLoading = false,
  loadingColor = "white",
  ...props
}) => {
  const baseStyles =
    "rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring cursor-pointer";

  const variantStyles = {
    primary: "bg-blue-900 text-white hover:bg-blue-600 focus:ring-blue-300",
    secondary:
      "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-300",
    success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-300",
    warning: "bg-yellow-500 text-white hover:bg-yellow-600 focus:ring-yellow-300",
    light: "bg-gray-50 text-gray-900 hover:bg-gray-200 focus:ring-gray-400",
    dark: "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-400",
  };

  const sizeStyles = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className,
        "flex items-center justify-center cursor-pointer"
      )}
      onClick={props.onClick}
      {...props} // Passe les props, y compris onClick
    >
      {children}
      {isLoading && <div className="ml-2">
        <LoadingSpinner color={loadingColor} />
      </div>}
    </button>
  );
};

export default Button;
