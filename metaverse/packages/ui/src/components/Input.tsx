/* eslint-disable react/prop-types */
import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = ({ className, ...props }) => {
  return (
    <input
      className={`border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
};
