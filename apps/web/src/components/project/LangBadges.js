"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBadgeUrl = exports.TECH_BADGES = void 0;
exports.TECH_BADGES = {
    // Languages
    typescript: { name: 'Typescript', logo: 'typescript' },
    javascript: { name: 'JavaScript', logo: 'javascript' },
    python: { name: 'Python', logo: 'python' },
    html: { name: 'HTML', logo: 'html5' },
    css: { name: 'CSS', logo: 'css3' },
    sql: { name: 'SQL', logo: 'sql' },
    // Frameworks & Libraries
    react: { name: 'React', logo: 'react' },
    nextjs: { name: 'Next.js', logo: 'next.js' },
    express: { name: 'Express', logo: 'express' },
    django: { name: 'Django_REST', logo: 'django' },
    tailwindcss: { name: 'TailwindCSS', logo: 'tailwind-css' },
    vite: { name: 'Vite', logo: 'vite' },
    docusaurus: { name: 'Docusaurus', logo: 'docusaurus' },
    framermotion: { name: 'FramerMotion', logo: 'framer' },
    // Databases
    knex: { name: 'Knex', logo: 'knex' },
    postgresql: { name: 'PostgreSQL', logo: 'postgresql' },
    dynamodb: { name: 'DynamoDB', logo: 'amazon' },
    amazonrds: { name: 'Amazon_RDS', logo: 'amazon' },
    // Testing
    supertest: { name: 'Supertest', logo: 'supertest' },
    jest: { name: 'Jest', logo: 'jest' },
    vitest: { name: 'Vitest', logo: 'vitest' },
    playwright: { name: 'Playwright', logo: 'playwright' },
    cypress: { name: 'Cypress', logo: 'cypress' },
    pytest: { name: 'Pytest', logo: 'pytest' },
    // Cloud & Deployment
    azure: { name: 'Azure', logo: 'windows' },
    azureappservices: { name: 'Azure_App_Services', logo: 'windows' },
    azuresql: { name: 'Azure_SQL', logo: 'windows' },
    aws: { name: 'AWS', logo: 'amazon' },
    lambda: { name: 'Lambda', logo: 'amazon' },
    vercel: { name: 'Vercel', logo: 'vercel' },
    heroku: { name: 'Heroku', logo: 'heroku' },
    githubpages: { name: 'Github_Pages', logo: 'github' },
    cloudinary: { name: 'Cloudinary', logo: 'cloudinary' },
    // Tools & Services
    nodejs: { name: 'Node.js', logo: 'node.js' },
    oauth2: { name: 'OAuth2', logo: 'oauth' },
    jwt: { name: 'JWT', logo: 'json-web-token' },
    figma: { name: 'Figma', logo: 'figma' },
    googlesheets: { name: 'Google_Sheets', logo: 'google-sheets' },
};
var generateBadgeUrl = function (techKey, baseColor, logoColor) {
    if (baseColor === void 0) { baseColor = '1C1C1C'; }
    if (logoColor === void 0) { logoColor = 'white'; }
    var tech = exports.TECH_BADGES[techKey.toLowerCase()];
    if (!tech) {
        // Fallback for unknown tech
        var fallbackName = techKey.charAt(0).toUpperCase() + techKey.slice(1);
        return {
            url: "https://img.shields.io/badge/".concat(fallbackName, "-").concat(baseColor, "?&logo=").concat(techKey.toLowerCase(), "&logoColor=").concat(logoColor),
            alt: fallbackName
        };
    }
    var color = tech.color || baseColor;
    var logoColorFinal = tech.logoColor || logoColor;
    return {
        url: "https://img.shields.io/badge/".concat(tech.name, "-").concat(color, "?&logo=").concat(tech.logo, "&logoColor=").concat(logoColorFinal),
        alt: tech.name.replace(/_/g, ' ')
    };
};
exports.generateBadgeUrl = generateBadgeUrl;
