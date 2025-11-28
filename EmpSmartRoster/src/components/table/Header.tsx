import "./index.css";
import "../../../public/styles/common.css";

export default function Header({ className = "", text = "Text" }: HeaderProps) {
  return (
    <div className={`${className} table-header`}>
      <div className="table-header-text">{text}</div>
    </div>
  );
}

interface HeaderProps {
  className?: string;
  text?: string;
}