import { FooterMenu } from "./footer-menu";

export const Footer = () => {
  return (
    <footer className="flex flex-wrap justify-around p-8 border-t-4 bg-background gap-8">
      <FooterMenu />
      <section className="flex flex-col items-center justify-center mb-2">
        <p className="text-2xl">© 2024 Lyovson</p>
      </section>
    </footer>
  );
};
