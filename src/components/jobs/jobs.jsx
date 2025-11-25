import { useEffect, useState } from 'react';
import { ref, get, remove, set, query, orderByChild, equalTo } from 'firebase/database';
import { db, auth } from '../../database/firebase';
import { onAuthStateChanged } from 'firebase/auth';

import Navbar from '../../layout/navbar/navbar';
import Sidebar from '../../layout/sidebar/sidebar';

import { Briefcase, Location, Global, Calendar, Eye, Edit, Trash, SearchNormal, Add, CloseCircle, TickCircle, DocumentText } from 'iconsax-react';

export default function Jobs() {
	const [userData, setUserData] = useState(null);
	const [mitraData, setMitraData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [jobs, setJobs] = useState([]);
	const [filteredJobs, setFilteredJobs] = useState([]);

	const [searchQuery, setSearchQuery] = useState('');
	const [statusFilter, setStatusFilter] = useState('all');
	const [workTypeFilter, setWorkTypeFilter] = useState('all');
	const [sortBy, setSortBy] = useState('newest');

	const [stats, setStats] = useState({
		totalJobs: 0,
		activeJobs: 0,
		closedJobs: 0,
		totalApplicants: 0,
	});

	useEffect(() => {
		const unsub = onAuthStateChanged(auth, async (user) => {
			if (!user) return (window.location.href = '/');

			const snap = await get(ref(db, `mitra/${user.uid}`));
			if (snap.exists()) setMitraData(snap.val());

			const userSnap = await get(ref(db, `users/${user.uid}`));
			if (userSnap.exists()) setUserData(userSnap.val());

			await loadJobs(user.uid);
			setLoading(false);
		});

		return () => unsub();
	}, []);

	const loadJobs = async (userId) => {
		try {
			const jobsSnap = await get(ref(db, 'jobs'));
			if (!jobsSnap.exists()) {
				setJobs([]);
				setFilteredJobs([]);
				return;
			}

			const allJobs = jobsSnap.val();

			// FILTER HANYA MILIK MITRA YANG LOGIN
			const mitraJobs = Object.values(allJobs)
				.filter((job) => job.mitra_id === userId)
				.sort((a, b) => b.created_at - a.created_at);

			setJobs(mitraJobs);
			setFilteredJobs(mitraJobs);

			// Hitung stats dari jobs saja
			const activeJobs = mitraJobs.filter((job) => job.status === 'open').length;

			const closedJobs = mitraJobs.filter((job) => job.status === 'closed').length;

			setStats({
				totalJobs: mitraJobs.length,
				activeJobs,
				closedJobs,
				totalApplicants: 0,
			});
		} catch (error) {
			console.error('Error loading jobs:', error);
		}
	};

	useEffect(() => {
		let result = [...jobs];

		if (searchQuery) {
			result = result.filter((job) => job.title.toLowerCase().includes(searchQuery.toLowerCase()) || job.category.toLowerCase().includes(searchQuery.toLowerCase()) || job.location.toLowerCase().includes(searchQuery.toLowerCase()));
		}

		if (statusFilter !== 'all') {
			result = result.filter((job) => job.status === statusFilter);
		}

		if (workTypeFilter !== 'all') {
			result = result.filter((job) => job.work_type === workTypeFilter);
		}

		if (sortBy === 'newest') {
			result.sort((a, b) => b.created_at - a.created_at);
		} else if (sortBy === 'oldest') {
			result.sort((a, b) => a.created_at - b.created_at);
		} else if (sortBy === 'title') {
			result.sort((a, b) => a.title.localeCompare(b.title));
		} else if (sortBy === 'applicants') {
			result.sort((a, b) => b.applicantCount - a.applicantCount);
		}

		setFilteredJobs(result);
	}, [searchQuery, statusFilter, workTypeFilter, sortBy, jobs]);

	const handleDelete = async (jobId) => {
		if (!confirm('Yakin ingin menghapus lowongan ini?')) return;

		try {
			await remove(ref(db, `jobs/${jobId}`));
			alert('Lowongan berhasil dihapus');
			window.location.reload();
		} catch (error) {
			console.error('Error deleting job:', error);
			alert('Gagal menghapus lowongan');
		}
	};

	const handleToggleStatus = async (jobId, currentStatus) => {
		const newStatus = currentStatus === 'open' ? 'closed' : 'open';

		try {
			await set(ref(db, `jobs/${jobId}/status`), newStatus);
			window.location.reload();
		} catch (error) {
			console.error('Error updating job status:', error);
			alert('Gagal mengubah status lowongan');
		}
	};

	const formatDate = (timestamp) => {
		return new Date(timestamp).toLocaleDateString('id-ID', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		});
	};

	return (
		<div className="min-h-screen flex bg-gray-50">
			<Sidebar activeKey="jobs" />

			<div className="flex-1 flex flex-col">
				<Navbar
					mitraPhoto={mitraData?.photo}
					mitraName={mitraData?.name}
					mitraEmail={userData?.email}
				/>

				<main className="p-4 md:p-6 lg:p-8 space-y-6">
					{loading ? (
						<div className="flex justify-center items-center py-24">
							<div className="text-center">
								<div className="w-12 h-12 border-3 border-gray-300 border-t-gray-700 rounded-full animate-spin mx-auto"></div>
								<p className="mt-3 text-gray-600">Memuat data lowongan...</p>
							</div>
						</div>
					) : mitraData && mitraData.verified === false ? (
						<div className="bg-white border border-red-200 rounded-lg p-8 text-center">
							<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
								<CloseCircle
									size={32}
									color="red"
								/>
							</div>
							<h2 className="text-xl font-bold text-red-700 mb-2">Akun Anda Belum Terverifikasi</h2>
							<p className="text-gray-600">Anda belum dapat mengakses manajemen lowongan sebelum akun diverifikasi admin.</p>
						</div>
					) : (
						<>
							{/* HEADER */}
							<div className="flex items-center justify-between">
								<div>
									<h1 className="text-2xl font-bold text-gray-900">Manajemen Lowongan</h1>
									<p className="text-sm text-gray-600">Kelola lowongan pekerjaan Anda</p>
								</div>

								<button
									onClick={() => (window.location.href = '/createjob')}
									className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900">
									<Add
										size={20}
										color="white"
									/>
									Buat Lowongan
								</button>
							</div>

							{/* STATS */}
							<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
								<StatCard
									icon={<Briefcase />}
									label="Total Lowongan"
									value={stats.totalJobs}
									color="text-blue-600"
								/>
								<StatCard
									icon={<TickCircle />}
									label="Aktif"
									value={stats.activeJobs}
									color="text-green-600"
								/>
								<StatCard
									icon={<CloseCircle />}
									label="Ditutup"
									value={stats.closedJobs}
									color="text-orange-600"
								/>
								<StatCard
									icon={<DocumentText />}
									label="Pelamar"
									value={stats.totalApplicants}
									color="text-purple-600"
								/>
							</div>

							{/* FILTER */}
							<Filters
								searchQuery={searchQuery}
								setSearchQuery={setSearchQuery}
								statusFilter={statusFilter}
								setStatusFilter={setStatusFilter}
								workTypeFilter={workTypeFilter}
								setWorkTypeFilter={setWorkTypeFilter}
								sortBy={sortBy}
								setSortBy={setSortBy}
							/>

							{/* LIST LOWONGAN */}
							<JobList
								jobs={filteredJobs}
								formatDate={formatDate}
								handleDelete={handleDelete}
								handleToggleStatus={handleToggleStatus}
							/>
						</>
					)}
				</main>
			</div>
		</div>
	);
}

