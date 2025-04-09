/**
 * Define types for Lexical nodes
 */
interface LexicalNode {
  type: string;
  children?: LexicalNode[];
  text?: string;
  format?: number | string;
  style?: string;
  textStyle?: string;
  tag?: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  url?: string;
}

interface LexicalParagraphNode extends LexicalNode {
  type: "paragraph";
  children: LexicalNode[];
  textStyle?: string;
}

interface LexicalHeadingNode extends LexicalNode {
  type: "heading";
  tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  children: LexicalNode[];
}

interface LexicalListItemNode extends LexicalNode {
  type: "listitem";
  children: LexicalNode[];
  checked?: boolean;
  value?: number;
}

interface LexicalListNode extends LexicalNode {
  type: 'list';
  listType: 'bullet' | 'number';
  start?: number;
  tag?: string;
}

interface LexicalQuoteNode extends LexicalNode {
  type: "quote";
  children: LexicalNode[];
}

interface LexicalLinkNode extends LexicalNode {
  type: "link";
  url: string;
  text?: string;
  children?: LexicalNode[];
}

export interface LexicalContent {
  root: {
    children: unknown[];
    direction: string | null;
    format: string;
    indent: number;
    type: string;
    version: number;
  };
}

/**
 * Helper function to check if a node has meaningful content
 */
function hasContent(node: LexicalNode): boolean {
  if (!node) return false;
  
  // Text node with content
  if (node.text?.trim()) return true;
  
  // Node with children - check if any child has content
  if (node.children?.length) {
    return node.children.some(child => hasContent(child as LexicalNode));
  }
  
  return false;
}

/**
 * Process text formatting for inline elements
 */
function processTextFormatting(node: LexicalNode): string {
  let text = node.text || '';
  
  // Apply text formatting
  if (node.bold) {
    text = `<strong class="font-bold">${text}</strong>`;
  }
  if (node.italic) {
    text = `<em class="italic">${text}</em>`;
  }
  if (node.underline) {
    text = `<u>${text}</u>`;
  }
  if (node.strikethrough) {
    text = `<s>${text}</s>`;
  }
  
  // Handle links
  if (node.type === 'link' && (node as LexicalLinkNode).url) {
    text = `<a href="${(node as LexicalLinkNode).url}" class="text-[#38AE34] hover:underline">${text}</a>`;
  }
  
  return text;
}

/**
 * Process children nodes and combine their text content
 */
function processTextChildren(children: LexicalNode[] = []): string {
  return children
    .map(child => {
      if (child.type === 'text' || child.type === 'link') {
        return processTextFormatting(child);
      }
      return '';
    })
    .join('');
}

/**
 * Process list items recursively
 */
function processListItems(node: LexicalListItemNode): string {
  const content = node.children
    ? node.children
        .map(child => {
          if (child.type === 'text' || child.type === 'link') {
            return processTextFormatting(child as LexicalNode);
          } else if (child.type === 'list') {
            const listNode = child as unknown as LexicalListNode;
            return processList(listNode);
          }
          return '';
        })
        .join('')
    : '';
    
  return `<li class="mb-2 last:mb-0 text-[16px] leading-[1.4] font-[Roboto_Condensed] text-[#181818]">${content}</li>`;
}

/**
 * Process list nodes
 */
function processList(node: LexicalListNode): string {
  const listItems = node.children
    ?.map(child => {
      if (child.type === 'listitem') {
        return processListItems(child as LexicalListItemNode);
      }
      return '';
    })
    .join('') || '';
    
  const tag = node.listType === 'number' ? 'ol' : 'ul';
  const listClass = 'pl-6 mb-4 last:mb-0';
  
  return `<${tag} class="${listClass}">${listItems}</${tag}>`;
}

/**
 * Converts Lexical editor content to HTML with proper styling
 */
export function lexicalToHtml(content: LexicalContent): string {
  if (!content || !content.root) {
    return "";
  }

  const { root } = content;

  // Filter out empty nodes first
  const filteredNodes = (root.children as LexicalNode[]).filter(node => 
    hasContent(node as LexicalNode)
  );

  if (filteredNodes.length === 0) {
    return "";
  }

  // Process each node
  const htmlParts = filteredNodes.map((node: LexicalNode) => {
    // Handle paragraph nodes
    if (node.type === "paragraph") {
      const paragraphNode = node as LexicalParagraphNode;
      const textContent = processTextChildren(paragraphNode.children);
      
      // Check for text style (title)
      if (paragraphNode.textStyle === "title") {
        return textContent.trim() 
          ? `<h2 class="text-[28px] font-extrabold font-[Roboto_Condensed] text-black mb-4">${textContent}</h2>` 
          : "";
      }
      
      return textContent.trim() 
        ? `<p class="text-[16px] leading-[1.6] font-[Roboto_Condensed] text-[#181818] mb-4 last:mb-0">${textContent}</p>` 
        : "";
    }

    // Handle heading nodes (h1-h6)
    if (node.type.startsWith("heading")) {
      const headingNode = node as LexicalHeadingNode;
      const textContent = processTextChildren(headingNode.children);
      const tag = headingNode.tag || "h2";
      
      const headingClasses = {
        h1: "text-[32px] leading-[1.2]",
        h2: "text-[28px] leading-[1.2]",
        h3: "text-[24px] leading-[1.3]",
        h4: "text-[20px] leading-[1.3]",
        h5: "text-[18px] leading-[1.4]",
        h6: "text-[16px] leading-[1.4]"
      }[tag];

      return textContent.trim() 
        ? `<${tag} class="${headingClasses} font-extrabold font-[Roboto_Condensed] text-black mb-4 mt-6 first:mt-0">${textContent}</${tag}>` 
        : "";
    }

    // Handle lists
    if (node.type === "list") {
      const listNode = node as unknown as LexicalListNode;
      return processList(listNode);
    }

    // Handle blockquotes
    if (node.type === "quote") {
      const quoteNode = node as LexicalQuoteNode;
      const textContent = processTextChildren(quoteNode.children);
      
      return textContent.trim()
        ? `<blockquote class="border-l-4 border-[#38AE34] pl-4 my-4 italic text-[#4A4A4A]"><p class="text-[16px] leading-[1.6] font-[Roboto_Condensed]">${textContent}</p></blockquote>`
        : "";
    }

    return "";
  });

  return htmlParts.join("\n");
}