import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, IconButton, Menu, MenuItem, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
function Navbar({ mitraPhoto = '', mitraName = 'Nama Perusahaan', mitraEmail = 'hrd@perusahaan.com', onLogout, onProfile }) {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const navigate = useNavigate();

	const handleOpenMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	const handleClickProfile = () => {
		navigate('/profile');
	};

	// const handleClickLogout = () => {
	//   handleCloseMenu();
	//   if (onLogout) onLogout();
	// };

	return (
		<AppBar
			className="pt-4"
			position="static"
			elevation={0}
			color="inherit"
			sx={{ borderBottom: '1px solid rgb(226 232 240)' }}>
			<Toolbar className="px-4 lg:px-6 flex justify-end">
				<Box className="flex items-center gap-3">
					<div className="hidden sm:flex flex-col items-end">
						<Typography
							variant="body2"
							className="font-medium text-slate-800">
							{mitraName}
						</Typography>
						<Typography
							variant="caption"
							className="text-slate-500">
							{mitraEmail}
						</Typography>
					</div>

					<IconButton
						onClick={handleOpenMenu}
						size="small">
						<Avatar
							alt={mitraName}
							src={mitraPhoto || undefined}
						/>
					</IconButton>

					<Menu
						anchorEl={anchorEl}
						open={open}
						onClose={handleCloseMenu}
						anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
						transformOrigin={{ vertical: 'top', horizontal: 'right' }}>
						<MenuItem onClick={handleClickProfile}>Lihat Profile</MenuItem>
						{/* <MenuItem onClick={handleClickLogout}>Logout</MenuItem> */}
					</Menu>
				</Box>
			</Toolbar>
		</AppBar>
	);
}

export default Navbar;
