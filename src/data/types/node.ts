export type Node = {
  type: string;
  tag?: string;
  format?: string; // Bitmask for text formatting
  children?: Node[];
  text?: string;
  url?: string;
  ordered?: boolean;
  caption?: string;
  src?: string;
  alt?: string;
};
