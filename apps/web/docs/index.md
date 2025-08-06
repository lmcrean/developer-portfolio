---
slug: /
title: ""
sidebar_label: Development Operations
sidebar_position: 1
hide_table_of_contents: true
---

import ProjectCarousel from '@site/src/components/ProjectCarousel';
import DeveloperBusinessCard from '@site/src/components/banner/banner';
import TypewriterTitle from '@site/src/components/TypewriterTitle';
import TechBadges from '@site/src/components/project/TechBadges';
import TestBadges from '@site/src/components/project/TestBadges';
import GitHubBadges from '@site/src/components/project/GitHubBadges';

<DeveloperBusinessCard />

***

## Dottie {#dottie}

<section>

An AI Chatbot that educates users on their menstrual health records.

<a href="https://github.com/lmcrean/dottie" target="_blank" className="code-btn"><i className="fa fa-code"></i> Code </a> <a href="https://github.com/lmcrean/dottie" target="_blank" className="readme-btn"><i className="fa fa-book"></i> Readme </a> <a href="https://dottie-lmcreans-projects.vercel.app/" target="_blank" className="live-demo-btn"><i className="fa fa-play"></i> Live Demo </a><a href="https://discord.gg/FRxFFgU4cq" target="_blank" className="discord-btn"><i className="fa fa-brands fa-discord"></i> join discord </a>

<ProjectCarousel projectKey="dottie" />

**Role: SQL & Express lead, Code Reviewer**

- Collaborated with Medical specialist and 32+ contributors to take business specification to production codebase.
- Validated a comprehensive Express.js REST API with 20+ endpoints with advanced modular routing
- Designed a flexible database abstraction layer using Knex.js query builder, supporting transaction management between SQLite and PostgreSQL
- Developed a test-driven development workflow with complete codebase coverage using Vitest (unit/integration) and Playwright (e2e), reducing production bugs by 80%.
- Enhanced CI/CD pipeline by designing comprehensive preview branches workflow on Vercel, leading to faster pull request reviews

<TechBadges values="typescript,express,knex,supertest,azure,sql,azureappservices,azuresql,react,tailwindcss" />

<TestBadges tests="vitest:303,playwright:40" />

<GitHubBadges repo="lmcrean/dottie" badges="contributors-anon,stars, last-commit,created-at,commit-activity,issues,issues-closed,issues-pr,issues-pr-closed" />

</section>

## Dynamic Deployment Pipeline

<TechBadges values="csharp,typescript,yml, google cloud, firebase, github actions" />

- Built successful preview branches pipeline for 2 projects developer-portfolio and odyssey
- Used template format to reduce drifting issues between production and previews.
- Pull Requests trigger builds, end to end testing, integration testing and finally deployment 
- This sped up developer operations by 80% and reduced errors in localhost testing