import React from "react";
import { formatTextForDisplay } from '../../controller/Variables.js'
import "./index.css";
import "../../../public/styles/common.css";

export default function Cell({ className = "", text = "" }: CellProps) {

  return (
    <div className={`${className} table-cell`}>
      <div
        className="table-cell-text"
        dangerouslySetInnerHTML={{ __html: formatTextForDisplay(text) }}
      />
    </div>
  );
}

interface CellProps {
  className?: string;
  text?: React.ReactNode;
}