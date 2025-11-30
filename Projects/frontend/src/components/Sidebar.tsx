import React from 'react';
import './Sidebar.css';

// REUSABLE COMPONENT: SidebarMenu
// Used in: Landing Page (Left Sidebar)

interface SidebarProps {
  menuItems: string[];
  activeMenu: string;
  onMenuClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  menuItems,
  activeMenu,
  onMenuClick,
}) => {
  return (
    <aside className="sidebar">
      {/* TITLE: "A REAL ESTATE MARKETPLACE" */}
      <div className="sidebar-header">
        <h2 className="sidebar-title">A REAL ESTATE MARKETPLACE</h2>
      </div>

      {/* VERTICAL MENU LIST: Home, Rentals, Buy, Projects, Saved */}
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li
              key={item}
              className={activeMenu === item ? 'active' : ''}
              onClick={() => onMenuClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
