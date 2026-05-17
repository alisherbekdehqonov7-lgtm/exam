import { Link } from "react-router-dom";
import Icon from "./ui/icon";

const exploreLinks = [
  { label: "Browse Books", to: "/books" },
  { label: "New Arrivals", to: "/new-arrivals" },
  { label: "Bestsellers", to: "/bestsellers" },
  { label: "Authors", to: "/authors" },
];

const accountLinks = [
  { label: "My Profile", to: "/profile" },
  { label: "Favorites", to: "/favorites" },
  { label: "Order History", to: "/orders" },
  { label: "Settings", to: "/settings" },
];

const supportLinks = [
  { label: "Help Center", to: "/help" },
  { label: "Contact Us", to: "/contact" },
  { label: "Privacy Policy", to: "/privacy" },
  { label: "Terms of Service", to: "/terms" },
];

const Footer = () => {
  return (
    <footer className="mt-16 bg-[#1F2F28] text-[#FBF7F0]">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 py-14">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-5">
              <Icon.leaf />
              <Icon.logoLight />
            </Link>
            <p className="text-[#9AA89F] text-sm leading-relaxed max-w-xs">
              Your digital sanctuary for discovering, collecting, and
              celebrating the world's greatest books.
            </p>
          </div>

          <div>
            <h4 className="text-[#FBF7F0] text-sm font-semibold mb-5">
              Explore
            </h4>
            <ul className="flex flex-col gap-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[#9AA89F] text-sm hover:text-[#FBF7F0] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[#FBF7F0] text-sm font-semibold mb-5">
              Account
            </h4>
            <ul className="flex flex-col gap-y-3">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[#9AA89F] text-sm hover:text-[#FBF7F0] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[#FBF7F0] text-sm font-semibold mb-5">
              Support
            </h4>
            <ul className="flex flex-col gap-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-[#9AA89F] text-sm hover:text-[#FBF7F0] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#2F423A] py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#9AA89F] text-sm">
            © 2026 BookHaven. All rights reserved.
          </p>
          <p className="text-[#9AA89F] text-sm flex items-center gap-1.5">
            Crafted with <Icon.leaf /> for book lovers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
