import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";

export default function App() {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Tailwind + MUI Installed!
      </h1>

      <Button variant="contained" startIcon={<HomeIcon />}>
        MUI Button
      </Button>
    </div>
  );
}
