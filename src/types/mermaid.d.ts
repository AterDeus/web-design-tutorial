declare module 'mermaid/dist/mermaid.esm.mjs' {
  interface MermaidConfig {
    startOnLoad?: boolean;
    theme?: string;
    securityLevel?: string;
  }

  interface Mermaid {
    initialize: (config: MermaidConfig) => void;
    render: (id: string, text: string) => Promise<{ svg: string }>;
  }

  const mermaid: Mermaid;
  export default mermaid;
}

declare module 'mermaid' {
  interface MermaidConfig {
    startOnLoad?: boolean;
    theme?: string;
    securityLevel?: string;
  }

  interface Mermaid {
    initialize: (config: MermaidConfig) => void;
    render: (id: string, text: string) => Promise<{ svg: string }>;
  }

  const mermaid: Mermaid;
  export default mermaid;
}

declare module 'remark-mermaid' {
  const remarkMermaid: any;
  export default remarkMermaid;
} 