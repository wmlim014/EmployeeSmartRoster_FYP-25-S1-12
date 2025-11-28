import "./PrimaryButton.css";
import "../../../public/styles/common.css";

export default function PrimaryButton({ 
  text = "Text",
  onClick,
  disabled = false,
  type = 'button'
}: PrimaryButtonProps) {
  return (
      <button 
        className="primary-button"
        onClick={onClick}
        disabled={disabled}
        type={type}
      >
        {text}
      </button>
  );
}

interface PrimaryButtonProps {
  text?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}