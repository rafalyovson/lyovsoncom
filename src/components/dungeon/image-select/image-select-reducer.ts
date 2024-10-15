import {
  Action,
  State,
} from '@/components/dungeon/image-select/image-select-types';

export function ImageSelectReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_SELECTED_IMAGE':
      return { ...state, selectedImage: action.payload };
    case 'SET_ALL_IMAGES':
      return {
        ...state,
        allImages:
          state.currentPage === 1
            ? [...action.payload]
            : [...state.allImages, ...action.payload],
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_SELECTED_GROUP':
      return { ...state, selectedGroup: action.payload, currentPage: 1 };
    case 'SET_IS_MORE_AVAILABLE':
      return { ...state, isMoreAvailable: action.payload };
    default:
      return state;
  }
}
