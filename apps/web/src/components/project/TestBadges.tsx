import React from 'react';

interface TestBadge {
  framework: string;
  count: string;
  logo: string;
}

interface TestBadgesProps {
  tests: string; // Format: "vitest:303,playwright:40,jest:5"
  color?: string;
  logoColor?: string;
  className?: string;
}

const TEST_FRAMEWORK_LOGOS: Record<string, string> = {
  vitest: 'vitest',
  playwright: 'playwright',
  jest: 'jest',
  cypress: 'cypress',
  python: 'python',
  pytest: 'pytest',
};

const parseTestString = (tests: string): TestBadge[] => {
  return tests.split(',')
    .map(test => test.trim())
    .filter(test => test)
    .map(test => {
      const [framework, count] = test.split(':');
      const logo = TEST_FRAMEWORK_LOGOS[framework.toLowerCase()] || framework.toLowerCase();
      
      return {
        framework: framework.charAt(0).toUpperCase() + framework.slice(1),
        count: count || '0',
        logo
      };
    });
};

const TestBadges: React.FC<TestBadgesProps> = ({
  tests,
  color = '1C1C1C',
  logoColor = 'white',
  className = 'test-badges'
}) => {
  const testBadges = parseTestString(tests);

  return (
    <div className={className} style={{display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center'}}>
      {testBadges.map((test, index) => {
        const badgeText = `${test.framework}-${test.count}_Passed`;
        const url = `https://img.shields.io/badge/${badgeText}-${color}?style=flat-square&logo=${test.logo}&logoColor=${logoColor}`;
        
        return (
          <img 
            key={`${test.framework}-${index}`}
            src={url}
            alt={test.framework}
          />
        );
      })}
    </div>
  );
};

export default TestBadges;
