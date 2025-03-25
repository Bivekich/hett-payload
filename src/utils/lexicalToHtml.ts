/**
 * Define types for Lexical nodes
 */
interface LexicalNode {
  type: string;
  [key: string]: unknown;
}

interface LexicalTextNode extends LexicalNode {
  type: "text";
  text: string;
  format?: number;
}

interface LexicalParagraphNode extends LexicalNode {
  type: "paragraph";
  children: LexicalNode[];
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
}

interface LexicalListNode extends LexicalNode {
  type: "list";
  listType: "bullet" | "number" | "check";
  children: LexicalListItemNode[];
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

interface LexicalContent {
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
 * Converts Lexical editor content to HTML
 */
export function lexicalToHtml(content: LexicalContent): string {
  if (!content || !content.root) {
    return "";
  }

  const { root } = content;

  // Process each child node
  const htmlParts = root.children
    .map((nodeData: unknown) => {
      const node = nodeData as LexicalNode;
      
      // Handle paragraph nodes
      if (node.type === "paragraph") {
        const paragraphNode = node as LexicalParagraphNode;
        const textContent = processTextChildren(paragraphNode.children);
        return `<p>${textContent}</p>`;
      }

      // Handle heading nodes (h1-h6)
      if (node.type === "heading") {
        const headingNode = node as LexicalHeadingNode;
        const level = headingNode.tag || "h2"; // Default to h2 if tag is not specified
        const textContent = processTextChildren(headingNode.children);
        return `<${level}>${textContent}</${level}>`;
      }

      // Handle list nodes (ordered, unordered and check lists)
      if (node.type === "list") {
        const listNode = node as LexicalListNode;
        const listType = listNode.listType === "number" ? "ol" : "ul";
        const isCheckList = listNode.listType === "check";
        
        const listItems = listNode.children
          .map((listItem: LexicalListItemNode) => {
            if (listItem.type === "listitem") {
              let textContent = "";
              
              // Process children of list item
              if (listItem.children && listItem.children.length > 0) {
                textContent = listItem.children
                  .map((child: LexicalNode) => {
                    if (child.type === "text") {
                      return processTextNode(child as LexicalTextNode);
                    }
                    if (child.type === "paragraph") {
                      return processTextChildren((child as LexicalParagraphNode).children);
                    }
                    if (child.type === "link") {
                      return processLinkNode(child as LexicalLinkNode);
                    }
                    return "";
                  })
                  .join("");
              }
              
              // Add checkbox for check lists
              if (isCheckList) {
                const checked = listItem.checked ? "checked" : "";
                return `<li><input type="checkbox" ${checked} disabled /> ${textContent}</li>`;
              }
              
              return `<li>${textContent}</li>`;
            }
            return "";
          })
          .join("");

        return `<${listType}>${listItems}</${listType}>`;
      }

      // Handle blockquote nodes
      if (node.type === "quote") {
        const quoteNode = node as LexicalQuoteNode;
        const textContent = quoteNode.children
          .map((child: LexicalNode) => {
            if (child.type === "paragraph") {
              return `<p>${processTextChildren((child as LexicalParagraphNode).children)}</p>`;
            }
            return "";
          })
          .join("");

        return `<blockquote>${textContent}</blockquote>`;
      }

      // Handle link nodes at the root level
      if (node.type === "link") {
        return processLinkNode(node as LexicalLinkNode);
      }

      return "";
    })
    .join("");

  return htmlParts;
}

/**
 * Process an array of text nodes and apply formatting
 */
function processTextChildren(children: LexicalNode[]): string {
  if (!children || !Array.isArray(children)) {
    return "";
  }
  
  return children
    .map((child: LexicalNode) => {
      if (child.type === "text") {
        return processTextNode(child as LexicalTextNode);
      }
      if (child.type === "link") {
        return processLinkNode(child as LexicalLinkNode);
      }
      return "";
    })
    .join("");
}

/**
 * Process a single text node and apply formatting
 */
function processTextNode(node: LexicalTextNode): string {
  if (!node || !node.text) {
    return "";
  }
  
  let text = node.text;

  // Apply text formatting
  if (node.format === 1 || (node.format && (node.format & 1) === 1)) {
    // Bold
    text = `<strong>${text}</strong>`;
  }
  if (node.format === 2 || (node.format && (node.format & 2) === 2)) {
    // Italic
    text = `<em>${text}</em>`;
  }
  if (node.format === 4 || (node.format && (node.format & 4) === 4)) {
    // Underline
    text = `<u>${text}</u>`;
  }
  if (node.format === 8 || (node.format && (node.format & 8) === 8)) {
    // Strikethrough
    text = `<s>${text}</s>`;
  }
  
  return text;
}

/**
 * Process a link node
 */
function processLinkNode(node: LexicalLinkNode): string {
  if (!node || !node.url) {
    return "";
  }
  
  let content = "";
  
  // Handle direct text in link node
  if (node.text) {
    content = node.text;
  }
  // Handle child nodes
  else if (node.children && node.children.length > 0) {
    content = node.children
      .map((child: LexicalNode) => {
        if (child.type === "text") {
          return processTextNode(child as LexicalTextNode);
        }
        return "";
      })
      .join("");
  }

  return `<a href="${node.url}" target="_blank" rel="noopener noreferrer">${content}</a>`;
}
