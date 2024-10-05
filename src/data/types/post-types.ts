import { SerializedEditorState } from 'lexical';
import { PostOneResponse } from '@/lib/actions/db-actions/post';

export enum PostType {
  Article = 'article',
  Review = 'review',
  Embed = 'embed',
  Podcast = 'podcast',
  Video = 'video',
}

export const postTypes: PostType[] = [
  PostType.Article,
  PostType.Review,
  PostType.Embed,
  PostType.Podcast,
  PostType.Video,
];

export type postOneAction = (
  content: SerializedEditorState | null,
  prevState: PostOneResponse,
  formData: FormData,
) => Promise<PostOneResponse>;
