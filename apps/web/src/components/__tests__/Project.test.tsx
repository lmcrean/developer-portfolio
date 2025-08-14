/**
 * @jest-environment jsdom
 */

import React from 'react';
import { render, RenderResult } from '@testing-library/react';
import Project from '../Project';
import { ProjectData, ProjectVersion, ButtonData, TestResult, GitHubInfo } from '../../data/projects';


// Mock ProjectCarousel component with proper typing
jest.mock('../ProjectCarousel', () => {
  interface MockProjectCarouselProps {
    projectKey: string;
  }
  
  return function MockProjectCarousel({ projectKey }: MockProjectCarouselProps): JSX.Element {
    return <div data-testid={`mocked-carousel-${projectKey}`}></div>;
  };
});

// Mock console.error to suppress expected error messages
console.error = jest.fn();

describe('Project Component', () => {
  // Single version project with proper TypeScript typing
  const mockSingleVersionProject: ProjectData = {
    id: 'test-project',
    name: 'Test Project',
    projectTypes: ['Full-Stack', 'API'],
    description: 'A test project description with <b>HTML</b>',
    technologies: ['React', 'Jest'],
    testResults: [
      { framework: 'Playwright', passed: 12, logo: 'playwright' },
      { framework: 'Jest', passed: 5, logo: 'jest' }
    ] as TestResult[],
    commitId: '1a2b3c4',
    githubInfo: {
      repo: 'user/test-project',
      lastCommit: true,
      createdAt: true,
      commitActivity: true
    } as GitHubInfo,
    buttons: {
      code: { 
        url: 'https://github.com/user/test-project',
        icon: 'fa-code',
        text: 'code'
      },
      readme: { 
        url: 'https://github.com/user/test-readme',
        icon: 'fa-book',
        text: 'readme'
      },
      figma: { 
        url: 'https://figma.com/design/test',
        icon: 'fa-paint-brush',
        text: 'mockup'
      },
      liveDemo: { 
        url: 'https://test-project.example.com',
        icon: 'fa-play',
        text: 'live demo'
      }
    } as Record<string, ButtonData>,
    slides: [
      {
        src: '/img/test1.png',
        alt: 'Test Image 1'
      },
      {
        src: '/img/test2.png',
        alt: 'Test Image 2'
      }
    ]
  };
  
  // Multi-version project with proper TypeScript typing
  const mockMultiVersionProject: ProjectData = {
    id: 'test-multi-project',
    name: 'Test Multi Project',
    projectTypes: ['Frontend'],
    versions: [
      {
        version: '2.0',
        description: 'Version 2.0 description',
        technologies: ['React', 'TypeScript'],
        testResults: [
          { framework: 'Playwright', passed: 15, logo: 'playwright' }
        ] as TestResult[],
        githubInfo: {
          repo: 'user/test-multi-v2',
          lastCommit: true,
          createdAt: true,
          commitActivity: true
        } as GitHubInfo,
        buttons: {
          code: { 
            url: 'https://github.com/user/test-multi-v2',
            icon: 'fa-code',
            text: 'code'
          },
          liveDemo: { 
            url: 'https://test-multi-v2.example.com',
            icon: 'fa-play',
            text: 'live demo'
          }
        } as Record<string, ButtonData>
      },
      {
        version: '1.0',
        description: 'Version 1.0 description',
        technologies: ['JavaScript', 'HTML', 'CSS'],
        githubInfo: {
          repo: 'user/test-multi-v1',
          lastCommit: true,
          createdAt: true,
          commitActivity: true
        } as GitHubInfo,
        buttons: {
          code: { 
            url: 'https://github.com/user/test-multi-v1',
            icon: 'fa-code',
            text: 'code'
          },
          readme: { 
            url: 'https://github.com/user/test-multi-v1-readme',
            icon: 'fa-book',
            text: 'readme'
          }
        } as Record<string, ButtonData>
      }
    ] as ProjectVersion[],
    slides: [
      {
        src: '/img/test-multi1.png',
        alt: 'Test Multi Image 1'
      }
    ]
  };

  beforeEach((): void => {
    jest.clearAllMocks();
  });

  it('renders a single version project without crashing', (): void => {
    render(<Project projectData={mockSingleVersionProject} />);
  });
  
  it('renders a multi-version project without crashing', (): void => {
    render(<Project projectData={mockMultiVersionProject} />);
  });

  it('renders the project header and type badges', (): void => {
    const { getByText, getAllByAltText }: RenderResult = render(<Project projectData={mockSingleVersionProject} />);
    
    expect(getByText('Test Project')).toBeTruthy();
    expect(getAllByAltText('Full-Stack').length).toBeGreaterThan(0);
    expect(getAllByAltText('API').length).toBeGreaterThan(0);
  });

  it('renders the project carousel using the ProjectCarousel component', (): void => {
    const { getByTestId }: RenderResult = render(<Project projectData={mockSingleVersionProject} />);
    
    expect(getByTestId('mocked-carousel-test')).toBeTruthy();
  });

  it('renders all the buttons for a single version project', (): void => {
    const { getByText }: RenderResult = render(<Project projectData={mockSingleVersionProject} />);
    
    expect(getByText('code')).toBeTruthy();
    expect(getByText('readme')).toBeTruthy();
    expect(getByText('mockup')).toBeTruthy();
    expect(getByText('live demo')).toBeTruthy();
  });

  it('renders GitHub badges for a single version project', (): void => {
    const { container }: RenderResult = render(<Project projectData={mockSingleVersionProject} />);
    
    const githubBadges: NodeListOf<Element> = container.querySelectorAll('.github-badges img');
    expect(githubBadges.length).toBe(3); // Last commit, created at, commit activity
  });

  it('renders technology badges for a single version project', (): void => {
    const { getAllByAltText }: RenderResult = render(<Project projectData={mockSingleVersionProject} />);
    
    expect(getAllByAltText('React').length).toBeGreaterThan(0);
    expect(getAllByAltText('Jest').length).toBeGreaterThan(0);
  });
  
  it('renders test result badges for a single version project', (): void => {
    const { getAllByAltText }: RenderResult = render(<Project projectData={mockSingleVersionProject} />);
    
    expect(getAllByAltText('Playwright 12 Passed').length).toBeGreaterThan(0);
    expect(getAllByAltText('Jest 5 Passed').length).toBeGreaterThan(0);
  });

  it('renders the HTML description correctly using dangerouslySetInnerHTML', (): void => {
    const { container }: RenderResult = render(<Project projectData={mockSingleVersionProject} />);
    
    const description: Element | null = container.querySelector('.project-description');
    expect(description?.innerHTML).toContain('<b>HTML</b>');
  });

  it('renders multiple versions for a multi-version project', (): void => {
    const { getByText, getAllByAltText }: RenderResult = render(<Project projectData={mockMultiVersionProject} />);
    
    // Check version titles
    expect(getByText('version 2.0')).toBeTruthy();
    expect(getByText('version 1.0')).toBeTruthy();
    
    // Check technologies for both versions
    expect(getAllByAltText('React').length).toBeGreaterThan(0);
    expect(getAllByAltText('TypeScript').length).toBeGreaterThan(0);
    expect(getAllByAltText('JavaScript').length).toBeGreaterThan(0);
    expect(getAllByAltText('HTML').length).toBeGreaterThan(0);
    expect(getAllByAltText('CSS').length).toBeGreaterThan(0);
    
    // Check test results for version 2.0
    expect(getAllByAltText('Playwright 15 Passed').length).toBeGreaterThan(0);
  });
}); 