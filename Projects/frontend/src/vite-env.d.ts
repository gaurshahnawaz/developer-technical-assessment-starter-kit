/// <reference types="vite/client" />

import React from 'react'

declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL?: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

declare module '*.svg' {
  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>
  export default content
}
