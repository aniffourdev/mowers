import dynamic from 'next/dynamic';
import { ComponentType } from 'react';
import React from 'react';

interface DynamicImportOptions {
  ssr?: boolean;
  loading?: () => React.ReactElement;
}

export function dynamicImport<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: DynamicImportOptions = { ssr: true }
) {
  return dynamic(importFunc, {
    loading: options.loading || (() => React.createElement(
      'div',
      { className: 'flex items-center justify-center min-h-[200px]' },
      React.createElement('div', {
        className: 'animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'
      })
    )),
    ssr: options.ssr,
  });
}

// Utility for lazy loading components with preload
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: DynamicImportOptions = { ssr: true }
) {
  const Component = dynamicImport(importFunc, options);
  
  // Add preload capability
  const preload = () => {
    importFunc();
  };

  return {
    Component,
    preload,
  };
} 