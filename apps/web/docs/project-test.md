---
slug: /project-test
title: "Project Test"
sidebar_label: Project Test
sidebar_position: 2
hide_table_of_contents: false
---

import Project from '@site/src/components/archive/Project';
import projects from '@site/src/data/projects';
import SplideInit from '@site/src/components/archive/SplideInit';

<img src="/docs/banner.png" alt="banner" />

Welcome to my portfolio website! This page demonstrates how to use the reusable Project component architecture for displaying projects, compared to the approach used in the index page.

***

<Project projectData={projects.odyssey} />

<Project projectData={projects.coachmatrix} />

<Project projectData={projects.steamreport} />

<Project projectData={projects.buffalo} />

<Project projectData={projects.lauriecrean} />

<Project projectData={projects.hoverboard} />

<Project projectData={projects.crocodilekingdom} />

<SplideInit />