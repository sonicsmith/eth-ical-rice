import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled = false,
}) => {
  const buttonStyle: React.CSSProperties = {
    padding: 8,
    backgroundColor: disabled ? "#c3c3c3" : "#3b82f6",
    color: "#ffffff",
    borderRadius: "8px",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "background-color 0.2s ease",
  };

  return (
    <button disabled={disabled} onClick={onClick} style={buttonStyle}>
      {children}
    </button>
  );
};
