"use server";

export const postCreate = async (
  content: JSON,
  prevState: any,
  formData: FormData
) => {
  console.log("content", content);
  console.log("prevState", prevState);
  console.log("formData", formData);
  return { message: "success", success: true };
};
