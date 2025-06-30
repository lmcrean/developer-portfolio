import React from 'react';
import DeveloperBusinessCard from '../components/banner/banner';

/**
 * Banner Test Page Component
 * 
 * A simple page to preview and test the DeveloperBusinessCard banner component
 */
const BannerTest: React.FC = () => {
  return (
    <div className="p-8 min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Banner Component Preview</h1>
      <div className="max-w-4xl mx-auto">
        <DeveloperBusinessCard />
      </div>
    </div>
  );
};

export default BannerTest; 