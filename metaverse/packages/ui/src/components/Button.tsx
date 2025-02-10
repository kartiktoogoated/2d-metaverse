/* eslint-disable react/prop-types */
import React from "react";
import { cn } from "../utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "ghost" | "link"; // Variants for button styles
  size?: "default" | "icon"; // Add size prop to support "default" and "icon"
};

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "default",
  size = "default",
  ...props
}) => {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md font-medium transition duration-200 focus:ring-2 focus:ring-offset-2", // Base styles
        variant === "default" && "bg-blue-600 text-white hover:bg-blue-700", // Default variant
        variant === "ghost" && "bg-transparent text-gray-700 hover:bg-gray-100", // Ghost variant
        variant === "link" && "underline text-blue-500 hover:text-blue-700", // Link variant
        size === "icon" && "p-2", // Icon size
        className // Additional custom class names
      )}
      {...props}
    >
      {children}
    </button>
  );
};
