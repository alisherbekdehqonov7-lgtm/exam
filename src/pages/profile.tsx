import { useState, type JSX } from "react";
import ChangePassword from "../components/profile-tab/ChangePassword";
import EditProfile from "../components/profile-tab/EditProfile";
import Favorites from "../components/profile-tab/Favorites";

import MyBooks from "../components/profile-tab/MyBooks";
import Overview from "../components/profile-tab/Overview";

type SectionId =
  | "overview"
  | "edit-profile"
  | "change-password"
  | "my-books"
  | "favorites";

interface NavItem {
  id: SectionId;
  icon: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: "overview", icon: "📊", label: "Overview" },
  { id: "edit-profile", icon: "✏️", label: "Edit Profile" },
  { id: "change-password", icon: "🔒", label: "Change Password" },
  { id: "my-books", icon: "📚", label: "My Books" },
  { id: "favorites", icon: "❤️", label: "Favorites" },
];

function SidebarUserCard({
  username,
  memberSince,
}: {
  username: string;
  memberSince: string;
}) {
  return (
    <div className="flex flex-col items-center py-6 px-4 border-b border-gray-100">
      <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-3xl mb-3 shadow-sm">
        {username.charAt(0).toUpperCase()}
      </div>
      <p className="font-semibold text-gray-800 text-base">{username}</p>
      <p className="text-xs text-gray-400 mt-0.5">Member since {memberSince}</p>
    </div>
  );
}

function SidebarNavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
        active
          ? "bg-green-100 text-green-800"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
    >
      <span className="text-base leading-none">{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function Sidebar({
  activeSection,
  onSectionChange,
  username,
  memberSince,
}: {
  activeSection: SectionId;
  onSectionChange: (id: SectionId) => void;
  username: string;
  memberSince: string;
}) {
  return (
    <aside className="w-56 shrink-0 bg-white border-r border-gray-100 min-h-screen hidden md:flex flex-col">
      <SidebarUserCard username={username} memberSince={memberSince} />
      <nav className="flex flex-col gap-1 p-3 pt-4">
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
          />
        ))}
      </nav>
    </aside>
  );
}

function MainContent({ activeSection }: { activeSection: SectionId }) {
  const SECTION_MAP: Record<SectionId, JSX.Element> = {
    overview: <Overview />,
    "edit-profile": <EditProfile />,
    "change-password": <ChangePassword />,
    "my-books": <MyBooks />,
    favorites: <Favorites />,
  };

  return (
    <main className="flex-1 p-8 bg-stone-50 min-h-screen overflow-y-auto">
      {SECTION_MAP[activeSection]}
    </main>
  );
}

const Profile = () => {
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const username = "Zayniddin";

  return (
    <div className="min-h-screen bg-stone-50 font-sans">
      <div className="flex">
        <Sidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          username={username}
          memberSince="2024"
        />
        <MainContent activeSection={activeSection} />
      </div>
    </div>
  );
};

export default Profile;
