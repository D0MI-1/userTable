import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { filterUsers, clearFilters, UserState } from '../features/users/usersSlice';
import { Search, X } from 'lucide-react'

export function SearchBar() {
    const dispatch = useDispatch<AppDispatch>();
    const { filters } = useSelector((state: RootState) => state.users);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.name as keyof UserState['filters'];
        const value = e.target.value;
        dispatch(filterUsers({ key: name, value }));
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
    };

    const areFiltersActive = Object.values(filters).some(filter => filter !== '');

    return (
        <div className="mb-4">
            <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {(Object.keys(filters) as Array<keyof UserState['filters']>).map((key) => (
                    <div key={key} className="relative">
                        <input
                            type="text"
                            name={key}
                            value={filters[key]}
                            onChange={handleFilterChange}
                            placeholder={`Search by ${key}`}
                            className="w-full p-2 pr-10 border rounded"
                            aria-label={`Filter by ${key}`}
                        />
                        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    </div>
                ))}
            </div>
            {areFiltersActive && (
                <button
                    onClick={handleClearFilters}
                    className="flex items-center justify-center mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    aria-label="Clear all filters"
                >
                    <X size={16} className="mr-2" />
                    Clear Filters
                </button>
            )}
        </div>
    );
};