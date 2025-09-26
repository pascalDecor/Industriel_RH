interface EditorJSBlock {
    id: string;
    type: string;
    data: any;
}

interface EditorJSData {
    time: number;
    blocks: EditorJSBlock[];
    version: string;
}

export function convertEditorJSToHTML(content: string): string {
    try {
        const data: EditorJSData = JSON.parse(content);

        if (!data.blocks || !Array.isArray(data.blocks)) {
            return content; // Return as is if not valid Editor.js format
        }

        return data.blocks.map(block => convertBlockToHTML(block)).join('');
    } catch (error) {
        // If parsing fails, assume it's already HTML or plain text
        return content;
    }
}

function convertBlockToHTML(block: EditorJSBlock): string {
    switch (block.type) {
        case 'paragraph':
            return `<p>${block.data.text || ''}</p>`;

        case 'header':
            const level = block.data.level || 1;
            return `<h${level}>${block.data.text || ''}</h${level}>`;

        case 'list':
            const tag = block.data.style === 'ordered' ? 'ol' : 'ul';
            const items = block.data.items?.map((item: any) => {
                // Handle both string items and object items with content property
                const content = typeof item === 'string' ? item : (item.content || '');
                return `<li>${content}</li>`;
            }).join('') || '';
            return `<${tag}>${items}</${tag}>`;

        case 'quote':
            return `<blockquote><p>${block.data.text || ''}</p>${block.data.caption ? `<cite>${block.data.caption}</cite>` : ''}</blockquote>`;

        case 'code':
            return `<pre><code>${block.data.code || ''}</code></pre>`;

        case 'delimiter':
            return '<hr>';

        case 'image':
            const img = block.data.file?.url ?
                `<img src="${block.data.file.url}" alt="${block.data.caption || ''}" style="max-width: 100%; height: auto;" />` : '';
            const caption = block.data.caption ? `<p><em>${block.data.caption}</em></p>` : '';
            return `<div class="image-block">${img}${caption}</div>`;

        case 'table':
            if (!block.data.content || !Array.isArray(block.data.content)) return '';
            const rows = block.data.content.map((row: string[]) =>
                `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`
            ).join('');
            return `<table class="table-block"><tbody>${rows}</tbody></table>`;

        case 'linkTool':
            return `<div class="link-block">
                <a href="${block.data.link}" target="_blank" rel="noopener noreferrer">
                    <div>
                        <h4>${block.data.meta?.title || block.data.link}</h4>
                        ${block.data.meta?.description ? `<p>${block.data.meta.description}</p>` : ''}
                    </div>
                </a>
            </div>`;

        case 'embed':
            return `<div class="embed-block">
                <iframe src="${block.data.embed}" frameborder="0" allowfullscreen style="width: 100%; height: 300px;"></iframe>
                ${block.data.caption ? `<p><em>${block.data.caption}</em></p>` : ''}
            </div>`;

        default:
            // For unknown block types, try to extract text content
            if (block.data.text) {
                return `<p>${block.data.text}</p>`;
            }
            return '';
    }
}