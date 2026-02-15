import type React from "react";
import { GridCardNoteFull } from "@/components/grid";
import type { Note } from "@/payload-types";

export type Props = {
  notes: Note[];
};

export const NotesArchive: React.FC<Props> = (props) => {
  const { notes } = props;

  return (
    <>
      {notes?.map((note, index) => {
        if (typeof note === "object" && note !== null) {
          return (
            <GridCardNoteFull
              key={note.slug}
              note={note}
              {...(index === 0 && {
                priority: true,
              })}
            />
          );
        }

        return null;
      })}
    </>
  );
};
