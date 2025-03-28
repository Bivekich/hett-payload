'use client';

import React from 'react';
import { RichTextContent } from '../../types/catalog';

interface DescriptionProps {
  text?: string | RichTextContent; // Can be a string or a rich text object
}

// Типы для частей rich text
interface RichTextRoot {
  children: RichTextNode[];
  [key: string]: unknown;
}

interface RichTextNode {
  type: string;
  children?: RichTextNode[];
  text?: string;
  [key: string]: unknown;
}

// Расширенный тип для Lexical rich text
interface LexicalRichText extends RichTextContent {
  root: RichTextRoot;
}

// Function to extract plain text from Lexical rich text format
const extractPlainTextFromRichText = (richText: LexicalRichText): string => {
  if (!richText || !richText.root || !Array.isArray(richText.root.children)) {
    return '';
  }

  // Process each node and check if it has meaningful content
  const paragraphs = richText.root.children
    .map((node: RichTextNode) => {
      // Handle paragraph nodes
      if (node.type === 'paragraph' && node.children) {
        const paragraphText = node.children
          .map((child) => child.text || '')
          .join('');
        return paragraphText.trim(); // Return trimmed text
      }
      // Handle heading nodes
      else if (node.type?.startsWith('heading') && node.children) {
        const headingText = node.children
          .map((child) => child.text || '')
          .join('');
        return headingText.trim(); // Return trimmed text
      }
      // Handle list nodes
      else if ((node.type === 'ul' || node.type === 'ol') && node.children) {
        const listItems = node.children
          .map((listItem) => {
            if (listItem.children) {
              return (
                '• ' +
                listItem.children
                  .map((child) => {
                    if (child.children) {
                      return child.children
                        .map((textNode) => textNode.text || '')
                        .join('');
                    }
                    return child.text || '';
                  })
                  .join('')
              );
            }
            return '';
          })
          .filter((item) => item.trim() !== '') // Only keep non-empty items
          .join('\n');
        return listItems;
      }
      return '';
    })
    .filter((text) => text.trim() !== ''); // Filter out empty paragraphs

  // Join paragraphs with a single newline instead of double
  return paragraphs.join('\n');
};

const Description: React.FC<DescriptionProps> = ({ text }) => {
  // If there's no description text, don't render anything
  if (!text) {
    return null;
  }

  // Check if text is a rich text object
  const isRichText =
    typeof text === 'object' && text !== null && 'root' in text;

  // Extract plain text if it's a rich text object
  const displayText = isRichText
    ? extractPlainTextFromRichText(text as LexicalRichText)
    : String(text);

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
