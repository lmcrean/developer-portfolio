"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
require("../css/project.css");
var ProjectCarousel_1 = require("./ProjectCarousel");
/**
 * Project Component
 *
 * Renders a project with header, description, technologies, links and carousel
 * based on the structure in index.md
 */
var Project = function (_a) {
    var projectData = _a.projectData;
    var id = projectData.id, name = projectData.name, _b = projectData.projectTypes, projectTypes = _b === void 0 ? [] : _b, description = projectData.description, _c = projectData.technologies, technologies = _c === void 0 ? [] : _c, _d = projectData.testResults, testResults = _d === void 0 ? [] : _d, githubInfo = projectData.githubInfo, _e = projectData.buttons, buttons = _e === void 0 ? {} : _e, versions = projectData.versions, _f = projectData.slides, slides = _f === void 0 ? [] : _f;
    // Extract project key for carousel ID
    var projectKey = id.split('-')[0];
    // Helper function to get the correct logo name for shields.io
    var getLogoName = function (tech) {
        // Map technology names to their correct shields.io logo names based on index.md
        var logoMap = {
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
            'OAuth2': 'python', // Based on what's in index.md
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
    var generateBadgeUrl = function (label, value, color, logo, logoColor, style) {
        if (logo === void 0) { logo = null; }
        if (logoColor === void 0) { logoColor = 'white'; }
        if (style === void 0) { style = null; }
        // Encode parts for URL
        var encodedLabel = encodeURIComponent(label);
        var encodedValue = encodeURIComponent(value);
        var url = "https://img.shields.io/badge/".concat(encodedLabel, "-").concat(encodedValue, "?color=").concat(color);
        if (logo) {
            url += "&logo=".concat(encodeURIComponent(logo), "&logoColor=").concat(logoColor);
        }
        if (style) {
            url += "&style=".concat(style);
        }
        return url;
    };
    // Generate a shield URL based on the GitHub repo and shield type
    var generateShieldUrl = function (repo, shieldType) {
        if (!repo)
            return null;
        switch (shieldType) {
            case 'lastCommit':
                return "https://img.shields.io/github/last-commit/".concat(repo, "?color=blue");
            case 'createdAt':
                return "https://img.shields.io/github/created-at/".concat(repo, "?color=blue");
            case 'commitActivity':
                return "https://img.shields.io/github/commit-activity/t/".concat(repo, "?color=blue");
            default:
                return null;
        }
    };
    // Function to render a single button
    var renderButton = function (buttonType, buttonData) {
        if (!buttonData || !buttonData.url)
            return null;
        var url = buttonData.url, icon = buttonData.icon, text = buttonData.text;
        return (<a key={buttonType} href={url} target="_blank" rel="noopener noreferrer">
        <button className={"".concat(buttonType, "-btn")}>
          <i className={"fa ".concat(icon)}></i> {text}
        </button>
      </a>);
    };
    // Function to render a single version of the project
    var renderVersion = function (versionData, index) {
        var version = versionData.version, versionDescription = versionData.description, _a = versionData.technologies, versionTechnologies = _a === void 0 ? [] : _a, _b = versionData.testResults, versionTestResults = _b === void 0 ? [] : _b, versionGithubInfo = versionData.githubInfo, _c = versionData.buttons, versionButtons = _c === void 0 ? {} : _c;
        return (<div key={"version-".concat(index)} className="project-version">
        <h3 className="version-title">version {version}</h3>
        
        {/* Version description */}
        <div className="project-description" dangerouslySetInnerHTML={{ __html: versionDescription }}/>
        
        {/* Technology badges */}
        <div className="tech-badges">
          {versionTechnologies.map(function (tech) { return (<img key={tech} src={generateBadgeUrl(tech, '1C1C1C', '1C1C1C', getLogoName(tech), 'white')} alt={tech} className="tech-badge"/>); })}
        </div>
        
        {/* Test result badges for the version */}
        <div className="test-badges">
          {versionTestResults.map(function (test) { return (<img key={test.framework} src={generateBadgeUrl(test.framework, "".concat(test.passed, "_Passed"), 'blue', getLogoName(test.framework), 'white', 'flat-square')} alt={"".concat(test.framework, " ").concat(test.passed, " Passed")} className="test-badge"/>); })}
        </div>
        
        {/* GitHub badges */}
        {versionGithubInfo && versionGithubInfo.repo && (<div className="github-badges">
            {versionGithubInfo.lastCommit && (<img src={generateShieldUrl(versionGithubInfo.repo, 'lastCommit')} alt="Last Commit" className="github-badge"/>)}
            {versionGithubInfo.createdAt && (<img src={generateShieldUrl(versionGithubInfo.repo, 'createdAt')} alt="Created At" className="github-badge"/>)}
            {versionGithubInfo.commitActivity && (<img src={generateShieldUrl(versionGithubInfo.repo, 'commitActivity')} alt="Commit Activity" className="github-badge"/>)}
          </div>)}
        
        {/* Version buttons */}
        <div className="project-buttons">
          {renderButton('code', versionButtons.code)}
          {renderButton('readme', versionButtons.readme)}
          {renderButton('figma', versionButtons.figma)}
          {renderButton('liveDemo', versionButtons.liveDemo)}
        </div>
      </div>);
    };
    return (<div className="project-container">
      {/* Project header with title and type badges */}
      <div className="project-header">
        <h2 className="project-title">{name}</h2>
        <div className="project-type-badges">
          {projectTypes.map(function (type) { return (<img key={type} src={generateBadgeUrl(type, '1C1C1C', '1C1C1C')} alt={type} className="project-type-badge"/>); })}
        </div>
      </div>
      
      {/* Single column layout */}
      <div className="project-content">
        {/* Project carousel */}
        <div className="project-carousel">
          <ProjectCarousel_1.default projectKey={projectKey} slides={slides}/>
        </div>
        
        <div className="project-details">
          {/* If there are versions, render each version */}
          {versions ? (<div className="project-versions">
              {versions.map(function (version, index) { return renderVersion(version, index); })}
            </div>) : (
        // Otherwise render the single project details
        <>
              {/* Project description */}
              <div className="project-description" dangerouslySetInnerHTML={{ __html: description }}/>
              
              {/* Technology badges */}
              <div className="tech-badges">
                {technologies.map(function (tech) { return (<img key={tech} src={generateBadgeUrl(tech, '1C1C1C', '1C1C1C', getLogoName(tech), 'white')} alt={tech} className="tech-badge"/>); })}
              </div>
              
              {/* Test result badges */}
              <div className="test-badges">
                {testResults.map(function (test) { return (<img key={test.framework} src={generateBadgeUrl(test.framework, "".concat(test.passed, "_Passed"), 'blue', getLogoName(test.framework), 'white', 'flat-square')} alt={"".concat(test.framework, " ").concat(test.passed, " Passed")} className="test-badge"/>); })}
              </div>
              
              {/* GitHub badges */}
              {githubInfo && githubInfo.repo && (<div className="github-badges">
                  {githubInfo.lastCommit && (<img src={generateShieldUrl(githubInfo.repo, 'lastCommit')} alt="Last Commit" className="github-badge"/>)}
                  {githubInfo.createdAt && (<img src={generateShieldUrl(githubInfo.repo, 'createdAt')} alt="Created At" className="github-badge"/>)}
                  {githubInfo.commitActivity && (<img src={generateShieldUrl(githubInfo.repo, 'commitActivity')} alt="Commit Activity" className="github-badge"/>)}
                </div>)}
              
              {/* Project buttons */}
              <div className="project-buttons">
                {renderButton('code', buttons.code)}
                {renderButton('readme', buttons.readme)}
                {renderButton('figma', buttons.figma)}
                {renderButton('liveDemo', buttons.liveDemo)}
              </div>
            </>)}
        </div>
      </div>
    </div>);
};
exports.default = Project;
