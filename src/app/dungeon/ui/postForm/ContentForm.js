export const ContentForm = ({ value }) => {
  return (
    <>
      <label className="flex flex-col space-y-2">
        <span className="text-lg font-medium">Content:</span>
        <textarea
          name="content"
          required
          className="h-32 p-2 border border-dark dark:border-light bg-light dark:bg-dark focus:outline-none focus:ring-2 focus:ring-beige"
          defaultValue={value}
        />
      </label>
    </>
  );
};

export default ContentForm;
