'use client';

import LazyImage from './LazyImage';

interface EditorJSBlock {
  type: string;
  data: any;
}

interface EditorJSContent {
  blocks?: EditorJSBlock[];
}

export default function EditorContent({ content }: { content: any }) {
  if (!content || JSON.stringify(content) === JSON.stringify({})) {
    return <div className="text-gray-500 italic">Aucun contenu disponible</div>;
  }

  const renderBlock = (block: EditorJSBlock, index: number) => {
    switch (block.type) {
      case 'paragraph':
        return (
          <p 
            key={index} 
            className="mb-6 text-sm leading-relaxed text-gray-800"
            dangerouslySetInnerHTML={{ __html: block.data.text }}
          />
        );
      
      case 'header':
        const level = block.data.level || 2;
        const HeaderTag = `h${level}` as keyof React.JSX.IntrinsicElements;
        const headerStyles = {
          1: 'text-2xl font-bold text-gray-900 mb-6 mt-8 leading-tight',
          2: 'text-xl font-bold text-gray-900 mb-5 mt-7 leading-tight',
          3: 'text-lg font-semibold text-gray-800 mb-4 mt-6',
          4: 'text-base font-semibold text-gray-800 mb-3 mt-5',
          5: 'text-sm font-medium text-gray-700 mb-3 mt-4 uppercase tracking-wide',
          6: 'text-xs font-medium text-gray-700 mb-2 mt-3 uppercase tracking-wide'
        };
        return (
          <HeaderTag 
            key={index} 
            className={headerStyles[level as keyof typeof headerStyles] || headerStyles[2]}
            dangerouslySetInnerHTML={{ __html: block.data.text }}
          />
        );
      
      case 'list':
        const ListTag = block.data.style === 'ordered' ? 'ol' : 'ul';
        const listStyles = block.data.style === 'ordered' 
          ? 'list-decimal list-inside space-y-3 mb-8 ml-4' 
          : 'list-disc list-inside space-y-3 mb-8 ml-4';
        return (
          <ListTag key={index} className={listStyles}>
            {block.data.items.map((item: any, itemIndex: number) => {
              // Gestion des différents formats d'éléments de liste
              let itemText = '';
              if (typeof item === 'string') {
                itemText = item;
              } else if (typeof item === 'object' && item.content) {
                itemText = item.content;
              } else if (typeof item === 'object' && item.text) {
                itemText = item.text;
              } else {
                itemText = String(item);
              }
              
              return (
                <li 
                  key={itemIndex} 
                  className="text-sm text-gray-800 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: itemText }}
                />
              );
            })}
          </ListTag>
        );
      
      case 'quote':
        return (
          <blockquote 
            key={index} 
            className="border-l-4 border-blue-500 pl-8 pr-4 my-10 bg-gradient-to-r from-blue-50 to-transparent py-6 rounded-r-lg"
          >
            <div className="relative">
              <div className="text-6xl text-blue-200 absolute -top-4 -left-2">"</div>
              <p 
                className="text-base italic text-gray-700 leading-relaxed relative z-10"
                dangerouslySetInnerHTML={{ __html: block.data.text }} 
              />
              {block.data.caption && (
                <footer className="text-sm text-gray-500 mt-4 font-medium">
                  — {block.data.caption}
                </footer>
              )}
            </div>
          </blockquote>
        );
      
      case 'image':
        return (
          <figure key={index} className="my-12">
            <div className="rounded-xl overflow-hidden shadow-xl bg-white">
              <LazyImage 
                src={block.data.file?.url || block.data.url} 
                alt={block.data.caption || 'Image de l\'article'}
                width={800}
                height={400}
                className="w-full h-auto object-cover"
              />
            </div>
            {block.data.caption && (
              <figcaption className="text-center text-sm text-gray-600 mt-4 italic px-4">
                {block.data.caption}
              </figcaption>
            )}
          </figure>
        );
      
      case 'code':
        return (
          <div key={index} className="my-8">
            <pre className="bg-gray-900 text-green-400 p-6 rounded-xl overflow-x-auto shadow-lg">
              <code className="text-sm font-mono whitespace-pre">
                {block.data.code}
              </code>
            </pre>
          </div>
        );
      
      case 'delimiter':
        return (
          <div key={index} className="flex justify-center my-12">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
            </div>
          </div>
        );
      
      case 'table':
        return (
          <div key={index} className="my-8 overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <tbody>
                {block.data.content.map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    {row.map((cell: string, cellIndex: number) => (
                      <td 
                        key={cellIndex}
                        className="px-4 py-3 border-b border-gray-200 text-sm text-gray-800"
                        dangerouslySetInnerHTML={{ __html: cell }}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      
      case 'checklist':
        return (
          <div key={index} className="my-8 space-y-3">
            {block.data.items.map((item: any, itemIndex: number) => (
              <div key={itemIndex} className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    item.checked 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-gray-300 bg-white'
                  }`}>
                    {item.checked && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
                <span 
                  className={`text-sm leading-relaxed ${
                    item.checked ? 'text-gray-600 line-through' : 'text-gray-800'
                  }`}
                  dangerouslySetInnerHTML={{ __html: item.text }}
                />
              </div>
            ))}
          </div>
        );
      
      case 'warning':
        return (
          <div key={index} className="my-8 bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg shadow-sm">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-yellow-800 mb-2">
                  {block.data.title || 'Attention'}
                </h3>
                <p 
                  className="text-yellow-700"
                  dangerouslySetInnerHTML={{ __html: block.data.message }}
                />
              </div>
            </div>
          </div>
        );

      default:
        // Pour les types non reconnus, essayons de les afficher de manière basique
        return (
          <div key={index} className="my-6 p-4 bg-gray-50 border-l-4 border-gray-300 rounded-r">
            <p className="text-sm text-gray-600 mb-2">
              Type de contenu: {block.type}
            </p>
            {block.data.text && (
              <div dangerouslySetInnerHTML={{ __html: block.data.text }} />
            )}
          </div>
        );
    }
  };

  const renderContent = () => {
    try {
      // Gestion des différents formats de contenu
      let parsedContent: EditorJSContent;
      
      if (typeof content === 'string') {
        try {
          parsedContent = JSON.parse(content);
        } catch {
          return <p className="text-sm text-gray-800">{content}</p>;
        }
      } else if (Array.isArray(content)) {
        // Si c'est un tableau, prendre le premier élément
        parsedContent = content[0] || {};
      } else {
        parsedContent = content;
      }

      if (!parsedContent.blocks || !Array.isArray(parsedContent.blocks)) {
        return <div className="text-gray-500 italic">Format de contenu non reconnu</div>;
      }

      return parsedContent.blocks.map((block, index) => renderBlock(block, index));
    } catch (error) {
      console.error('Erreur lors du rendu du contenu:', error);
      return (
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 font-medium">Erreur lors de l'affichage du contenu</p>
          <p className="text-red-500 text-sm mt-2">
            Veuillez contacter l'administrateur si ce problème persiste.
          </p>
        </div>
      );
    }
  };

  return (
    <article className="max-w-none">
      <div className="prose-custom">
        {renderContent()}
      </div>
    </article>
  );
}