function StatCard({ icon, label, value, color }) {
	return (
		<div className="bg-white rounded-lg p-4 border border-gray-200">
			<div className="flex items-center justify-between">
				<span className={`${color}`}>{icon}</span>
				<span className="text-2xl font-bold text-gray-900">{value}</span>
			</div>
			<p className="text-sm text-gray-600 mt-2">{label}</p>
		</div>
	);
}

function Filters({ searchQuery, setSearchQuery, statusFilter, setStatusFilter, workTypeFilter, setWorkTypeFilter, sortBy, setSortBy }) {
	return (
		<div className="bg-white rounded-lg border border-gray-200 p-4">
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
				{/* Search */}
				<div className="lg:col-span-2 relative">
					<SearchNormal
						size={18}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
					/>
					<input
						type="text"
						placeholder="Cari lowongan..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
					/>
				</div>

				{/* Status */}
				<select
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
					className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
					<option value="all">Semua Status</option>
					<option value="open">Aktif</option>
					<option value="closed">Ditutup</option>
				</select>

				{/* Work Type */}
				<select
					value={workTypeFilter}
					onChange={(e) => setWorkTypeFilter(e.target.value)}
					className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
					<option value="all">Semua Tipe</option>
					<option value="onsite">Onsite</option>
					<option value="hybrid">Hybrid</option>
					<option value="remote">Remote</option>
				</select>

				{/* Sort */}
				<select
					value={sortBy}
					onChange={(e) => setSortBy(e.target.value)}
					className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
					<option value="newest">Terbaru</option>
					<option value="oldest">Terlama</option>
					<option value="title">Judul A-Z</option>
					<option value="applicants">Pelamar Terbanyak</option>
				</select>
			</div>
		</div>
	);
}

