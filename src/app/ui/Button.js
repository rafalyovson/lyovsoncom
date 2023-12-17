"use client";
const Button = ({ children, className, ...props }) => {
  return (
    <button
      className={`px-4 py-2 font-bold rounded text-light bg-dark dark:text-dark dark:bg-light ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
