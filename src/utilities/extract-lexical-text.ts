/**
 * Lexical Text Extraction Utilities
 *
 * This module provides utilities for extracting plain text from Lexical editor
 * content stored in JSONB format. Used for generating full-text feeds, search
 * indexing, and content previews.
 *
 * @module extract-lexical-text
 */

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
export function extractLexicalText(content: unknown): string {
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
      return extractLexicalText(content.root);
    }

    // Handle nodes with 'children' property
    if ("children" in content && content.children) {
      return extractLexicalText(content.children);
    }

    // Handle nodes with 'content' property
    if ("content" in content && content.content) {
      return extractLexicalText(content.content);
    }
  }

  return "";
}

/**
 * Extract plain text from Lexical rich text content, preserving line breaks.
 *
 * Useful for poem / verse excerpts where line breaks are meaningful.
 *
 * - Paragraph nodes become newline-delimited blocks
 * - linebreak nodes become '\n'
 */
export function extractLexicalTextWithNewlines(content: unknown): string {
  if (!content) {
    return "";
  }

  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map(extractLexicalTextWithNewlines)
      .filter(Boolean)
      .join("\n");
  }

  if (typeof content === "object") {
    // Text node
    if ("text" in content && typeof content.text === "string") {
      return content.text;
    }

    // Root document
    if ("root" in content && content.root) {
      return extractLexicalTextWithNewlines(content.root);
    }

    // Lexical node with type
    if ("type" in content && typeof content.type === "string") {
      if (content.type === "linebreak") {
        return "\n";
      }

      if (
        content.type === "paragraph" &&
        "children" in content &&
        content.children
      ) {
        const paragraph = extractLexicalTextWithNewlines(
          content.children
        ).trim();
        return paragraph;
      }
    }

    if ("children" in content && content.children) {
      return extractLexicalTextWithNewlines(content.children);
    }
    if ("content" in content && content.content) {
      return extractLexicalTextWithNewlines(content.content);
    }
  }

  return "";
}
