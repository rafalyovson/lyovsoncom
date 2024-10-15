'use client';

import { useEffect, useReducer } from 'react';
import { Button } from '@/components/shadcn/ui/button';
import { imageSelectAllAction } from '@/data/actions/server-actions/image/image-select-action';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/ui/select';
import { Spinner } from '@/components/spinner';
import { ImageGrid } from '@/components/dungeon/image-select/image-grid'; // Assuming you have a spinner component
import { ImageSelectProps, State } from './image-select-types';
import { ImageSelectReducer } from './image-select-reducer';

const initialState: State = {
  selectedImage: null,
  allImages: [],
  loading: true,
  error: null,
  currentPage: 1,
  selectedGroup: 'all',
  isMoreAvailable: true,
};

export function ImageSelect(props: ImageSelectProps) {
  const [state, dispatch] = useReducer(ImageSelectReducer, {
    ...initialState,
    selectedGroup: props.group || 'all',
  });

  const {
    selectedImage,
    allImages,
    loading,
    error,
    currentPage,
    selectedGroup,
    isMoreAvailable,
  } = state;

  const limit = 10; // Set the limit for the number of images per page

  // Fetch images with pagination and group filter
  const fetchImages = async (page: number, group: string | undefined) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const result = await imageSelectAllAction({ page, limit, group });
      if (result.success && result.images) {
        dispatch({ type: 'SET_ALL_IMAGES', payload: result.images });
        dispatch({
          type: 'SET_IS_MORE_AVAILABLE',
          payload: result.images.length === limit,
        });
      } else {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch images' });
      }
    } catch (err) {
      dispatch({
        type: 'SET_ERROR',
        payload: 'An error occurred while fetching images',
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    fetchImages(
      currentPage,
      selectedGroup === 'all' ? undefined : selectedGroup,
    );
  }, [currentPage, selectedGroup]);

  const handleGroupChange = (group: string) => {
    dispatch({ type: 'SET_SELECTED_GROUP', payload: group });
  };

  if (loading && currentPage === 1)
    return (
      <div className="flex justify-center">
        <Spinner />
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;
  if (!allImages.length && !loading) return <div>No Images</div>;

  return (
    <section className="flex flex-col gap-4 ">
      {/* Group Filter Dropdown */}
      <Select onValueChange={handleGroupChange} defaultValue={selectedGroup}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Group" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="post">Post</SelectItem>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="test">Test</SelectItem>

          {/* Add more groups as needed */}
        </SelectContent>
      </Select>

      {/* Image Grid */}
      <ImageGrid
        dispatch={dispatch}
        images={allImages}
        selectedImage={selectedImage || undefined}
      />

      {/* Load More Button */}
      {isMoreAvailable && (
        <Button
          variant="outline"
          className="mx-auto mt-4 w-full"
          onClick={() =>
            dispatch({ type: 'SET_CURRENT_PAGE', payload: currentPage + 1 })
          }
        >
          Load More
        </Button>
      )}

      {/* Select Button */}
      <Button
        variant={'default'}
        onClick={() => {
          props.setImage(selectedImage);
          props.setIsOpen(false);
        }}
      >
        Select Image
      </Button>
    </section>
  );
}
