import { Image } from '@/data/schema';

export type ImageSelectProps = {
  setImage: (image: Image | null) => void;
  setIsOpen: (isOpen: boolean) => void;
  group?: string;
};

export type State = {
  selectedImage: Image | null;
  allImages: Image[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  selectedGroup: string;
  isMoreAvailable: boolean;
};

export type Action =
  | { type: 'SET_SELECTED_IMAGE'; payload: Image | null }
  | { type: 'SET_ALL_IMAGES'; payload: Image[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_CURRENT_PAGE'; payload: number }
  | { type: 'SET_SELECTED_GROUP'; payload: string }
  | { type: 'SET_IS_MORE_AVAILABLE'; payload: boolean };
