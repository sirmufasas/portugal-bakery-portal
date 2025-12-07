// src/types/global.d.ts
export {};

declare global {
  interface Window {
    resetApp?: () => void;
  }
}
