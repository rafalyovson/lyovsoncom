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
      className="focus:outline-none p-0 aspect-video"
      title="User Image"
    >
      <div className="relative h-10 w-10">
        <Image
          loading="eager"
          src={src}
          alt="Placeholder"
          height={400}
          width={300}
          className=" "
        />
      </div>
    </button>
  );
};
