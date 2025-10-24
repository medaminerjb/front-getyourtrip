import React, { useEffect, useState } from "react";
import "./AnimatedText.css"; // make sure to include your CSS

interface AnimatedTextProps {
  texts: string[];
  interval?: number; // milliseconds
}

const AnimatedText: React.FC<AnimatedTextProps> = ({ texts, interval = 3000 }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % texts.length);
    }, interval);

    return () => clearTimeout(timer); // cleanup on unmount
  }, [index, texts.length, interval]);

  return (
    <div className="animate-text">
      {texts.map((text, i) => (
        <span key={i} className={i === index ? "text-in" : ""}>
          {text}
        </span>
      ))}
    </div>
  );
};

export default AnimatedText;
