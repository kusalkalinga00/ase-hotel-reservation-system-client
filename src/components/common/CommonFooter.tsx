import React from "react";

const CommonFooter = () => {
  return (
    <div className="h-20 border-t border-gray-200 dark:border-gray-700 flex justify-center items-center">
      <footer className="w-full max-w-7xl p-4 text-center">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Saltbay Lounge. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default CommonFooter;
