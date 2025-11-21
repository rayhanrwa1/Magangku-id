import React from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Category, Briefcase, Profile2User, Logout } from "iconsax-react";
import logoMagangku from "/images/magangku-logo.png";

const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: Category },
  { key: "jobs", label: "Kelola Lowongan", icon: Briefcase },
  { key: "review", label: "Review Pelamar", icon: Profile2User },
];

function Sidebar({ activeKey, onChangeMenu, onLogout }) {
  return (
    <aside className="h-screen w-64 bg-white border-r border-[#e2e8f0] flex flex-col pt-2">
      {/* HEADER: logo penuh + teks kecil Panel Mitra */}
      <div className="h-16 px-6 flex items-center border-b border-[#e2e8f0]">
        <div className="flex flex-col">
          <img
            src={logoMagangku}
            alt="Magangku"
            className="h-7 md:h-8 w-auto"
          />
          <span className="text-xs text-slate-500 mt-1">Panel Mitra</span>
        </div>
      </div>

      {/* MENU UTAMA */}
      <nav className="flex-1 px-2 py-4">
        <List disablePadding>
          {menuItems.map((item) => {
            const IconComp = item.icon;
            const active = activeKey === item.key;

            return (
              <ListItemButton
                key={item.key}
                onClick={() => onChangeMenu && onChangeMenu(item.key)}
                className={
                  "mb-1 rounded-lg " +
                  (active
                    ? "bg-blue-50 text-[#2563EB] border border-[#2563EB1F]"
                    : "text-slate-600 hover:bg-slate-50")
                }
              >
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <IconComp size="18" variant="Bulk" color="currentColor" />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ className: "text-sm" }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </nav>

      {/* LOGOUT */}
      <div className="px-2 pb-4">
        <ListItemButton
          onClick={onLogout}
          className="rounded-lg text-slate-600 hover:bg-slate-50"
        >
          <ListItemIcon sx={{ minWidth: 32 }}>
            <Logout size="18" variant="Bulk" color="currentColor" />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            primaryTypographyProps={{ className: "text-sm" }}
          />
        </ListItemButton>
      </div>
    </aside>
  );
}

export default Sidebar;
