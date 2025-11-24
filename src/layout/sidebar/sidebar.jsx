import React, { useState } from "react";
import {
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  Category,
  Briefcase,
  Profile2User,
  Logout,
  HambergerMenu,
  Message,
} from "iconsax-react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../../src/database/firebase";
import logoMagangku from "/images/magangku-logo.png";

const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: Category, path: "/home" },
  { key: "jobs", label: "Kelola Lowongan", icon: Briefcase, path: "/jobs" },
  { key: "review", label: "Review Pelamar", icon: Profile2User, path: "#" },
  { key: "chat", label: "Chat", icon: Message, path: "/chat" },
];

function Sidebar({ activeKey }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/+$/, "");
  const [openLogout, setOpenLogout] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const preloadJobs = async () => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await get(ref(db, `mitra/${user.uid}`));
      await get(ref(db, "jobs"));
      await get(ref(db, "applications"));
    } catch (err) {
      console.error("Preload error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();

      localStorage.clear();
      sessionStorage.clear();

      navigate("/", { replace: true });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        <HambergerMenu size={24} color="#1E293B" />
      </button>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 min-h-screen w-64 bg-white border-r border-slate-200
          flex flex-col z-50 transition-transform duration-300 ease-out pt-4
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }
        `}
      >
        {/* Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100 flex-shrink-0">
          <div>
            <img
              src={logoMagangku}
              className="h-7 w-auto"
              alt="Magangku Logo"
            />
            <span className="text-xs text-slate-500 mt-0.5 block">
              Panel Mitra
            </span>
          </div>

          {/* Close button - Mobile only */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <List
            disablePadding
            sx={{ display: "flex", flexDirection: "column", gap: "4px" }}
          >
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = currentPath === item.path;

              return (
                <ListItemButton
                  key={item.key}
                  onClick={async () => {
                    if (item.path === "/jobs") {
                      await preloadJobs();
                    }

                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  sx={{
                    borderRadius: "8px",
                    padding: "10px 12px",
                    backgroundColor: active ? "#F1F5F9" : "transparent",
                    color: active ? "#0F172A" : "#64748B",
                    transition: "all 0.15s ease",
                    "&:hover": {
                      backgroundColor: active ? "#E2E8F0" : "#F8FAFC",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Icon
                      size={20}
                      variant={active ? "Bold" : "Linear"}
                      color={active ? "#0F172A" : "#64748B"}
                    />
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "14px",
                      fontWeight: active ? 600 : 500,
                      color: "inherit",
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </nav>

        {/* Logout */}
        <div className="px-3 pb-4 pt-3 border-t border-slate-100 flex-shrink-0">
          <ListItemButton
            onClick={() => setOpenLogout(true)}
            sx={{
              borderRadius: "8px",
              padding: "10px 12px",
              color: "#64748B",
              transition: "all 0.15s ease",
              "&:hover": {
                backgroundColor: "#FEF2F2",
                color: "#DC2626",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Logout size={20} color="currentColor" />
            </ListItemIcon>

            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontSize: "14px",
                fontWeight: 500,
                color: "inherit",
              }}
            />
          </ListItemButton>
        </div>
      </aside>

      {/* Logout Dialog */}
      <Dialog
        open={openLogout}
        onClose={() => setOpenLogout(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: { borderRadius: "12px", padding: "4px" },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: 600, fontSize: "18px", paddingBottom: "8px" }}
        >
          Konfirmasi Logout
        </DialogTitle>

        <DialogContent sx={{ color: "#64748B", paddingBottom: "12px" }}>
          Yakin ingin keluar dari akun Anda?
        </DialogContent>

        <DialogActions sx={{ padding: "12px 20px", gap: "8px" }}>
          <Button
            onClick={() => setOpenLogout(false)}
            variant="outlined"
            sx={{
              borderColor: "#CBD5E1",
              color: "#475569",
              textTransform: "none",
              fontWeight: 500,
              borderRadius: "8px",
              "&:hover": {
                borderColor: "#94A3B8",
                backgroundColor: "#F8FAFC",
              },
            }}
          >
            Batal
          </Button>

          <Button
            onClick={handleLogout}
            variant="contained"
            sx={{
              backgroundColor: "#DC2626",
              textTransform: "none",
              fontWeight: 500,
              borderRadius: "8px",
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#B91C1C",
                boxShadow: "none",
              },
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Sidebar;
