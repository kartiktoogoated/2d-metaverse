import React, { useState, useRef } from "react";
import { motion } from "framer-motion";

interface ScrambleOnHoverProps {
  text: string;
  speed?: number; // ms per frame (default 50)
}

// Easing function so the early letters lock in faster.
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

const ScrambleOnHover: React.FC<ScrambleOnHoverProps> = ({ text, speed = 50 }) => {
  const [displayedText, setDisplayedText] = useState<string>(text);
  const intervalRef = useRef<number | null>(null);
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  // Total effect duration: 2000ms (2 seconds)
  const totalDuration = 2000;
  const totalFrames = totalDuration / speed;

  const handleMouseEnter = () => {
    // Clear any previous animation
    if (intervalRef.current) clearInterval(intervalRef.current);
    let frame = 0;
    intervalRef.current = window.setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easedProgress = easeOutCubic(progress);
      const lockedChars = Math.floor(text.length * easedProgress);
      const newText = text
        .split("")
        .map((_char, index) =>
          index < lockedChars
            ? text[index] // lock in correct character
            : letters[Math.floor(Math.random() * letters.length)]
        )
        .join("");
      setDisplayedText(newText);

      if (frame >= totalFrames) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        setDisplayedText(text);
      }
    }, speed);
  };

  const handleMouseLeave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setDisplayedText(text);
  };

  return (
    <motion.span
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      // Subtle hover scaling effect
      whileHover={{ scale: 1.05 }}
      style={{ display: "inline-block", transition: "transform 0.2s" }}
    >
      {displayedText}
    </motion.span>
  );
};

export default ScrambleOnHover;
