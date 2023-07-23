import React, {FC} from "react"

const HighlightedText: React.FC<{text: string, highlight: string}> = ({ text, highlight = "" }) => {
    if (!highlight.trim()) {
        return <>{text}</>;
      }
    
      const regex = new RegExp(`(${highlight})`, 'i');
      const parts = text.split(regex);
    
      return (
        <span>
          {parts.filter(part => part).map((part, i) => (
            regex.test(part) ? <span key={i} style={{ backgroundColor: 'orange', color: 'white' }}>{part}</span> : part
          ))}
        </span>
      );
}

export default HighlightedText;