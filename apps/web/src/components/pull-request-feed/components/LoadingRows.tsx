import React from 'react';

interface LoadingRowsProps {
  rowCount?: number;
}

export const LoadingRows: React.FC<LoadingRowsProps> = ({ rowCount = 20 }) => {
  return (
    <>
      {Array.from({ length: rowCount }, (_, index) => (
        <div 
          key={index} 
          className="grid grid-cols-12 gap-4 max-sm:gap-2 px-4 max-sm:px-1 py-4 animate-pulse"
        >
          {/* Repository Column */}
          <div className="col-span-3 max-lg:col-span-4 flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gray-700 light:bg-gray-200 flex-shrink-0"></div>
            <div className="h-4 bg-gray-700 light:bg-gray-200 rounded w-20"></div>
          </div>

          {/* Title Column */}
          <div className="col-span-5 max-lg:col-span-8 flex items-center">
            <div className="h-4 bg-gray-700 light:bg-gray-200 rounded w-3/4"></div>
          </div>

          {/* Language Column */}
          <div className="col-span-2 max-lg:hidden flex items-center">
            <div className="h-6 bg-gray-700 light:bg-gray-200 rounded-full w-16"></div>
          </div>

          {/* Status Column */}
          <div className="col-span-2 max-lg:hidden flex items-center justify-end">
            <div className="flex items-center gap-2">
              <div className="h-4 bg-gray-700 light:bg-gray-200 rounded w-16"></div>
              <div className="h-3 bg-gray-700 light:bg-gray-200 rounded w-12"></div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default LoadingRows;