/// <reference types="vite/client" />

// We export an empty object so this file is treated as a module
export {};

declare global {
  interface Window {
    Motion?: {
      animate: typeof import("motion").animate;
      inView: typeof import("motion").inView;
    };
  }
}
