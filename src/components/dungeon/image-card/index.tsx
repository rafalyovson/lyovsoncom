import { Card, CardContent } from '@/components/shadcn/ui/card';
import { Image as ImageType } from '@/data/schema';
import Image from 'next/image';

export const ImageCard = ({
  image,
  className,
}: {
  image: ImageType;
  className?: string;
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 border rounded-lg overflow-hidden">
      <CardContent className="p-0 w-full h-full">
        <Image
          className={`object-cover w-full h-full ${className}`}
          src={image.url}
          alt={image.altText || 'Uploaded image'}
          width={150}
          height={150}
          sizes="(max-width: 640px) 100px, (max-width: 768px) 150px, 200px"
        />
      </CardContent>
    </Card>
  );
};
