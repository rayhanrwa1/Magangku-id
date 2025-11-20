import React from "react";
import {
  Box,
  Paper,
  Avatar,
  Typography,
  Button,
  Stack,
  Divider,
} from "@mui/material";

function ProfilePage() {
  const handleEditProfile = () => {
    
  };

  return (
    <Box className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <Paper elevation={4} className="w-full max-w-xl p-6 sm:p-8">
        <Stack direction="row" spacing={3} alignItems="center">
          <Avatar
            sx={{ width: 72, height: 72 }}
            alt="Foto Admin"
            src=""
          />
          <div>
            <Typography variant="h6" className="font-semibold">
              Farras Sandy Harsoyo
            </Typography>
            <Typography variant="body2" className="text-slate-500">
              Admin Magangku Mitra
            </Typography>
            <Typography variant="body2" className="text-slate-500">
              farras@example.com
            </Typography>
          </div>
        </Stack>

        <Divider className="my-4" />

        <Stack spacing={1.2}>
          <Typography variant="subtitle2" className="text-slate-600">
            Informasi Profil
          </Typography>
          <Typography variant="body2">
            • Role: Super Admin
          </Typography>
          <Typography variant="body2">
            • Organisasi: Magangku Indonesia
          </Typography>
          <Typography variant="body2">
            • Bergabung sejak: Agustus 2025
          </Typography>
        </Stack>

        <Button
          variant="contained"
          className="mt-5"
          onClick={handleEditProfile}
        >
          Edit Profil
        </Button>
      </Paper>
    </Box>
  );
}

export default ProfilePage;
