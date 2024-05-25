import Image from "next/image";

export const ImageButton = ({
  handleImageClick,
  src,
}: {
  handleImageClick: () => void;
  src: string;
}) => {
  return (
    <div className="relative w-10 h-10 curson-pointer">
      <Image
        onClick={handleImageClick}
        loading="eager"
        src={src}
        alt="Placeholder"
        height={400}
        width={300}
        className=" rounded-lg shadow-lg"
      />
    </div>
  );
};
