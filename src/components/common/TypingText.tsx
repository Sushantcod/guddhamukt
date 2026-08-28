import React, { useState, useEffect } from 'react';

interface TypingTextProps {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  delayBetween?: number;
  className?: string;
}

export const TypingText: React.FC<TypingTextProps> = ({
  words,
  typingSpeed = 60,
  deletingSpeed = 30,
  delayBetween = 2200,
  className = '',
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const fullWord = words[currentWordIndex] || words[0];

    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText((prev) => prev.substring(0, prev.length - 1));
      }, deletingSpeed);

      if (currentText === '') {
        setIsDeleting(false);
        setCurrentWordIndex((prev) => (prev + 1) % words.length);
      }
    } else {
      timer = setTimeout(() => {
        setCurrentText(fullWord.substring(0, currentText.length + 1));
      }, typingSpeed);

      if (currentText === fullWord) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, delayBetween);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, delayBetween]);

  return (
    <span className={`inline-flex items-center text-[#F97316] ${className}`}>
      <span className="text-[#F97316] font-black">{currentText}</span>
      <span className="ml-1 animate-pulse font-extrabold text-[#F97316]">|</span>
    </span>
  );
};

export default TypingText;
