import React from 'react';
import '../../css/project.css';
import ProjectCarousel from './ProjectCarousel';
import { ProjectData, ButtonData, ProjectVersion } from '../../data/projects';

interface ProjectProps {
  projectData: ProjectData;
}

/**
 * Project Component
 * 
 * Renders a project with header, description, technologies, links and carousel
 * based on the structure in index.md
 */
const Project: React.FC<ProjectProps> = ({ projectData }) => {
  const {
    id,
    name,
    projectTypes = [],
    description,
    technologies = [],
    testResults = [],
    githubInfo,
    buttons = {},
    versions,
    slides = []
  } = projectData;

  // Extract project key for carousel ID
  const projectKey = id.split('-')[0];

  // Helper function to get the correct logo name for shields.io
  const getLogoName = (tech: string): string => {
    // Map technology names to their correct shields.io logo names based on index.md
    const logoMap = {
      'Node.js': 'node.js',
      'JavaScript': 'javascript',
      'React': 'react',
      'React.js': 'react',
      'Python': 'python',
      'Django': 'django',
      'PostgreSQL': 'postgresql',
      'HTML': 'html5',
      'CSS': 'css3',
      'TailwindCSS': 'tailwind-css',
      'FramerMotion': 'framer',
      'AWS': 'amazon',
      'Heroku': 'heroku',
      'Vercel': 'vercel',
      'Vite': 'vite',
      'Amazon RDS': 'amazon',
      'Azure App Services': 'azure',
      'Azure': 'windows',
      'OAuth2': 'python',  // Based on what's in index.md
      'JWT': 'json',
      'Django REST': 'django',
      'GitHub Actions': 'github',
      'Github Actions': 'github',
      'Google Sheets': 'google-sheets',
      'Playwright': 'playwright',
      'Pytest': 'pytest',
      'Jest': 'jest',
      'Cypress': 'cypress',
      'ASP.NET': 'asp.net',
      'C#': 'c',
      'Next.js': 'next.js'
    };
    
    return logoMap[tech] || tech.toLowerCase();
  };

  // Function to generate a badge URL
  const generateBadgeUrl = (
    label: string, 
    value: string, 
    color: string, 
    logo: string | null = null, 
    logoColor: string = 'white', 
    style: string | null = null
  ): string => {
    // Encode parts for URL
    const encodedLabel = encodeURIComponent(label);
    const encodedValue = encodeURIComponent(value);
    
    let url = `https://img.shields.io/badge/${encodedLabel}-${encodedValue}?color=${color}`;
    
    if (logo) {
      url += `&logo=${encodeURIComponent(logo)}&logoColor=${logoColor}`;
    }
    
    if (style) {
      url += `&style=${style}`;
    }
    
    return url;
  };

  // Generate a shield URL based on the GitHub repo and shield type
  const generateShieldUrl = (repo: string, shieldType: string): string | null => {
    if (!repo) return null;
    
    switch (shieldType) {
      case 'lastCommit':
        return `https://img.shields.io/github/last-commit/${repo}?color=blue`;
      case 'createdAt':
        return `https://img.shields.io/github/created-at/${repo}?color=blue`;
      case 'commitActivity':
        return `https://img.shields.io/github/commit-activity/t/${repo}?color=blue`;
      default:
        return null;
    }
  };

  // Function to render a single button
  const renderButton = (buttonType: string, buttonData: ButtonData | undefined): JSX.Element | null => {
    if (!buttonData || !buttonData.url) return null;
    
    const { url, icon, text } = buttonData;
    
    return (
      <a 
        key={buttonType} 
        href={url} 
        target="_blank" 
        rel="noopener noreferrer" 
      >
        <button className={`${buttonType}-btn`}>
          <i className={`fa ${icon}`}></i> {text}
        </button>
      </a>
    );
  };

  // Function to render a single version of the project
  const renderVersion = (versionData: ProjectVersion, index: number): JSX.Element => {
    const {
      version,
      description: versionDescription,
      technologies: versionTechnologies = [],
      testResults: versionTestResults = [],
      githubInfo: versionGithubInfo,
      buttons: versionButtons = {}
    } = versionData;

    return (
      <div key={`version-${index}`} className="project-version">
        <h3 className="version-title">version {version}</h3>
        
        {/* Version description */}
        <div 
          className="project-description" 
          dangerouslySetInnerHTML={{ __html: versionDescription }} 
        />
        
        {/* Technology badges */}
        <div className="tech-badges">
          {versionTechnologies.map(tech => (
            <img 
              key={tech} 
              src={generateBadgeUrl(tech, '1C1C1C', '1C1C1C', getLogoName(tech), 'white')} 
              alt={tech} 
              className="tech-badge" 
            />
          ))}
        </div>
        
        {/* Test result badges for the version */}
        <div className="test-badges">
          {versionTestResults.map(test => (
            <img 
              key={test.framework} 
              src={generateBadgeUrl(test.framework, `${test.passed}_Passed`, 'blue', getLogoName(test.framework), 'white', 'flat-square')} 
              alt={`${test.framework} ${test.passed} Passed`} 
              className="test-badge" 
            />
          ))}
        </div>
        
        {/* GitHub badges */}
        {versionGithubInfo && versionGithubInfo.repo && (
          <div className="github-badges">
            {versionGithubInfo.lastCommit && (
              <img 
                src={generateShieldUrl(versionGithubInfo.repo, 'lastCommit')} 
                alt="Last Commit" 
                className="github-badge" 
              />
            )}
            {versionGithubInfo.createdAt && (
              <img 
                src={generateShieldUrl(versionGithubInfo.repo, 'createdAt')} 
                alt="Created At" 
                className="github-badge" 
              />
            )}
            {versionGithubInfo.commitActivity && (
              <img 
                src={generateShieldUrl(versionGithubInfo.repo, 'commitActivity')} 
                alt="Commit Activity" 
                className="github-badge" 
              />
            )}
          </div>
        )}
        
        {/* Version buttons */}
        <div className="project-buttons">
          {renderButton('code', versionButtons.code)}
          {renderButton('readme', versionButtons.readme)}
          {renderButton('figma', versionButtons.figma)}
          {renderButton('liveDemo', versionButtons.liveDemo)}
        </div>
      </div>
    );
  };

  return (
    <div className="project-container">
      {/* Project header with title and type badges */}
      <div className="project-header">
        <h2 className="project-title">{name}</h2>
        <div className="project-type-badges">
          {projectTypes.map(type => (
            <img 
              key={type} 
              src={generateBadgeUrl(type, '1C1C1C', '1C1C1C')} 
              alt={type} 
              className="project-type-badge" 
            />
          ))}
        </div>
      </div>
      
      {/* Single column layout */}
      <div className="project-content">
        {/* Project carousel */}
        <div className="project-carousel">
          <ProjectCarousel projectKey={projectKey} slides={slides} />
        </div>
        
        <div className="project-details">
          {/* If there are versions, render each version */}
          {versions ? (
            <div className="project-versions">
              {versions.map((version, index) => renderVersion(version, index))}
            </div>
          ) : (
            // Otherwise render the single project details
            <>
              {/* Project description */}
              <div 
                className="project-description" 
                dangerouslySetInnerHTML={{ __html: description }} 
              />
              
              {/* Technology badges */}
              <div className="tech-badges">
                {technologies.map(tech => (
                  <img 
                    key={tech} 
                    src={generateBadgeUrl(tech, '1C1C1C', '1C1C1C', getLogoName(tech), 'white')} 
                    alt={tech} 
                    className="tech-badge" 
                  />
                ))}
              </div>
              
              {/* Test result badges */}
              <div className="test-badges">
                {testResults.map(test => (
                  <img 
                    key={test.framework} 
                    src={generateBadgeUrl(test.framework, `${test.passed}_Passed`, 'blue', getLogoName(test.framework), 'white', 'flat-square')} 
                    alt={`${test.framework} ${test.passed} Passed`} 
                    className="test-badge" 
                  />
                ))}
              </div>
              
              {/* GitHub badges */}
              {githubInfo && githubInfo.repo && (
                <div className="github-badges">
                  {githubInfo.lastCommit && (
                    <img 
                      src={generateShieldUrl(githubInfo.repo, 'lastCommit')} 
                      alt="Last Commit" 
                      className="github-badge" 
                    />
                  )}
                  {githubInfo.createdAt && (
                    <img 
                      src={generateShieldUrl(githubInfo.repo, 'createdAt')} 
                      alt="Created At" 
                      className="github-badge" 
                    />
                  )}
                  {githubInfo.commitActivity && (
                    <img 
                      src={generateShieldUrl(githubInfo.repo, 'commitActivity')} 
                      alt="Commit Activity" 
                      className="github-badge" 
                    />
                  )}
                </div>
              )}
              
              {/* Project buttons */}
              <div className="project-buttons">
                {renderButton('code', buttons.code)}
                {renderButton('readme', buttons.readme)}
                {renderButton('figma', buttons.figma)}
                {renderButton('liveDemo', buttons.liveDemo)}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Project; 