import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
  
  const menuGroups = [
    {
      title: "Pendaftaran",
      items: [
        { id: 'cara-mendaftar', label: 'Cara Mendaftar' },
        { id: 'kriteria-umum', label: 'Kriteria Umum' },
      ]
    },
    {
      title: "Tips & Trik",
      items: [
        { id: 'membuat-cv', label: 'Membuat CV Menarik' },
        { id: 'etika-magang', label: 'Etika Magang & Kerja' },
      ]
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 sticky top-24">
      {menuGroups.map((group, groupIndex) => (
        <div key={groupIndex} className={groupIndex !== 0 ? "mt-6 pt-6 border-t border-gray-200" : ""}>
          <h3 className="text-xl font-bold text-gray-500 mb-4">{group.title}</h3>
          <ul className="space-y-3">
            {group.items.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`text-left w-full text-base transition-colors duration-200 ${
                    activeTab === item.id
                      ? "text-blue-600 font-medium" 
                      : "text-gray-600 hover:text-blue-500"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;