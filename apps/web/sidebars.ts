import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Main sidebar with all documents
  docs: [
    {
      type: 'doc',
      id: 'index',
      label: 'Software Projects',
    },
    {
      type: 'doc',
      id: 'data-projects',
      label: 'Data Projects',
    },
    {
      type: 'doc',
      id: 'pull-request-feed',
      label: 'Pull Requests',
      customProps: {
        badge: 'live'
      }
    },
    {
      type: 'link',
      label: 'Agile Pipeline',
      href: 'https://github.com/users/lmcrean/projects/',
    },
    {
      type: 'doc',
      id: 'certifications',
      label: 'Certifications',
    },
  ],
};

export default sidebars;
