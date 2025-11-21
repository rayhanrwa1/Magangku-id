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
import { Category, Briefcase, Profile2User, Logout } from "iconsax-react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../../../src/database/firebase";
import logoMagangku from "/images/magangku-logo.png";

const NAVY = "#102C57";

const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: Category, path: "/home" },
  {
    key: "jobs",
    label: "Kelola Lowongan",
    icon: Briefcase,
    path: "#",
  },
  {
    key: "review",
    label: "Review Pelamar",
    icon: Profile2User,
    path: "#",
  },
];

function Sidebar({ isOpen = true, onClose, activeKey }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.replace(/\/+$/, "");

  // State dialog logout
  const [openLogout, setOpenLogout] = useState(false);

  const handleConfirmLogout = () => {
    setOpenLogout(true);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      sessionStorage.clear();
      localStorage.clear();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <>
      {/* Backdrop untuk mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 h-full w-64 bg-white border-r border-gray-200 pt-2
          flex flex-col z-50 transition-transform duration-300 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* HEADER */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-gray-100">
          <div className="flex flex-col">
            <img
              src={logoMagangku}
              className="h-7 w-auto"
              alt="Magangku Logo"
            />
            <span className="text-xs text-gray-500 mt-1">Panel Mitra</span>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 px-3 py-4">
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
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: "8px",
                    padding: "10px 12px",
                    backgroundColor: active ? "#EFF6FF" : "transparent",
                    color: active ? NAVY : "#475569",
                    border: active
                      ? "1px solid #DBEAFE"
                      : "1px solid transparent",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      backgroundColor: active ? "#EFF6FF" : "#F8FAFC",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Icon
                      size="18"
                      variant="Bulk"
                      color={active ? NAVY : "#64748b"}
                    />
                  </ListItemIcon>

                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      className: "text-sm font-medium",
                      sx: { color: "inherit" },
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
        </nav>

        {/* LOGOUT */}
        <div className="px-3 pb-4 border-t border-gray-100 pt-3">
          <ListItemButton
            onClick={handleConfirmLogout}
            sx={{
              borderRadius: "8px",
              padding: "10px 12px",
              color: "#475569",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "#FEF2F2",
                color: "#DC2626",
                "& .logout-icon": {
                  color: "#DC2626",
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 32 }}>
              <Logout
                size="18"
                color="#64748b"
                variant="Bulk"
                className="logout-icon"
              />
            </ListItemIcon>

            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                className: "text-sm font-medium",
                sx: { color: "inherit" },
              }}
            />
          </ListItemButton>
        </div>
      </aside>

      {/* ================================
          DIALOG KONFIRMASI LOGOUT
      ================================= */}
      <Dialog
        open={openLogout}
        onClose={() => setOpenLogout(false)}
        fullWidth
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: "12px",
            padding: "8px",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
            backdropFilter: "blur(4px)",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 600,
            fontSize: "18px",
            color: "#111827",
            paddingBottom: "8px",
          }}
        >
          Konfirmasi Logout
        </DialogTitle>

        <DialogContent sx={{ color: "#6B7280", paddingBottom: "16px" }}>
          Yakin ingin keluar dari akun Anda?
        </DialogContent>

        <DialogActions sx={{ padding: "16px", gap: "12px" }}>
          <Button
            onClick={() => setOpenLogout(false)}
            variant="outlined"
            sx={{
              borderColor: "#D1D5DB",
              color: "#374151",
              textTransform: "none",
              fontWeight: 500,
              borderRadius: "8px",
              padding: "8px 20px",
              "&:hover": {
                borderColor: "#9CA3AF",
                backgroundColor: "#F9FAFB",
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
              padding: "8px 20px",
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
