import { Card, CardContent } from "@/components/ui/card";
import { Image as ImageType } from "@/data/schema";
import Image from "next/image";

export const ImageCard = ({ image }: { image: ImageType }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <Image
          className="mx-auto"
          src={image.url}
          alt={"image"}
          width={200}
          height={200}
        />
      </CardContent>
    </Card>
  );
};
