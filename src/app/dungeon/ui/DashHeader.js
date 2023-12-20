import Image from "next/image";

const DashHeader = ({ user }) => {
  return (
    <header className="flex flex-row-reverse items-center justify-center gap-4 p-4 rounded-lg shadow-lg bg-gray-50 dark:bg-dark">
      <h1 className="mb-4 text-3xl font-bold text-gray-700 dark:text-light">
        Welcome, {user.name}
      </h1>
      <Image
        className="rounded-full max-h-[150px] max-w-[150px]"
        alt={user.name + " photo"}
        src={user.image ?? ""}
        width={400}
        height={400}
      />
    </header>
  );
};

export default DashHeader;
