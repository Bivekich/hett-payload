"use client";

import React from "react";

// Define types for Lexical content
interface LexicalContent {
  root: {
    children: LexicalNode[];
    direction: string | null;
    format: string;
    indent: number;
    type: string;
    version: number;
  };
}

interface LexicalNode {
  type: string;
  children?: LexicalNode[];
  text?: string;
  [key: string]: unknown;
}

interface DescriptionProps {
  text?: string | LexicalContent; // Can be a string or a rich text object
}

// Function to extract plain text from Lexical rich text format
const extractPlainTextFromRichText = (richText: LexicalContent): string => {
  if (!richText || !richText.root || !richText.root.children) {
    return '';
  }

  // Process each node and check if it has meaningful content
  const paragraphs = richText.root.children
    .map((node: LexicalNode) => {
      // Handle paragraph nodes
      if (node.type === 'paragraph' && node.children) {
        const paragraphText = node.children
          .map((child: LexicalNode) => child.text || '')
          .join('');
        return paragraphText.trim(); // Return trimmed text
      }
      // Handle heading nodes
      else if (node.type?.startsWith('heading') && node.children) {
        const headingText = node.children
          .map((child: LexicalNode) => child.text || '')
          .join('');
        return headingText.trim(); // Return trimmed text
      }
      // Handle list nodes
      else if ((node.type === 'ul' || node.type === 'ol') && node.children) {
        const listItems = node.children
          .map((listItem: LexicalNode) => {
            if (listItem.children) {
              return '• ' + listItem.children
                .map((child: LexicalNode) => {
                  if (child.children) {
                    return child.children
                      .map((textNode: LexicalNode) => textNode.text || '')
                      .join('');
                  }
                  return child.text || '';
                })
                .join('');
            }
            return '';
          })
          .filter(item => item.trim() !== '') // Only keep non-empty items
          .join('\n');
        return listItems;
      }
      return '';
    })
    .filter(text => text.trim() !== ''); // Filter out empty paragraphs
  
  // Join paragraphs with a single newline instead of double
  return paragraphs.join('\n');
};

const Description: React.FC<DescriptionProps> = ({ text }) => {
  // If there's no description text, don't render anything
  if (!text) {
    return null;
  }
  
  // Check if text is a rich text object
  const isRichText = typeof text === 'object' && text !== null && 'root' in text;
  
  // Extract plain text if it's a rich text object
  const displayText = isRichText ? extractPlainTextFromRichText(text as LexicalContent) : String(text || '');
  
  // If after extraction we still don't have text, don't render
  if (!displayText || displayText.trim() === '') {
    return null;
  }
  
  return (
    <>
      <div className="text-[28px] font-extrabold font-[Roboto_Condensed] text-black mb-4">
        Описание
      </div>
      <div className="text-[16px] whitespace-pre-line font-[Roboto_Condensed] text-black">
        {displayText}
      </div>
    </>
  );
};

export default Description;
