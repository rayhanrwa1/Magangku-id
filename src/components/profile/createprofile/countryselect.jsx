import { useState, useEffect, useRef } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../../../database/firebase'; // Sesuaikan path import
import { Global, SearchNormal1, ArrowDown2 } from 'iconsax-react';

/**
 * CountrySelect Component
 * Dropdown negara dengan search functionality
 * Data di-fetch dari Firebase Realtime Database menggunakan Firebase SDK
 */
export default function CountrySelect({ value, onChange, error, disabled = false }) {
	const [countries, setCountries] = useState([]);
	const [loading, setLoading] = useState(true);
	const [isOpen, setIsOpen] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	const dropdownRef = useRef(null);
	const searchInputRef = useRef(null);

	// Fetch countries dari Firebase menggunakan SDK
	useEffect(() => {
		fetchCountries();
	}, []);

	// Close dropdown ketika klik di luar
	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setIsOpen(false);
				setSearchTerm('');
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	// Focus search input ketika dropdown dibuka
	useEffect(() => {
		if (isOpen && searchInputRef.current) {
			searchInputRef.current.focus();
		}
	}, [isOpen]);

	const fetchCountries = async () => {
		try {
			const countryRef = ref(db, 'country');
			const snapshot = await get(countryRef);

			if (snapshot.exists()) {
				const data = snapshot.val();

				// Convert object to array dan sort berdasarkan nama
				const countryArray = Object.entries(data)
					.map(([key, val]) => ({
						id: key,
						code: key,
						name: val.name || '',
						img: val.img || '',
					}))
					.sort((a, b) => a.name.localeCompare(b.name));

				setCountries(countryArray);
			}
			setLoading(false);
		} catch (error) {
			console.error('Error fetching countries:', error);
			setLoading(false);
		}
	};

	// Filter countries berdasarkan search term
	const filteredCountries = countries.filter((country) => country.name?.toLowerCase().includes(searchTerm.toLowerCase()));

	// Get selected country object
	const selectedCountry = countries.find((c) => c.name === value);

	const handleSelect = (countryName) => {
		onChange({ target: { name: 'country', value: countryName } });
		setIsOpen(false);
		setSearchTerm('');
	};

	return (
		<div
			className="relative"
			ref={dropdownRef}>
			<label className="block text-sm font-medium text-slate-700 mb-2">Negara *</label>

			{/* Selected Value Display */}
			<button
				type="button"
				disabled={disabled}
				onClick={disabled ? undefined : () => setIsOpen(!isOpen)}
				className={`w-full px-4 py-2.5 border rounded-lg flex items-center justify-between transition-colors ${error ? 'border-red-300' : 'border-slate-300'} ${
					disabled ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-white focus:outline-none focus:ring-2 focus:ring-slate-500'
				} ${isOpen && !disabled ? 'ring-2 ring-slate-500' : ''}`}>
				<div className="flex items-center gap-3">
					{loading ? (
						<span className="text-slate-400">Memuat negara...</span>
					) : selectedCountry ? (
						<>
							{selectedCountry.img ? (
								<img
									src={selectedCountry.img}
									alt={selectedCountry.name}
									className="w-6 h-6 object-cover rounded"
									onError={(e) => {
										e.target.style.display = 'none';
									}}
								/>
							) : (
								<div className="w-6 h-6 bg-slate-200 rounded flex items-center justify-center">
									<Global
										size="14"
										className="text-slate-400"
									/>
								</div>
							)}
							<span className="text-slate-700">{value || "Indonesia"}</span>
						</>
					) : (
						<span className="text-slate-400">Pilih negara</span>
					)}
				</div>

				<ArrowDown2
					size="18"
					className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
				/>
			</button>

			{error && <p className="text-red-600 text-sm mt-1">{error}</p>}

			{/* Dropdown Menu */}
			{isOpen && !disabled && (
				<div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden">
					{/* Search Input */}
					<div className="p-3 border-b border-slate-200 bg-slate-50">
						<div className="relative">
							<SearchNormal1
								size="18"
								className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
							/>
							<input
								ref={searchInputRef}
								type="text"
								placeholder="Cari negara..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm"
							/>
						</div>

						{searchTerm && <p className="text-xs text-slate-500 mt-2">{filteredCountries.length} hasil ditemukan</p>}
					</div>

					{/* Country List */}
					<div className="max-h-64 overflow-y-auto">
						{loading ? (
							<div className="p-4 text-center">
								<div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-slate-300 border-t-slate-600"></div>
								<p className="text-sm text-slate-500 mt-2">Memuat data...</p>
							</div>
						) : filteredCountries.length > 0 ? (
							filteredCountries.map((country) => (
								<button
									key={country.id}
									type="button"
									onClick={() => handleSelect(country.name)}
									className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left ${value === country.name ? 'bg-slate-100' : ''}`}>
									{country.img ? (
										<img
											src={country.img}
											alt={country.name}
											className="w-8 h-8 object-cover rounded shadow-sm"
											onError={(e) => {
												e.target.style.display = 'none';
											}}
										/>
									) : (
										<div className="w-8 h-8 bg-slate-200 rounded shadow-sm flex items-center justify-center">
											<Global
												size="16"
												className="text-slate-400"
											/>
										</div>
									)}

									<span className="text-sm text-slate-700 font-medium">{country.name}</span>

									{value === country.name && (
										<svg
											className="ml-auto w-5 h-5 text-slate-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M5 13l4 4L19 7"
											/>
										</svg>
									)}
								</button>
							))
						) : (
							<div className="p-4 text-center">
								<Global
									size="32"
									className="mx-auto text-slate-300 mb-2"
								/>
								<p className="text-sm text-slate-500">{searchTerm ? 'Negara tidak ditemukan' : 'Tidak ada data'}</p>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
}
