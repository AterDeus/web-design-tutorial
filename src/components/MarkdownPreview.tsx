import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import mermaid from 'mermaid';
import type { Components } from 'react-markdown';

interface MarkdownPreviewProps {
  content: string;
}

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const mermaidStyles = `
  .mermaid-diagram {
    min-height: 200px;
    margin: 1rem 0;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 0.375rem;
  }
  .mermaid-diagram svg {
    max-width: 100%;
    height: auto;
  }
`;

export const MarkdownPreview: FC<MarkdownPreviewProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [renderedContent, setRenderedContent] = useState<string>('');

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose'
    });

    const processContent = async () => {
      // Находим все блоки кода с тегом mermaid
      const mermaidRegex = /```mermaid\n([\s\S]*?)\n```/g;
      let processedContent = content;
      let match;
      let index = 0;

      while ((match = mermaidRegex.exec(content)) !== null) {
        const diagramId = `mermaid-${index++}`;
        const diagramContent = match[1];
        
        try {
          const { svg } = await mermaid.render(diagramId, diagramContent);
          processedContent = processedContent.replace(
            match[0],
            `<div class="mermaid-diagram">${svg}</div>`
          );
        } catch (error) {
          console.error('Ошибка при рендеринге диаграммы:', error);
          processedContent = processedContent.replace(
            match[0],
            '<div class="text-red-500">Ошибка при отображении диаграммы</div>'
          );
        }
      }

      setRenderedContent(processedContent);
    };

    processContent();
  }, [content]);

  const components: Components = {
    code: ({ node, inline, className, children, ...props }: CodeProps) => {
      const match = /language-(\w+)/.exec(className || '');
      if (!inline && match && match[1] === 'mermaid') {
        return null; // Пропускаем блоки кода mermaid, так как они уже обработаны
      }
      return !inline && match ? (
        <pre className={className}>
          <code className={className} {...props}>
            {children}
          </code>
        </pre>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    }
  };

  return (
    <>
      <style>{mermaidStyles}</style>
      <div ref={containerRef} className="prose max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={components}
        >
          {renderedContent}
        </ReactMarkdown>
      </div>
    </>
  );
}; 