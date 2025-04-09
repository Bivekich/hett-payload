"use client";

import React from "react";
import { lexicalToHtml } from "@/utils/lexicalToHtml";

// Define types for Lexical content
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

interface DescriptionProps {
  text?: string | LexicalContent; // Can be a string or a rich text object
}

const Description: React.FC<DescriptionProps> = ({ text }) => {
  // If there's no description text, don't render anything
  if (!text) {
    return null;
  }
  
  let lexicalContent: LexicalContent | null = null;
  let displayContent = '';

  // Handle different formats of text input
  try {
    if (typeof text === 'string') {
      // Try to parse if it's a JSON string
      lexicalContent = JSON.parse(text);
    } else if (typeof text === 'object' && text !== null) {
      lexicalContent = text;
    }
  } catch (e) {
    // If parsing fails, treat it as plain text
    console.error('Error parsing Lexical content:', e);
    displayContent = String(text || '');
  }
  
  // Convert to HTML if it's valid Lexical content
  if (lexicalContent && 'root' in lexicalContent) {
    try {
      displayContent = lexicalToHtml(lexicalContent);
    } catch (e) {
      console.error('Error converting Lexical to HTML:', e);
      displayContent = String(text || '');
    }
  }
  
  // If after conversion we still don't have content, don't render
  if (!displayContent || displayContent.trim() === '') {
    return null;
  }
  
  return (
    <div className="mb-8">
      <h2 className="text-[28px] font-extrabold font-[Roboto_Condensed] text-black mb-4">
        Описание
      </h2>
      <div 
        className="description-content text-[16px] leading-[1.4] font-[Roboto_Condensed] text-[#181818]"
        dangerouslySetInnerHTML={{ __html: displayContent }}
      />
    </div>
  );
};

export default Description;
