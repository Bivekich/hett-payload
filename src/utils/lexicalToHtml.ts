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
 * Helper function to check if a node has meaningful content
 */
function hasContent(node: LexicalNode): boolean {
  if (!node) return false;

  // Text nodes
  if (node.type === "text") {
    return ((node as LexicalTextNode).text || "").trim() !== "";
  }

  // Paragraph and heading nodes
  if ((node.type === "paragraph" || node.type.startsWith("heading")) && (node as LexicalParagraphNode).children) {
    return (node as LexicalParagraphNode).children.some(child => hasContent(child as LexicalNode));
  }

  // List nodes
  if (node.type === "list" && (node as LexicalListNode).children) {
    return (node as LexicalListNode).children.some(listItem => {
      if (listItem.children) {
        return listItem.children.some(child => hasContent(child as LexicalNode));
      }
      return false;
    });
  }

  // Link nodes
  if (node.type === "link") {
    const linkNode = node as LexicalLinkNode;
    if (linkNode.text && linkNode.text.trim() !== "") return true;
    if (linkNode.children && linkNode.children.length > 0) {
      return linkNode.children.some(child => hasContent(child as LexicalNode));
    }
  }

  // For other node types, assume they have content
  return true;
}

/**
 * Converts Lexical editor content to HTML
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
      return textContent.trim() ? `<p>${textContent}</p>` : "";
    }

    // Handle heading nodes (h1-h6)
    if (node.type.startsWith("heading")) {
      const headingNode = node as LexicalHeadingNode;
      const level = headingNode.tag || "h2"; // Default to h2 if tag is not specified
      const textContent = processTextChildren(headingNode.children);
      return textContent.trim() ? `<${level}>${textContent}</${level}>` : "";
    }

    // Handle list nodes (ordered, unordered and check lists)
    if (node.type === "list") {
      const listNode = node as LexicalListNode;
      const listType = listNode.listType === "number" ? "ol" : "ul";
      const isCheckList = listNode.listType === "check";
      
      // Filter out empty list items
      const listItems = listNode.children
        .filter(item => hasContent(item as LexicalNode))
        .map(listItem => {
          if (listItem.type !== "listitem") return "";
          
          // Process children of list item
          let textContent = processListItemChildren(listItem.children);
          
          // Skip empty list items
          if (!textContent.trim()) return "";
          
          // Add checkbox for check lists
          if (isCheckList) {
            const checked = listItem.checked ? "checked" : "";
            return `<li><input type="checkbox" ${checked} disabled />${textContent}</li>`;
          }
          
          return `<li>${textContent}</li>`;
        })
        .filter(html => html);

      return listItems.length ? `<${listType}>${listItems.join("")}</${listType}>` : "";
    }

    // Handle blockquote nodes
    if (node.type === "quote") {
      const quoteNode = node as LexicalQuoteNode;
      
      // Process paragraph children inside quote
      const paragraphs = quoteNode.children
        .filter(child => hasContent(child as LexicalNode))
        .map(child => {
          if (child.type === "paragraph") {
            const content = processTextChildren((child as LexicalParagraphNode).children);
            return content.trim() ? `<p>${content}</p>` : "";
          }
          return "";
        })
        .filter(html => html);

      return paragraphs.length ? `<blockquote>${paragraphs.join("")}</blockquote>` : "";
    }

    // Handle link nodes at the root level
    if (node.type === "link") {
      return processLinkNode(node as LexicalLinkNode);
    }

    return "";
  });

  // Filter out empty strings and join
  return htmlParts.filter(part => part.trim()).join("");
}

/**
 * Process children of a list item node
 */
function processListItemChildren(children: LexicalNode[]): string {
  if (!children || !Array.isArray(children) || children.length === 0) {
    return "";
  }

  return children
    .filter(child => hasContent(child as LexicalNode))
    .map(child => {
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
    .filter(text => text.trim())
    .join("");
}

/**
 * Process an array of text nodes and apply formatting
 */
function processTextChildren(children: LexicalNode[]): string {
  if (!children || !Array.isArray(children) || children.length === 0) {
    return "";
  }
  
  return children
    .filter(child => hasContent(child as LexicalNode))
    .map(child => {
      if (child.type === "text") {
        return processTextNode(child as LexicalTextNode);
      }
      if (child.type === "link") {
        return processLinkNode(child as LexicalLinkNode);
      }
      return "";
    })
    .filter(text => text.trim())
    .join("");
}

/**
 * Process a single text node and apply formatting
 */
function processTextNode(node: LexicalTextNode): string {
  if (!node || !node.text || node.text.trim() === "") {
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
      .filter(child => hasContent(child as LexicalNode))
      .map(child => {
        if (child.type === "text") {
          return processTextNode(child as LexicalTextNode);
        }
        return "";
      })
      .filter(text => text.trim())
      .join("");
  }

  return content.trim() ? `<a href="${node.url}" target="_blank" rel="noopener noreferrer">${content}</a>` : "";
}