/* eslint-disable react/prop-types */
import React from "react";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

export const Label: React.FC<LabelProps> = ({ className, ...props }) => {
  return <label className={`block font-medium text-gray-700 ${className}`} {...props} />;
};
