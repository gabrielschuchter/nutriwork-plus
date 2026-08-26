import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export function MarkdownArticle({ content }: { content: string }) {
  return (
    <div className="news-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children, node: _node, ...props }) => {
            const isExternal = Boolean(href?.startsWith('http://') || href?.startsWith('https://'));
            return <a href={href} target={isExternal ? '_blank' : undefined} rel={isExternal ? 'noreferrer' : undefined} {...props}>{children}</a>;
          },
          img: ({ src, alt, node: _node, ...props }) => <img src={src} alt={alt ?? ''} loading="lazy" {...props} />
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
