import React, { useState } from 'react';

const HeaderSearch = ({ onSearch, filterOptions, onApplyFilter}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    locations: [],
    positions: [],
    workScheme: [],
    duration: []
  });
  const [customOptions, setCustomOptions] = useState({
    locations: [],
    positions: [],
    workScheme: [],
    duration: []
  });
  const [customInputs, setCustomInputs] = useState({
    locations: '',  
    positions: '',
    workScheme: '',
    duration: ''
  });
  const [showCustomInput, setShowCustomInput] = useState({
    locations: false,
    positions: false,
    workScheme: false,
    duration: false
  });

  const filterSections = [
  {
    id: 'locations',
    title: 'Lokasi',
    options: filterOptions.locations.map(loc => ({
      value: loc.toLowerCase(),
      label: loc
    }))
  },
  {
    id: 'positions',
    title: 'Posisi',
    options: filterOptions.positions.map(pos => ({
      value: pos.toLowerCase(),
      label: pos
    }))
  },
  {
    id: 'workScheme',
    title: 'Skema Kerja',
    options: filterOptions.workScheme.map(w => ({
      value: w.toLowerCase(),
      label: w
    }))
  },
  {
    id: 'duration',
    title: 'Durasi',
    options: filterOptions.duration.map(d => ({
      value: d.toLowerCase(),
      label: d
    }))
  }
];

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      onSearch(e.target.value);
    }
  };

  const toggleFilter = (section, value) => {
    setSelectedFilters(prev => {
      const current = prev[section];
      const newValues = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [section]: newValues };
    });
  };

  const addCustomOption = (section) => {
    const customValue = customInputs[section].trim();
    if (customValue && !customOptions[section].includes(customValue)) {
      setCustomOptions(prev => ({
        ...prev,
        [section]: [...prev[section], customValue]
      }));
      setSelectedFilters(prev => ({
        ...prev,
        [section]: [...prev[section], customValue]
      }));
      setCustomInputs(prev => ({ ...prev, [section]: '' }));
      setShowCustomInput(prev => ({ ...prev, [section]: false }));
    }
  };

  const handleCustomInputKeyPress = (e, section) => {
    if (e.key === 'Enter') {
      addCustomOption(section);
    }
  };

  const clearAll = () => {
    setSelectedFilters({
      locations: [],
      positions: [],
      workScheme: [],
      duration: []
    });
    setCustomOptions({
      locations: [],
      positions: [],
      workScheme: [],
      duration: []
    });
    setShowCustomInput({
      locations: false,
      positions: false,
      workScheme: false,
      duration: false
    });
    setCustomInputs({
      locations: '',
      positions: '',
      workScheme: '',
      duration: ''
    });
  };

  const getActiveFilterCount = () => {
    return Object.values(selectedFilters).flat().length;
  };

  const handleApplyFilter = () => {
  onApplyFilter(selectedFilters);
  setIsFilterOpen(false);
  };


  return (
    <>
      <div className="px-12 mt-6">
        <h1 className="text-2xl font-poppins font-semibold mb-4">Pencarian</h1>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Cari posisi atau perusahaan..."
            className="w-full border rounded-xl p-4"
            onKeyDown={handleKeyPress}
          />

          <button
            className="px-6 py-3 bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white rounded-xl flex items-center gap-2 hover:opacity-90 transition-opacity"
            onClick={() => setIsFilterOpen(true)}
          >
            <i className="bi bi-funnel-fill text-xl"></i>
            Filter
            {getActiveFilterCount() > 0 && (
              <span className="px-2 py-0.5 bg-white text-blue-600 text-xs font-bold rounded-full">
                {getActiveFilterCount()}
              </span>
            )}
          </button>
        </div>
      </div>

      {isFilterOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
            onClick={() => setIsFilterOpen(false)}
          />

          <div className="fixed top-0 right-0 h-full w-full md:w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out flex flex-col animate-slide-in">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="bi bi-funnel-fill text-xl text-blue-600"></i>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Filter</h2>
                  <p className="text-sm text-gray-500">
                    {getActiveFilterCount()} filter aktif
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="bi bi-x-lg text-2xl text-gray-500"></i>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-8">
                {filterSections.map((section) => (
                  <div key={section.id}>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="text-blue-600">{section.icon}</div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {section.title}
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {section.options.map((option) => {
                        const isSelected = selectedFilters[section.id].includes(option.value);
                        return (
                          <button
                            key={option.value}
                            onClick={() => toggleFilter(section.id, option.value)}
                            className={`px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                              isSelected
                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                      
                      {customOptions[section.id].map((customOption) => {
                        const isSelected = selectedFilters[section.id].includes(customOption);
                        return (
                          <button
                            key={customOption}
                            onClick={() => toggleFilter(section.id, customOption)}
                            className={`px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium ${
                              isSelected
                                ? 'bg-blue-50 border-blue-500 text-blue-700'
                                : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {customOption}
                          </button>
                        );
                      })}
                      
                      {!showCustomInput[section.id] ? (
                        <button
                          onClick={() => setShowCustomInput(prev => ({ ...prev, [section.id]: true }))}
                          className="px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-all text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <i className="bi bi-plus-lg"></i>
                          Tambahkan {section.title}
                        </button>
                      ) : (
                        <div className="col-span-2 flex gap-2">
                          <input
                            type="text"
                            value={customInputs[section.id]}
                            onChange={(e) => setCustomInputs(prev => ({ ...prev, [section.id]: e.target.value }))}
                            onKeyPress={(e) => handleCustomInputKeyPress(e, section.id)}
                            placeholder={`Masukkan ${section.title.toLowerCase()} lainnya...`}
                            className="flex-1 px-4 py-2 border-2 border-blue-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            autoFocus
                          />
                          <button
                            onClick={() => addCustomOption(section.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <i className="bi bi-check-lg"></i>
                          </button>
                          <button
                            onClick={() => {
                              setShowCustomInput(prev => ({ ...prev, [section.id]: false }));
                              setCustomInputs(prev => ({ ...prev, [section.id]: '' }));
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                          >
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 bg-white">
              <button
                onClick={clearAll}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reset
              </button>
              <button
                onClick={handleApplyFilter}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
              >
                Terapkan
              </button>
            </div>
          </div>

          <style jsx>{`
            @keyframes slide-in {
              from {
                transform: translateX(100%);
              }
              to {
                transform: translateX(0);
              }
            }
            .animate-slide-in {
              animation: slide-in 0.3s ease-out;
            }
          `}</style>
        </>
      )}
    </>
  );
};

export default HeaderSearch;