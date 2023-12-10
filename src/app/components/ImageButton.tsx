import Image from "next/image";

export const ImageButton = ({
  handleImageClick,
}: {
  handleImageClick: any;
}) => {
  return (
    <button
      onClick={handleImageClick}
      className="focus:outline-none p-0"
      title="Left Image"
    >
      <div className="relative h-10 w-10">
        <Image
          src="https://via.placeholder.com/150"
          alt="Placeholder"
          width={150}
          height={150}
          className="rounded-full"
        />
      </div>
    </button>
  );
};
