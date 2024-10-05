import { SerializedEditorState } from 'lexical';
import { UserOneResponse } from '@/data/actions/db-actions/user';

export type userOneAction = (
  longBio: SerializedEditorState | null,
  prevState: UserOneResponse,
  formData: FormData,
) => Promise<UserOneResponse>;
