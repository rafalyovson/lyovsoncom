/**
 * Custom PostgreSQL types for Drizzle ORM
 * Used to extend Payload CMS schema with types not natively supported
 */

import { customType } from "drizzle-orm/pg-core";

/**
 * PostgreSQL tsvector type for full-text search
 *
 * Used for storing pre-processed text search data.
 * Typically used with generated columns and GIN indexes.
 *
 * @example
 * ```typescript
 * search_vector: tsvector("search_vector")
 *   .generatedAlwaysAs(
 *     (): SQL => sql`to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''))`
 *   )
 * ```
 */
export const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});
