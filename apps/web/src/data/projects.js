"use strict";
/**
 * Projects Data
 * This file contains the configuration for all projects
 */
Object.defineProperty(exports, "__esModule", { value: true });
var projects = {
    odyssey: {
        id: 'odyssey-project',
        name: 'Odyssey',
        projectTypes: ['Full-Stack', 'API'],
        description: 'Developed Social Media application with Auth, messaging and media sharing features • Unified API and Frontend into a singular repository to improve security standards and ensure compatibility with Safari browsers • Integrated Cloudinary media storage; improved performance with cached rendering • 78 automated tests across four testing frameworks (see above) including comprehensive alert feeback • integrated automatic testing screenshots for enhanced insights into frontend alerts • OAuth2/JWT authentication • Automated Heroku deployments through CLI • integrated customised SVG logo • integrated dark mode toggle with animated transition  • customised highly responsive Navbar for each device size, including popout menu for further options',
        technologies: [
            'Python',
            'React',
            'TailwindCSS',
            'Vercel',
            'Cloudinary',
            'PostgreSQL',
            'Django',
            'AWS',
            'Heroku',
            'OAuth2',
            'JWT',
            'Amazon RDS'
        ],
        testResults: [
            { framework: 'Playwright', passed: 32, logo: 'playwright' },
            { framework: 'Jest', passed: 5, logo: 'jest' },
            { framework: 'Cypress', passed: 3, logo: 'cypress' },
            { framework: 'Python', passed: 38, logo: 'python' },
            { framework: 'Pytest', passed: 20, logo: 'pytest' }
        ],
        commitId: 'a7b9c2d',
        githubInfo: {
            repo: 'lmcrean/odyssey-api',
            lastCommit: true,
            createdAt: true,
            commitActivity: true
        },
        buttons: {
            code: {
                url: 'https://github.com/lmcrean/odyssey-api',
                icon: 'fa-code',
                text: 'code'
            },
            readme: {
                url: 'https://odyssey-docs.lauriecrean.dev',
                icon: 'fa-book',
                text: 'readme'
            },
            figma: {
                url: 'https://www.figma.com/design/E9mOo72sSEqIjSplAMipFE/Odyssey?node-id=0-1&t=90jvE8D1JwHqgqVY-1',
                icon: 'fa-paint-brush',
                text: 'mockup'
            },
            liveDemo: {
                url: 'https://odyssey.lauriecrean.dev',
                icon: 'fa-play',
                text: 'live demo'
            }
        },
        slides: [
            {
                src: '/screenshots/odyssey.png',
                alt: 'Odyssey Screenshot'
            },
            {
                src: '/screenshots/odyssey-E.png',
                alt: 'Odyssey Screenshot'
            },
            {
                src: '/screenshots/odyssey-D.png',
                alt: 'Odyssey Screenshot D'
            },
            {
                src: '/screenshots/odyssey-A.png',
                alt: 'Odyssey Screenshot A'
            },
            {
                src: '/screenshots/odyssey-B.png',
                alt: 'Odyssey Screenshot B'
            },
            {
                src: '/screenshots/odyssey-C.png',
                alt: 'Odyssey Screenshot C'
            }
        ]
    },
    coachmatrix: {
        id: 'coachmatrix-project',
        name: 'Coach Matrix',
        projectTypes: ['Full-Stack', 'API'],
        description: 'Social platform focused on professional development • Custom authentication and permission system • OAuth2/JWT authentication • Content voting and ranking algorithm with Python • Automated Heroku deployment pipeline  • enhanced frontend animations with video landing and customised CSS logo',
        technologies: [
            'JavaScript',
            'Python',
            'HTML',
            'CSS',
            'PostgreSQL',
            'Django',
            'Amazon RDS',
            'AWS',
            'OAuth2',
            'JWT',
            'Heroku'
        ],
        testResults: [
            { framework: 'Playwright', passed: 3, logo: 'playwright' },
            { framework: 'Python', passed: 4, logo: 'python' },
            { framework: 'Pytest', passed: 6, logo: 'pytest' }
        ],
        githubInfo: {
            repo: 'lmcrean/coach-matrix',
            lastCommit: true,
            createdAt: true,
            commitActivity: true
        },
        buttons: {
            code: {
                url: 'https://github.com/lmcrean/coach-matrix',
                icon: 'fa-code',
                text: 'code'
            },
            figma: {
                url: 'https://www.figma.com/design/jXT4Bi1WXVwYG4daO3Yczi/Coach-Matrix?node-id=1-89&t=J0AI0eKKLWvVg5Lj-1',
                icon: 'fa-paint-brush',
                text: 'mockup'
            },
            liveDemo: {
                url: 'https://coach-matrix-d2cd1e717f81.herokuapp.com/',
                icon: 'fa-play',
                text: 'live demo'
            }
        },
        slides: [
            {
                src: '/screenshots/coachmatrix-A.png',
                alt: 'Coach Matrix Screenshot'
            },
            {
                src: '/screenshots/coachmatrix-B.png',
                alt: 'Coach Matrix Dashboard'
            }
        ]
    },
    steamreport: {
        id: 'steamreport-project',
        name: 'Steam Report',
        projectTypes: ['Full-Stack', 'API'],
        description: 'Implemented data aggregation system for career pathway analysis •  Achieved 100% test coverage (12 Playwright E2E, 2 Jest unit tests) • Architected scalable web client with React and Express.js • Implemented serverless backend using AWS Lambda and S3, reducing hosting costs • Built responsive UI with TailwindCSS improving mobile engagement • CI/CD pipeline with Vercel enabling automated deployments',
        technologies: [
            'React',
            'Next.js',
            'TailwindCSS',
            'JavaScript',
            'Vite',
            'AWS',
            'Lambda',
            'DynamoDB',
            'Express',
            'Vercel',
            'Python',
            'Node.js',
            'Heroku',
            'Google Sheets'
        ],
        testResults: [
            { framework: 'Playwright', passed: 12, logo: 'playwright' },
            { framework: 'Jest', passed: 2, logo: 'jest' },
            { framework: 'Vitest', passed: 19, logo: 'vitest' }
        ],
        githubInfo: {
            repo: 'lmcrean/steam-report-mern',
            lastCommit: true,
            createdAt: true,
            commitActivity: true
        },
        buttons: {
            code: {
                url: 'https://github.com/lmcrean/steam-report-mern',
                icon: 'fa-code',
                text: 'code'
            },
            readme: {
                url: 'https://steamreport-docs.lauriecrean.dev',
                icon: 'fa-book',
                text: 'readme'
            },
            figma: {
                url: 'https://www.figma.com/design/r3srLkPpbnMviUOIZeNjk7/Steam-Report?node-id=0-1&t=FBS5ZDxiWmtVBPeq-1',
                icon: 'fa-paint-brush',
                text: 'mockup'
            },
            liveDemo: {
                url: 'https://steamreport.lauriecrean.dev',
                icon: 'fa-play',
                text: 'live demo'
            }
        },
        slides: [
            {
                src: '/screenshots/steamreport-v2-A.png',
                alt: 'Steam Report Dashboard'
            },
            {
                src: '/screenshots/steamreport-v2-B.png',
                alt: 'Steam Report Analysis Page'
            }
        ]
    },
    buffalo: {
        id: 'buffalo-project',
        name: 'Buffalo',
        projectTypes: ['Full-Stack', 'API'],
        description: 'Developed an AWS authentication feature running on Amplify though TDD. Migrated version 1.0 to a more efficent framework in unified AWS ecosystem. Established robust test coverage with Vitest for unit tests and Playwright for E2E tests.',
        technologies: [
            'Amplify',
            'React',
            'TailwindCSS',
            'Vite',
            'GraphQL',
            'Cognito',
            'S3',
            'AWS',
            'Lambda',
            'DynamoDB',
            'API Gateway',
            'Python',
            'Django',
            'JWT'
        ],
        testResults: [
            { framework: 'Playwright', passed: 12, logo: 'playwright' },
            { framework: 'Vitest', passed: 67, logo: 'vitest' },
            { framework: 'Python', passed: 7, logo: 'python' }
        ],
        githubInfo: {
            repo: 'lmcrean/odyssey-v2-amplify-vite',
            lastCommit: true,
            createdAt: true,
            commitActivity: true
        },
        buttons: {
            code: {
                url: 'https://github.com/lmcrean/odyssey-v2-amplify-vite',
                icon: 'fa-code',
                text: 'code'
            },
            liveDemo: {
                url: 'https://main.d1l70uc5e2kcii.amplifyapp.com/',
                icon: 'fa-play',
                text: 'live demo'
            }
        },
        slides: [
            {
                src: '/screenshots/buffalo.png',
                alt: 'Buffalo Screenshot'
            },
            {
                src: '/screenshots/buffalo2.png',
                alt: 'Buffalo Components'
            },
            {
                src: '/screenshots/buffalo3.png',
                alt: 'Buffalo Mobile View'
            },
            {
                src: '/screenshots/buffalo4.png',
                alt: 'Buffalo Typography'
            },
            {
                src: '/screenshots/buffalo5.png',
                alt: 'Buffalo Grid System'
            }
        ]
    },
    lauriecrean: {
        id: 'lauriecrean-project',
        name: 'Laurie Crean Portfolio',
        projectTypes: ['Frontend', 'Documentation'],
        description: 'Built this portfolio website using Docusaurus and React • Custom component system for presenting projects, skills and experience • Integrated automated testing and CI/CD pipeline • Custom syntax highlighting and documentation features • Optimized for performance and SEO',
        technologies: [
            'Docusaurus',
            'Vitest',
            'Playwright',
            'Docsify',
            'HTML',
            'CSS',
            'JavaScript',
            'Github Pages',
            'React',
            'Next.js',
            'TailwindCSS',
            'FramerMotion',
            'Vercel'
        ],
        testResults: [
            { framework: 'Vitest', passed: 33, logo: 'vitest' },
            { framework: 'Playwright', passed: 12, logo: 'playwright' }
        ],
        githubInfo: {
            repo: 'lmcrean/lauriecrean',
            lastCommit: true,
            createdAt: true,
            commitActivity: true
        },
        buttons: {
            code: {
                url: 'https://github.com/lmcrean/lauriecrean',
                icon: 'fa-code',
                text: 'code'
            },
            readme: {
                url: 'https://github.com/lmcrean/lauriecrean#readme',
                icon: 'fa-book',
                text: 'readme'
            },
            liveDemo: {
                url: 'https://lauriecrean.dev',
                icon: 'fa-play',
                text: 'live demo'
            }
        },
        slides: [
            {
                src: '/screenshots/lauriecrean-v3.png',
                alt: 'Portfolio Homepage'
            },
            {
                src: '/screenshots/laurie-crean-v2.png',
                alt: 'Portfolio Projects Page'
            }
        ]
    },
    hoverboard: {
        id: 'hoverboard-project',
        name: 'Hoverboard',
        projectTypes: ['Frontend'],
        description: 'Ported HTML CSS to React • Integrated TailwindCSS into workflow for more efficient styling • integrated Vercel deployment pipeline',
        technologies: [
            'JavaScript',
            'React',
            'Next.js',
            'TailwindCSS',
            'Vercel',
            'Figma',
            'HTML',
            'CSS',
            'Bootstrap',
            'Github Pages'
        ],
        testResults: [],
        githubInfo: {
            repo: 'lmcrean/hoverboard-react',
            lastCommit: true,
            createdAt: true,
            commitActivity: true
        },
        buttons: {
            code: {
                url: 'https://github.com/lmcrean/hoverboard-react',
                icon: 'fa-code',
                text: 'code'
            },
            liveDemo: {
                url: 'https://hoverboard-react.vercel.app/',
                icon: 'fa-play',
                text: 'live demo'
            }
        },
        slides: [
            {
                src: '/screenshots/hoverboard.png',
                alt: 'Hoverboard Game Screenshot'
            },
            {
                src: '/screenshots/hoverboard-v2.png',
                alt: 'Hoverboard High Scores'
            }
        ]
    },
    crocodilekingdom: {
        id: 'crocodilekingdom-project',
        name: 'Crocodile Kingdom',
        projectTypes: ['Frontend', 'LocalStorage'],
        description: 'Refined gameplay logic to creative word association game with validation • Ported essential Javascript features into React • Integrated Tailwind CSS into workflow.',
        technologies: [
            'JavaScript',
            'React',
            'TailwindCSS',
            'Vercel',
            'Vitest',
            'HTML',
            'CSS',
            'Bootstrap',
            'Github Pages'
        ],
        testResults: [
            { framework: 'Vitest', passed: 53, logo: 'vitest' }
        ],
        githubInfo: {
            repo: 'lmcrean/crocodile-kingdom-mern',
            lastCommit: true,
            createdAt: true,
            commitActivity: true
        },
        buttons: {
            code: {
                url: 'https://github.com/lmcrean/crocodile-kingdom-mern',
                icon: 'fa-code',
                text: 'code'
            },
            liveDemo: {
                url: 'https://crocodilekingdom.lauriecrean.dev/',
                icon: 'fa-play',
                text: 'live demo'
            }
        },
        slides: [
            {
                src: '/screenshots/crocodilegame-A.png',
                alt: 'Crocodile Kingdom Gameplay'
            },
            {
                src: '/screenshots/crocodilegame-B.png',
                alt: 'Crocodile Kingdom Menu'
            }
        ]
    }
};
exports.default = projects;
