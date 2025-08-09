import * as React from 'react';
import TypewriterTitle from './TypewriterTitle';

interface TypewriterTitleWrapperProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  level?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  id?: string;
}

/**
 * Client-only wrapper for TypewriterTitle component
 * Prevents SSR issues by only rendering on the client side
 */
const TypewriterTitleWrapper: React.FC<TypewriterTitleWrapperProps> = (props) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Return a basic heading during SSR, enhanced version on client
  if (!isClient) {
    const HeadingTag = props.level || 'h1';
    return (
      <HeadingTag
        id={props.id}
        className={props.className}
      >
        {props.text}
      </HeadingTag>
    );
  }

  return <TypewriterTitle {...props} />;
};

export default TypewriterTitleWrapper;