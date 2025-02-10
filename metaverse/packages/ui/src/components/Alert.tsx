import React from "react";
import { cn } from "../utils";
import { XCircle } from "lucide-react";

type AlertProps = {
  variant?: "default" | "destructive";
  children: React.ReactNode;
};

export const Alert: React.FC<AlertProps> = ({ variant = "default", children }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-md border",
        variant === "destructive" ? "bg-red-100 text-red-700 border-red-300" : "bg-gray-100 text-gray-700 border-gray-300"
      )}
    >
      {variant === "destructive" && <XCircle className="h-5 w-5 text-red-500" />}
      {children}
    </div>
  );
};

export const AlertDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <p className="text-sm">{children}</p>;
};
