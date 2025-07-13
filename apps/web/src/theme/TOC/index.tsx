import React from 'react';
import { useLocation } from '@docusaurus/router';
import CustomTOC from '@site/src/components/CustomTOC';

/**
 * Custom TOC Theme Component
 * 
 * This overrides Docusaurus's default TOC behavior
 * Only renders the custom TOC on the index page
 */
export default function TOC(): JSX.Element | null {
  const location = useLocation();
  
  // Only show custom TOC on the index page
  if (location.pathname === '/') {
    return <CustomTOC />;
  }
  
  // For all other pages (like Pull Requests), don't render any TOC
  return null;
} 