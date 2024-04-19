import latinize from 'latinize';
import React from 'react';
import Highlighter from 'react-highlight-words';

interface HighlightedTextProps {
  text: string;
  searchTerm?: Array<string | RegExp>;
}

export const HighlightedText: React.FC<HighlightedTextProps> = ({ text, searchTerm = [] }) => (
  <Highlighter
    sanitize={latinize}
    caseSensitive={false}
    textToHighlight={text}
    searchWords={searchTerm}
  />
);
