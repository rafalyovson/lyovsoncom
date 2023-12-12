import FooterNav from "./FooterNav";

const Footer = () => (
  <footer className="py-6 px-8 bg-light dark:bg-dark dark:text-light text-dark">
    <div className="flex items-center justify-center">
      <p className="text-2xl">© 2023 Lyovson</p>
    </div>
    <FooterNav />
  </footer>
);

export default Footer;
