import { useEffect, useState } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../../../database/firebase';
import { ArrowDown2 } from 'iconsax-react';

export default function ProvinceSelect({ value, onChange, error }) {
	const [provinces, setProvinces] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchProvinces = async () => {
			try {
				// ambil dari root "provinces"
				const provRef = ref(db, 'provinces');
				const snapshot = await get(provRef);

				if (snapshot.exists()) {
					const data = snapshot.val();

					// data bisa array atau object
					const items = Array.isArray(data) ? data : Object.values(data || {});

					// ambil hanya nama provinsi
					const list = items
						.map((item) => item?.province)
						.filter(Boolean)
						.sort((a, b) => a.localeCompare(b));

					setProvinces(list);
				}
			} catch (err) {
				console.error('Error fetching provinces:', err);
			} finally {
				setLoading(false);
			}
		};

		fetchProvinces();
	}, []);

	return (
		<div>
			<label className="block text-sm font-medium text-slate-700 mb-2">Provinsi *</label>

			<div className="relative">
				<select
					name="state"
					value={value}
					onChange={onChange}
					disabled={loading}
					className={`appearance-none w-full px-4 py-2.5 pr-10 border rounded-lg bg-white focus:outline-none ${error ? 'border-red-300' : 'border-slate-300'} ${
						loading ? 'text-slate-400 cursor-wait' : 'text-slate-700 focus:ring-2 focus:ring-slate-500'
					}`}>
					<option value="">{loading ? 'Memuat provinsi...' : 'Pilih provinsi'}</option>
					{!loading &&
						provinces.map((prov, idx) => (
							<option
								key={idx}
								value={prov}>
								{prov}
							</option>
						))}
				</select>

				<ArrowDown2
					size="18" color="grey"
					className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
				/>
			</div>

			{error && <p className="text-red-600 text-sm mt-1">{error}</p>}
		</div>
	);
}
