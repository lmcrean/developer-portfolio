import React from 'react';
import { generateBadgeUrl } from './LangBadges';

interface TechBadgesProps {
  values: string;
  color?: string;
  logoColor?: string;
  className?: string;
}

const TechBadges: React.FC<TechBadgesProps> = ({
  values,
  color = '1C1C1C',
  logoColor = 'white',
  className = 'tech-badges'
}) => {
  // Parse the comma-separated values and remove any whitespace
  const techList = values.split(',').map(tech => tech.trim()).filter(tech => tech);

  return (
    <div className={className} style={{display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center'}}>
      {techList.map((tech) => {
        const { url, alt } = generateBadgeUrl(tech, color, logoColor);
        return (
          <img 
            key={tech}
            src={url} 
            alt={alt} 
          />
        );
      })}
    </div>
  );
};

export default TechBadges; 