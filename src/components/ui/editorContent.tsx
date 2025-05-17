'use client';

import EditorJSHTML from 'editorjs-html';

export default function EditorContent({ content }: { content: any }) {
  if (!content || JSON.stringify(content) === JSON.stringify({})) {
    return <div></div>;
  }
  const edjsParser = EditorJSHTML();
  const htmlBlocks = edjsParser.parse(content);
  
  return (
    <div className="prose max-w-none">
      <div key={0} dangerouslySetInnerHTML={{ __html: htmlBlocks }} />
    </div>
  );
}
