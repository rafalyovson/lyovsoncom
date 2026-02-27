/**
 * Lexical Editor Content Types
 *
 * Type definitions for Lexical rich text editor content structure.
 * Lexical stores content as a tree of nodes in JSON format.
 *
 * @see https://lexical.dev for Lexical documentation
 */

/**
 * Base Lexical node with common properties
 */
interface LexicalBaseNode {
  type: string;
  version: number;
  [key: string]: unknown;
}

/**
 * Text node containing actual content
 */
interface LexicalTextNode extends LexicalBaseNode {
  format?: number;
  style?: string;
  text: string;
  type: "text";
}

/**
 * Element node that can contain children
 */
interface LexicalElementNode extends LexicalBaseNode {
  children?: LexicalNode[];
}

/**
 * Root node of the document
 */
interface LexicalRootNode {
  children: LexicalNode[];
  direction: "ltr" | "rtl" | null;
  format: "" | "left" | "start" | "center" | "right" | "end" | "justify";
  indent: number;
  type: "root";
  version: number;
}

/**
 * Complete Lexical document structure
 */
export interface LexicalDocument {
  root: LexicalRootNode;
  [key: string]: unknown;
}

/**
 * Union type for all possible Lexical nodes
 */
export type LexicalNode = LexicalTextNode | LexicalElementNode | string;

/**
 * Content that can be passed to text extraction
 * Flexible union type to handle various Lexical content formats
 */
export type LexicalContent =
  | LexicalDocument
  | LexicalNode
  | LexicalNode[]
  | string
  | null
  | undefined;
