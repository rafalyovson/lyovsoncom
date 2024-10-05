'use client';

import { useEffect, useState } from 'react';
import { Image } from '@/data/schema';
import { Button } from '@/components/ui/button';
import { imageSelectAllAction } from '@/data/actions/server-actions/image/image-select-action';
import { ImageCard } from '../image-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/spinner'; // Assuming you have a spinner component

type ImageSelectProps = {
  setImage: (image: Image | null) => void;
  setIsOpen: (isOpen: boolean) => void;
  group?: string;
};

export function ImageSelect(props: ImageSelectProps) {
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [allImages, setAllImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedGroup, setSelectedGroup] = useState<string | undefined>(
    props.group || 'all',
  );
  const [isMoreAvailable, setIsMoreAvailable] = useState(true);
  const limit = 5; // Set the limit for the number of images per page

  // Fetch images with pagination and group filter
  const fetchImages = async (page: number, group: string | undefined) => {
    setLoading(true);
    try {
      const result = await imageSelectAllAction(group, page, limit);
      if (result.success && result.images) {
        setAllImages((prev) =>
          page === 1 ? [...result.images!] : [...prev, ...result.images!],
        );
        setIsMoreAvailable(result.images.length === limit); // Check if more images are available
      } else {
        setError('Failed to fetch images');
      }
    } catch (err) {
      setError('An error occurred while fetching images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages(
      currentPage,
      selectedGroup === 'all' ? undefined : selectedGroup,
    );
  }, [currentPage, selectedGroup]);

  const handleGroupChange = (group: string) => {
    setSelectedGroup(group);
    setCurrentPage(1); // Reset to page 1 on group change
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
      <main className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-full mx-auto">
        {allImages.map((image) => (
          <article
            className={`cursor-pointer flex flex-col gap-2 border rounded-lg overflow-hidden ${
              selectedImage?.id === image.id ? 'border-primary shadow-md' : ''
            }`}
            key={image.id}
            onClick={() => setSelectedImage(image)}
            style={{ width: '150px', height: '150px' }}
          >
            <ImageCard image={image} />
          </article>
        ))}
      </main>

      {/* Load More Button */}
      {isMoreAvailable && (
        <Button
          variant="outline"
          className="mx-auto mt-4 w-full"
          onClick={() => setCurrentPage((prev) => prev + 1)}
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
