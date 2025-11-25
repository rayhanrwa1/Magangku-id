import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../../../database/firebase';
import { ArrowDown2 } from 'iconsax-react';

export default function CitySelect({ province, value, onChange, error }) {
	const [cities, setCities] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// kalau provinsi belum dipilih, kosongkan kota
		if (!province) {
			setCities([]);
			return;
		}

		const fetchCities = async () => {
			setLoading(true);
			try {
				const provRef = ref(db, 'provinces');
				const snapshot = await get(provRef);

				if (snapshot.exists()) {
					const data = snapshot.val();
					const items = Array.isArray(data) ? data : Object.values(data || {});

					// cari item provinsi yang dipilih
					const selected = items.find((item) => item?.province === province);

					if (selected) {
						const list = [...(selected.cities || []), ...(selected.regencies || [])].filter(Boolean);

						setCities(list);
					} else {
						setCities([]);
					}
				} else {
					setCities([]);
				}
			} catch (err) {
				console.error('Error fetching cities:', err);
				setCities([]);
			} finally {
				setLoading(false);
			}
		};

		fetchCities();
	}, [province]);

	const disabled = loading || !province;

	return (
		<div>
			<label className="block text-sm font-medium text-slate-700 mb-2">Kota / Kabupaten *</label>

			<div className="relative">
				<select
					name="city"
					value={value}
					onChange={onChange}
					disabled={disabled}
					className={`appearance-none w-full px-4 py-2.5 pr-10 border rounded-lg bg-white focus:outline-none ${error ? 'border-red-300' : 'border-slate-300'} ${
						disabled ? 'text-slate-400 cursor-not-allowed' : 'text-slate-700 focus:ring-2 focus:ring-slate-500'
					}`}>
					<option value="">{province ? (loading ? 'Memuat kota / kabupaten...' : 'Pilih kota / kabupaten') : 'Pilih provinsi dulu'}</option>

					{!loading &&
						cities.map((city, idx) => (
							<option
								key={idx}
								value={city}>
								{city}
							</option>
						))}
				</select>

				<ArrowDown2
					size="18" color="grey"
					className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 ${disabled ? 'text-slate-300' : 'text-slate-400'}`}
				/>
			</div>

			{error && <p className="text-red-600 text-sm mt-1">{error}</p>}
		</div>
	);
}
