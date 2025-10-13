/**
 * Lexical Text Extraction Utilities
 *
 * This module provides utilities for extracting plain text from Lexical editor
 * content stored in JSONB format. Used for generating full-text feeds, search
 * indexing, and content previews.
 *
 * @module extract-lexical-text
 */

import type { LexicalContent } from "@/types/lexical";

/**
 * Extract plain text from Lexical rich text content
 *
 * Recursively traverses the Lexical content tree and extracts all text nodes,
 * joining them with spaces. Handles various Lexical node types and nested
 * structures.
 *
 * @param content - Lexical content in any format (Document, Node, Array, or string)
 * @returns Extracted plain text string
 *
 * @example
 * ```typescript
 * const lexicalContent = {
 *   root: {
 *     children: [
 *       { type: "paragraph", children: [{ type: "text", text: "Hello" }] },
 *       { type: "paragraph", children: [{ type: "text", text: "World" }] }
 *     ]
 *   }
 * };
 *
 * const text = extractLexicalText(lexicalContent);
 * // Returns: "Hello World"
 * ```
 */
export function extractLexicalText(content: LexicalContent): string {
  // Handle null/undefined
  if (!content) {
    return "";
  }

  // Handle string content
  if (typeof content === "string") {
    return content;
  }

  // Handle array of nodes
  if (Array.isArray(content)) {
    return content.map(extractLexicalText).join(" ");
  }

  // Handle object content (nodes or document)
  if (typeof content === "object") {
    // Handle text node with 'text' property
    if ("text" in content && typeof content.text === "string") {
      return content.text;
    }

    // Handle root document with 'root' property
    if ("root" in content && content.root) {
      return extractLexicalText(content.root as LexicalContent);
    }

    // Handle nodes with 'children' property
    if ("children" in content && content.children) {
      return extractLexicalText(content.children as LexicalContent);
    }

    // Handle nodes with 'content' property
    if ("content" in content && content.content) {
      return extractLexicalText(content.content as LexicalContent);
    }
  }

  return "";
}
