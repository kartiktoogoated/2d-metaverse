import React from "react";
import { cn } from "../utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>; // Extend native div attributes

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div className={cn("bg-white p-6 shadow-lg rounded-lg", className)} {...props}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className, ...props }) => (
  <div className={cn("mb-4 border-b pb-4", className)} {...props}>
    {children}
  </div>
);

export const CardTitle: React.FC<CardProps> = ({ children, className, ...props }) => (
  <h2 className={cn("text-xl font-semibold text-gray-800", className)} {...props}>
    {children}
  </h2>
);

export const CardDescription: React.FC<CardProps> = ({ children, className, ...props }) => (
  <p className={cn("text-sm text-gray-500", className)} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<CardProps> = ({ children, className, ...props }) => (
  <div className={cn("mt-4 space-y-4", className)} {...props}>
    {children}
  </div>
);