function JobList({ jobs, formatDate, handleDelete, handleToggleStatus }) {
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [jobToDelete, setJobToDelete] = useState(null);

	const confirmDelete = (job) => {
		setJobToDelete(job);
		setShowDeleteModal(true);
	};

	const handleConfirmDelete = async () => {
		if (jobToDelete) {
			await handleDelete(jobToDelete.id);
			setShowDeleteModal(false);
			setJobToDelete(null);
		}
	};

	const handleCancelDelete = () => {
		setShowDeleteModal(false);
		setJobToDelete(null);
	};

	if (jobs.length === 0) {
		return (
			<div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
				<Briefcase
					size={48}
					color="gray"
					className="mx-auto text-gray-300 mb-3"
				/>
				<h3 className="text-lg font-semibold text-gray-900">Belum Ada Lowongan</h3>
				<p className="text-sm text-gray-600">Mulai buat lowongan pertama Anda</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Delete Confirmation Modal */}
			{showDeleteModal && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
					<div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
								<Trash
									size={24}
									color="white"
									className="text-red-600"
								/>
							</div>
							<div>
								<h3 className="text-lg font-bold text-gray-900">Konfirmasi Hapus</h3>
								<p className="text-sm text-gray-500">Tindakan ini tidak dapat dibatalkan</p>
							</div>
						</div>

						<div className="mb-6">
							<p className="text-gray-700 mb-2">Apakah Anda yakin ingin menghapus lowongan ini?</p>
							{jobToDelete && (
								<div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
									<p className="font-semibold text-gray-900">{jobToDelete.title}</p>
									<p className="text-sm text-gray-600">
										{jobToDelete.category} • {jobToDelete.location}
									</p>
								</div>
							)}
						</div>

						<div className="flex gap-3">
							<button
								onClick={handleCancelDelete}
								className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors">
								Batal
							</button>
							<button
								onClick={handleConfirmDelete}
								className="flex-1 px-4 py-2.5 bg-red-600 rounded-lg text-white font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
								<Trash size={18} />
								Hapus
							</button>
						</div>
					</div>
				</div>
			)}

			{jobs.map((job) => (
				<div
					key={job.id}
					className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
					<div className="p-5">
						{/* Header Section */}
						<div className="flex justify-between items-start mb-4">
							<div className="flex-1">
								<div className="flex items-start gap-3 mb-2">
									<h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
									<span className={`px-3 py-1 rounded-full text-xs font-medium ${job.status === 'open' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
										{job.status === 'open' ? '● Aktif' : '● Ditutup'}
									</span>
								</div>
								<p className="text-sm text-gray-500">Diposting {formatDate(job.created_at)}</p>
							</div>

							{/* Action Buttons - Desktop */}
							<div className="hidden lg:flex gap-2 items-center">
								{/* Toggle Switch */}
								<div className="flex items-center gap-2">
									<span className="text-xs text-gray-600 font-medium">{job.status === 'open' ? 'Aktif' : 'Tutup'}</span>
									<button
										onClick={() => handleToggleStatus(job.id, job.status)}
										className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${job.status === 'open' ? 'bg-green-500' : 'bg-gray-300'}`}
										title={job.status === 'open' ? 'Tutup Lowongan' : 'Buka Lowongan'}>
										<span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${job.status === 'open' ? 'translate-x-6' : 'translate-x-1'}`} />
									</button>
								</div>

								<button
									onClick={() => (window.location.href = `/jobs/${job.id}`)}
									className="p-2 bg-slate-700 hover:bg-slate-800 rounded-lg transition-colors"
									title="Lihat Detail">
									<Eye
										size={18}
										color="white"
									/>
								</button>

								<button
									onClick={() => (window.location.href = `/jobs/${job.id}/edit`)}
									className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors"
									title="Edit">
									<Edit
										size={18}
										color="white"
									/>
								</button>

								<button
									onClick={() => confirmDelete(job)}
									className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
									title="Hapus">
									<Trash
										size={18}
										color="white"
									/>
								</button>
							</div>
						</div>

						{/* Main Info Grid */}
						<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 text-sm">
							<div>
								<p className="text-xs text-gray-500 mb-1">Kategori</p>
								<p className="font-medium text-gray-900">{job.category}</p>
							</div>

							<div>
								<p className="text-xs text-gray-500 mb-1">Lokasi</p>
								<p className="font-medium text-gray-900">{job.location}</p>
							</div>

							<div>
								<p className="text-xs text-gray-500 mb-1">Tipe Kerja</p>
								<p className="font-medium text-gray-900 capitalize">{job.work_type}</p>
							</div>

							<div>
								<p className="text-xs text-gray-500 mb-1">Deadline</p>
								<p className="font-medium text-gray-900">{job.deadline ? formatDate(new Date(job.deadline).getTime()) : '-'}</p>
							</div>
						</div>

						{/* Additional Details */}
						<div className="border-t border-gray-100 pt-4 mb-4">
							<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
								{job.employment_duration && (
									<div>
										<p className="text-xs text-gray-500 mb-1">Durasi</p>
										<p className="font-medium text-gray-700">{job.employment_duration}</p>
									</div>
								)}

								{job.gpa_min && (
									<div>
										<p className="text-xs text-gray-500 mb-1">Min. IPK</p>
										<p className="font-medium text-gray-700">{job.gpa_min}</p>
									</div>
								)}

								{job.education_requirement && (
									<div>
										<p className="text-xs text-gray-500 mb-1">Pendidikan</p>
										<p className="font-medium text-gray-700">{job.education_requirement}</p>
									</div>
								)}

								{job.important_dates && (
									<div>
										<p className="text-xs text-gray-500 mb-1">Tanggal Penting</p>
										<p className="font-medium text-gray-700 text-xs leading-relaxed">{job.important_dates}</p>
									</div>
								)}
							</div>
						</div>

						{/* Stats & Actions */}
						<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 pt-4 border-t border-gray-100">
							{/* Action Buttons - Mobile */}
							<div className="flex lg:hidden gap-2 w-full lg:w-auto items-center">
								{/* Toggle Switch Mobile */}
								<div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
									<span className="text-xs text-gray-600 font-medium whitespace-nowrap">{job.status === 'open' ? 'Aktif' : 'Tutup'}</span>
									<button
										onClick={() => handleToggleStatus(job.id, job.status)}
										className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${job.status === 'open' ? 'bg-green-500' : 'bg-gray-300'}`}>
										<span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${job.status === 'open' ? 'translate-x-6' : 'translate-x-1'}`} />
									</button>
								</div>

								<button
									onClick={() => (window.location.href = `/jobs/${job.id}`)}
									className="flex-1 p-2 bg-slate-700 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2">
									<Eye
										size={18}
										color="white"
									/>
									<span className="text-white text-sm">Detail</span>
								</button>

								<button
									onClick={() => (window.location.href = `/jobs/${job.id}/edit`)}
									className="p-2 bg-yellow-500 hover:bg-yellow-600 rounded-lg transition-colors">
									<Edit
										size={18}
										color="white"
									/>
								</button>

								<button
									onClick={() => confirmDelete(job)}
									className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
									<Trash
										size={18}
										color="white"
									/>
								</button>
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
