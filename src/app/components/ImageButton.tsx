import Image from "next/image";

export const ImageButton = ({
  handleImageClick,
  src,
}: {
  handleImageClick: any;
  src: string;
}) => {
  return (
    <button
      onClick={handleImageClick}
      className="focus:outline-none p-0"
      title="Left Image"
    >
      <div className="relative h-10 w-10">
        <Image
          src={src}
          alt="Placeholder"
          width={200}
          height={200}
          className=""
        />
      </div>
    </button>
  );
};
