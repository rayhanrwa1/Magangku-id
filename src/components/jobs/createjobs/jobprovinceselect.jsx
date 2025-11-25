import { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../../../database/firebase";
import { ArrowDown2 } from "iconsax-react";

export default function JobProvinceSelect({ value, onChange, error }) {
  const [provinces, setProvinces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const provRef = ref(db, "provinces"); // struktur yang ada di screenshot
        const snapshot = await get(provRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const items = Array.isArray(data) ? data : Object.values(data || {});

          const list = items
            .map((item) => item?.province)
            .filter(Boolean)
            .sort((a, b) => a.localeCompare(b));

          setProvinces(list);
        }
      } catch (err) {
        console.error("Error fetching provinces:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProvinces();
  }, []);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        Lokasi (Provinsi) <span className="text-red-600">*</span>
      </label>

      <div className="relative">
        <select
          name="location"            // langsung isi formData.location
          value={value}
          onChange={onChange}
          disabled={loading}
          className={`appearance-none w-full px-4 py-2 pr-10 border rounded-lg bg-white focus:outline-none ${
            error ? "border-red-300" : "border-gray-300"
          } ${
            loading
              ? "text-gray-400 cursor-wait"
              : "text-gray-700 focus:ring-2 focus:ring-slate-800 focus:border-slate-800"
          } text-sm`}
        >
          <option value="">
            {loading ? "Memuat provinsi..." : "Pilih provinsi penempatan"}
          </option>

          {!loading &&
            provinces.map((prov, idx) => (
              <option key={idx} value={prov}>
                {prov}
              </option>
            ))}
        </select>

        <ArrowDown2
          size={18} color="grey"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>

      {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
    </div>
  );
}
