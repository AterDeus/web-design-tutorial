import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

export const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
      });

      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      containerRef.current.id = id;

      mermaid.render(id, chart).then(({ svg }) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      }).catch(error => {
        console.error('Ошибка при рендеринге диаграммы:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = `<div class="text-red-500">Ошибка при отображении диаграммы: ${error.message}</div>`;
        }
      });
    }
  }, [chart]);

  return <div ref={containerRef} className="mermaid-diagram" />;
}; 