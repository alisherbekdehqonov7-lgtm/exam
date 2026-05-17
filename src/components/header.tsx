import { useEffect, useRef, useState } from "react";
import Icon from "./ui/icon";
import { Link } from "react-router-dom";
import { useUserStore } from "../store/user.store";
import { removeItem } from "../utils/localstorage";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const userStore = useUserStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const confirmLogout = () => {
    setShowLogoutConfirm(false);
    userStore.logOut();
    removeItem("token");
    window.location.reload();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <header className="pt-3.5">
        <div className="container">
          <div className="flex items-center gap-x-6">
            <Link to="/" className="flex items-center gap-2">
              <Icon.leaf />
              <Icon.logo />
            </Link>
            <form className="max-w-95 w-full">
              <label className="bg-[#FBF7F0] p-[12px_20px] rounded-[40px] flex items-center gap-3 w-full shadow-md">
                <Icon.searchIcon />
                <input
                  type="text"
                  className="w-full text-base text-[#1F2F28] placeholder:text-[#7A7A7A] bg-transparent focus:outline-0"
                  placeholder="Search books, authors, genres..."
                />
              </label>
            </form>
            <nav>
              <ul className="flex gap-x-6 text-sm font-medium">
                <li>
                  <Link
                    to={"/books"}
                    className="text-[#1F2F28] hover:text-[#2A3D33] transition-colors"
                  >
                    Books
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/authors"}
                    className="text-[#1F2F28] hover:text-[#2A3D33] transition-colors"
                  >
                    Authors
                  </Link>
                </li>
                <li>
                  <Link
                    to={"/favorites"}
                    className="text-[#1F2F28] hover:text-[#2A3D33] transition-colors"
                  >
                    Favorites
                  </Link>
                </li>
              </ul>
            </nav>
            {userStore.user ? (
              <div className="flex items-center gap-x-5 ml-auto">
                <button type="button" className="relative cursor-pointer">
                  <Icon.cart />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FF3B30]"></span>
                </button>
                <button type="button" className="relative cursor-pointer">
                  <Icon.bell />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#FF3B30]"></span>
                </button>
                <div className="relative" ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="flex items-center gap-x-2 bg-[#FBF7F0] rounded-full p-[6px_16px_6px_6px] cursor-pointer"
                  >
                    <span className="w-9 h-9 rounded-full bg-[#D9E5DC] flex items-center justify-center text-[#1F2F28] font-semibold text-base">
                      {userStore.user?.fullName[0]}
                    </span>
                    <span className="text-base text-[#1F2F28]">
                      {userStore.user?.fullName}
                    </span>
                    <span
                      className={`transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <Icon.chevronDown />
                    </span>
                  </button>
                  {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-lg border border-[#EFE7DA] p-2 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-[#1F2F28] hover:bg-[#FBF7F0] rounded-xl"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/my-library"
                        className="block px-4 py-2 text-sm text-[#1F2F28] hover:bg-[#FBF7F0] rounded-xl"
                      >
                        My Library
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 text-sm text-[#1F2F28] hover:bg-[#FBF7F0] rounded-xl"
                      >
                        Settings
                      </Link>
                      <hr className="my-1 border-[#EFE7DA]" />
                      <button
                        type="button"
                        className="w-full text-left px-4 py-2 text-sm text-[#FF3B30] hover:bg-[#FBF7F0] rounded-xl cursor-pointer"
                        onClick={() => {
                          setShowLogoutConfirm(true);
                          setIsOpen(false);
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="ml-auto flex items-center gap-x-3">
                <Link
                  to={"/sign-in"}
                  className="text-sm text-[#1F2F28] border border-[#1F2F28] rounded-full px-5 py-2 hover:bg-[#1F2F28] hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to={"/sign-up"}
                  className="text-sm text-white bg-[#1F2F28] rounded-full px-5 py-2 hover:bg-[#2A3D33] transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="max-w-md w-full bg-white rounded-[28px] shadow-2xl border border-[#E8E2DA] p-8 text-center">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#F4EEE5] text-3xl">
              👋
            </div>
            <h3 className="text-2xl font-semibold text-[#1F2F28]">
              Leaving so soon?
            </h3>
            <p className="mt-3 text-sm text-[#6B6B6B]">
              Are you sure you want to log out of your BookHaven account?
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                type="button"
                className="inline-flex justify-center rounded-full border border-[#D8C9B8] bg-[#F8F2E8] px-6 py-3 text-sm font-medium text-[#1F2F28] hover:bg-[#EFE5D8] transition-colors"
                onClick={cancelLogout}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-full bg-[#C0392B] px-6 py-3 text-sm font-medium text-white hover:bg-[#A22D24] transition-colors"
                onClick={confirmLogout}
              >
                Yes, Log Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
