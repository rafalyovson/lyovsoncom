import type { CollectionAfterReadHook } from "payload";
import type { Lyovson } from "src/payload-types";

// The `lyovson` collection has access control locked so that lyovsons are not publicly accessible
// This means that we need to populate the authors manually here to protect lyovson privacy
// GraphQL will not return mutated lyovson data that differs from the underlying schema
// So we use an alternative `populatedAuthors` field to populate the lyovson data, hidden from the admin UI
export const populateAuthors: CollectionAfterReadHook = async ({
  doc,
  req,
  req: { payload },
}) => {
  if (doc?.authors) {
    const authorDocs: Lyovson[] = [];

    for (const author of doc.authors) {
      const authorDoc = await payload.findByID({
        id: typeof author === "object" ? author?.id : author,
        collection: "lyovsons",
        depth: 0,
        req,
      });

      if (authorDoc) {
        authorDocs.push(authorDoc as Lyovson);
      }
    }

    doc.populatedAuthors = authorDocs.map((authorDoc) => ({
      id: authorDoc.id,
      name: authorDoc.name,
      username: authorDoc.username,
    }));
  }

  return doc;
};
