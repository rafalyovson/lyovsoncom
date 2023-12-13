import FooterNav from "./FooterNav";

const Footer = () => (
  <footer className="p-8 flex justify-between  bg-light dark:bg-dark border-t-4 border-dark dark:border-light">
    <div className="flex items-center flex-col justify-center mb-2">
      <p className="text-2xl">© 2023 Lyovson</p>
      <div className="h-2 w-[100%] mx-auto rounded-lg bg-gradient-to-r from-jess to-rafa"></div>
    </div>

    <FooterNav />
  </footer>
);

export default Footer;
