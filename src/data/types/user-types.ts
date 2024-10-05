import { SerializedEditorState } from 'lexical';
import { UserOneResponse } from '@/lib/actions/db-actions/user';

export type userOneAction = (
  longBio: SerializedEditorState | null,
  prevState: UserOneResponse,
  formData: FormData,
) => Promise<UserOneResponse>;
