import React, { useRef, useState, useEffect } from 'react';

interface TypewriterTitleProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  id?: string;
}

/**
 * TypewriterTitle Component
 * 
 * Renders a heading with typewriter effect and fade-in animation when it scrolls into view
 * 
 * @param {TypewriterTitleProps} props - Component props
 * @param {string} props.text - The text to display with typewriter effect
 * @param {string} props.level - Heading level (h1, h2, h3, etc.)
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.id - ID for the heading element (for anchor links)
 * @param {number} props.delay - Delay before starting animation (in ms)
 * @param {number} props.speed - Speed of typewriter effect (characters per interval)
 * @returns {JSX.Element} The rendered typewriter title
 */
const TypewriterTitle: React.FC<TypewriterTitleProps> = ({
  text,
  className = '',
  delay = 0,
  speed = 50,
  level = 'h1',
  id
}) => {
  const elementRef = useRef<HTMLHeadingElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [displayText, setDisplayText] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Create the heading element
  const HeadingTag = level;

  // Set client-side flag
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Only run IntersectionObserver on client side
  useEffect(() => {
    if (!isClient) return;

    const observer = new IntersectionObserver(
      ([entry]: IntersectionObserverEntry[]) => {
        if (entry.isIntersecting && !hasStarted) {
          setIsVisible(true);
          // Start typewriter effect after delay
          setTimeout(() => {
            setHasStarted(true);
          }, delay);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the element is visible
        rootMargin: '-50px 0px' // Start animation slightly before element is fully visible
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [delay, hasStarted, isClient]);

  // Typewriter effect
  useEffect(() => {
    if (!isClient) return;

    if (hasStarted && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(text.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [hasStarted, currentIndex, text, speed, isClient]);

  return (
    <HeadingTag
      ref={elementRef}
      id={id}
      className={`typewriter-title ${isVisible ? 'fade-in' : ''} ${className}`}
      data-full-text={text}
    >
      {isClient ? displayText : text}
      {isClient && hasStarted && currentIndex < text.length && (
        <span className="typewriter-cursor"></span>
      )}
    </HeadingTag>
  );
};

export default TypewriterTitle; 