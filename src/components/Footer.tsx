"use client";
import Nav from "@/components/Nav";

const Footer = () => {
  return (
    <footer className="flex justify-around p-8 border-t-4 bg-background">
      <div className="flex flex-col items-center justify-center mb-2">
        <p className="text-2xl">© 2024 Lyovson</p>
      </div>
      <Nav />
    </footer>
  );
};

export default Footer;
