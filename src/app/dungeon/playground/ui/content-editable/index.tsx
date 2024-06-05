import "./content-editable.css";

import { ContentEditable as CE } from "@lexical/react/LexicalContentEditable";

export const ContentEditable = ({
  className,
}: {
  className?: string;
}): JSX.Element => {
  return <CE className={className || "ContentEditable__root"} />;
};
