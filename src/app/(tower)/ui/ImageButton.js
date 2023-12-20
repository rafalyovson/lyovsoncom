import Image from "next/image";

export const ImageButton = ({ handleImageClick, src }) => {
  return (
    <button
      onClick={handleImageClick}
      className="p-0 focus:outline-none aspect-video"
      title="User Image"
    >
      <div className="relative w-10 h-10">
        <Image
          loading="eager"
          src={src}
          alt="Placeholder"
          height={400}
          width={300}
          className=""
        />
      </div>
    </button>
  );
};
