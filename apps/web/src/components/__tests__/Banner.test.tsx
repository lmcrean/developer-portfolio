/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, screen, RenderResult } from '@testing-library/react';
import '@testing-library/jest-dom';
import DeveloperBusinessCard from '../banner/banner';
import LeftSection from '../banner/sections/MidSection';
import MiddleSection from '../banner/sections/EndSection';
import RightSection from '../banner/sections/TitleSection';

describe('DeveloperBusinessCard Component', () => {
  it('renders without crashing', () => {
    render(<DeveloperBusinessCard />);
  });

  it('renders all three sections', () => {
    const { container }: RenderResult = render(<DeveloperBusinessCard />);
    
    // Check that the main container has the expected structure (updated for responsive height)
    const mainContainer = container.querySelector('.flex.w-full') as HTMLElement;
    expect(mainContainer).toBeTruthy();
    
    // Should have exactly 3 child sections
    expect(mainContainer.children).toHaveLength(3);
  });

  it('has the correct CSS classes for layout', () => {
    const { container }: RenderResult = render(<DeveloperBusinessCard />);
    
    const mainContainer = container.querySelector('div') as HTMLElement;
    expect(mainContainer.className).toContain('flex');
    expect(mainContainer.className).toContain('w-full');
    expect(mainContainer.className).toContain('h-48'); // Updated for responsive design
    expect(mainContainer.className).toContain('md:h-64'); // Updated for responsive design
    expect(mainContainer.className).toContain('bg-white');
    expect(mainContainer.className).toContain('rounded-lg');
    expect(mainContainer.className).toContain('shadow-lg');
    expect(mainContainer.className).toContain('overflow-hidden');
  });
});

describe('LeftSection Component', () => {
  it('renders the code visualization elements', () => {
    const { container }: RenderResult = render(<LeftSection />);
    
    // Check for the blue background section
    const leftSection = container.querySelector('.w-1\\/3.bg-blue-600') as HTMLElement;
    expect(leftSection).toBeTruthy();
    
    // Check for code line representations (colored bars)
    const codeElements = container.querySelectorAll('.h-3');
    expect(codeElements.length).toBeGreaterThan(10); // Should have multiple code line elements
  });

  it('has the correct background color and layout', () => {
    const { container }: RenderResult = render(<LeftSection />);
    
    const section = container.querySelector('div') as HTMLElement;
    expect(section.className).toContain('w-1/3');
    expect(section.className).toContain('bg-blue-600');
    expect(section.className).toContain('p-4');
    expect(section.className).toContain('relative');
  });
});

describe('MiddleSection Component', () => {
  it('renders the vertical dotted line with 12 dots', () => {
    const { container }: RenderResult = render(<MiddleSection />);
    
    // Check for yellow dots (representing the dotted line)
    const dots = container.querySelectorAll('.bg-yellow-300.rounded-full');
    expect(dots).toHaveLength(12);
  });

  it('renders code snippet representations', () => {
    const { container }: RenderResult = render(<MiddleSection />);
    
    // Check for code snippet bars
    const codeSnippets = container.querySelectorAll('.h-2');
    expect(codeSnippets.length).toBeGreaterThan(15); // 12 dots + code snippets
  });

  it('has the correct background color', () => {
    const { container }: RenderResult = render(<MiddleSection />);
    
    const section = container.querySelector('div') as HTMLElement;
    expect(section.className).toContain('w-1/3');
    expect(section.className).toContain('bg-blue-500');
  });
});

describe('RightSection Component', () => {
  it('renders the developer name', () => {
    render(<RightSection />);
    
    expect(screen.getByText('Laurie Crean')).toBeTruthy();
  });

  it('renders all job titles', () => {
    render(<RightSection />);
    
    // Updated to match current implementation - "Back End" is hidden
    expect(screen.getByText('Software Developer')).toBeTruthy();
  });

  it('renders the developer name', () => {
    render(<RightSection />);
    
    expect(screen.getByText('Laurie Crean')).toBeTruthy();
  });

  it('has the correct styling classes', () => {
    const { container }: RenderResult = render(<RightSection />);
    
    const section = container.querySelector('div') as HTMLElement;
    expect(section.className).toContain('w-full');
    expect(section.className).toContain('bg-teal-800');
    expect(section.className).toContain('p-6');
    
    // Check for name styling - find the parent div containing the name
    const nameElement = screen.getByText('Laurie Crean') as HTMLElement;
    const nameContainer = nameElement.parentElement as HTMLElement;
    expect(nameContainer.className).toContain('text-4xl');
    expect(nameContainer.className).toContain('font-bold');
    expect(nameContainer.className).toContain('text-white');
  });

  it('has correct color classes for different job titles', () => {
    render(<RightSection />);
    
    // Updated to match current implementation - only "Software Developer" is visible
    const developer = screen.getByText('Software Developer') as HTMLElement;
    expect(developer.className).toContain('text-lg');
    expect(developer.className).toContain('text-yellow-300');
    expect(developer.className).toContain('italic');
  });
}); 