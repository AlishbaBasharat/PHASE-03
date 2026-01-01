'use client';

import { useState } from 'react';

type FilterType = 'all' | 'active' | 'completed';

interface TaskFiltersProps {
  onFilterChange: (filter: FilterType) => void;
}

export default function TaskFilters({ onFilterChange }: TaskFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const handleFilterClick = (filter: FilterType) => {
    setActiveFilter(filter);
    onFilterChange(filter);
  };

  return (
    <div className="flex border-b border-gray-200">
      <button
        onClick={() => handleFilterClick('all')}
        className={`py-2 px-4 text-sm font-medium ${
          activeFilter === 'all'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        All
      </button>
      <button
        onClick={() => handleFilterClick('active')}
        className={`py-2 px-4 text-sm font-medium ${
          activeFilter === 'active'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Active
      </button>
      <button
        onClick={() => handleFilterClick('completed')}
        className={`py-2 px-4 text-sm font-medium ${
          activeFilter === 'completed'
            ? 'text-blue-600 border-b-2 border-blue-600'
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        Completed
      </button>
    </div>
  );
}