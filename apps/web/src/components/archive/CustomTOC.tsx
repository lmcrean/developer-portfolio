import React, { useState, useEffect } from 'react';

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

const tocItems: TOCItem[] = [
  { id: 'dottie', title: 'Dottie', level: 2 },
  { id: 'odyssey', title: 'Odyssey', level: 2 },
  { id: 'coach-matrix', title: 'Coach Matrix', level: 2 },
  { id: 'steam-report', title: 'Steam Report', level: 2 },
  { id: 'laurie-crean', title: 'Developer Portfolio', level: 2 },
];

/**
 * Custom Table of Contents Component
 * 
 * Provides navigation for all projects including those using TypewriterTitle components
 */
const CustomTOC: React.FC = () => {
  const [activeItem, setActiveItem] = useState<string>('');

  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const elementPosition = element.offsetTop;
      const offsetPosition = elementPosition - 40; // 40px offset to ensure heading is visible
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveItem(id);
    }
  };

  // Track which section is currently in view using scroll events
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 60; // 60px offset for better detection
      
      // Find all sections and their positions
      const sectionPositions = tocItems.map(item => {
        const element = document.getElementById(item.id);
        if (!element) return null;
        
        return {
          id: item.id,
          offsetTop: element.offsetTop,
          offsetBottom: element.offsetTop + element.offsetHeight
        };
      }).filter(Boolean);

      // Find the section that contains the current scroll position
      let currentSection = sectionPositions[0]?.id; // default to first section
      
      for (const section of sectionPositions) {
        if (scrollPosition >= section.offsetTop) {
          currentSection = section.id;
        } else {
          break;
        }
      }

      setActiveItem(currentSection || '');
    };

    // Set initial active item
    handleScroll();

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Also check after TypewriterTitle components have time to render
    const delayedCheck = setTimeout(handleScroll, 1000);
    const delayedCheck2 = setTimeout(handleScroll, 3000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(delayedCheck);
      clearTimeout(delayedCheck2);
    };
  }, []);

  return (
    <div className="table-of-contents mt-7">
      <div className="table-of-contents__title">On this page</div>
      <ul className="table-of-contents__list">
        {tocItems.map((item) => (
          <li key={item.id} className="table-of-contents__item">
            <a
              href={`#${item.id}`}
              className={`table-of-contents__link ${
                activeItem === item.id ? 'table-of-contents__link--active' : ''
              }`}
              onClick={(e) => {
                e.preventDefault();
                scrollToElement(item.id);
              }}
              data-level={item.level}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomTOC; 