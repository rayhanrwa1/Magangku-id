
import { useNavigate } from "react-router-dom";
export default function LoginForm() {
  const navigate = useNavigate();
  return (
    <div className="w-full md:w-1/2 m ax-w-lg bg-white rounded-xl shadow-lg px-5 md:px-10 py-7 md:py-10 flex flex-col justify-start">
      <form>
        {/* Email */}
        <div className="mb-4">
          <label className="block mb-1 text-gray-700 font-medium">Email</label>
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        {/* Password + lupa password */}
        <div className="mb-2">
          <label className="block mb-1 text-gray-700 font-medium">Password</label>
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300"
          />
          <div className="flex justify-end mt-1">
            <a href="#" className="text-sm text-[#446ed7] hover:underline">Lupa password ?</a>
          </div>
        </div>

        {/* Tombol Masuk */}
        <button
          type="submit"
          className="w-full mt-4 bg-gradient-to-r from-[#446ED7] to-[#1EC6FF] text-white rounded-lg py-2 font-semibold"
        >
          Masuk
        </button>
      </form>
      <div className="flex items-center my-6">
        <hr className="flex-grow border-gray-200"/>
          <span className="px-4 text-gray-400 text-sm">Atau</span>
          <hr className="flex-grow border-gray-200"/>
      </div>
        <div className="text-center text-sm mt-2">Baru di Magangku?
          <button
            type="button"
            className="text-[#446ed7] font-semibold hover:underline"
            onClick={() => navigate('../register')}>
            Daftar disini
          </button>
        </div>
    </div>
  );
}