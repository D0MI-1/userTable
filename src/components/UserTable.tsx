import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchUsers, User, sortUsers } from '../features/users/usersSlice';
import { SearchBar } from './SearchBar';
import { Loader2, ChevronDown, ChevronUp } from 'lucide-react';

export default function UserTable() {

    const dispatch = useDispatch<AppDispatch>();
    const { filteredUsers, status, error, sortColumn, sortDirection} = useSelector((state: RootState) => state.users);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchUsers());
        }
    }, [status, dispatch]);

    const handleSort = (column: keyof User) => {
        dispatch(sortUsers(column));
    };

    if (status === 'loading') {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
            </div>
        );
    }
    if (status === 'failed') return <div className="text-center text-2xl mt-8 text-red-600">Oops! There was a problem loading the data. Please try again later. {error}</div>;

    return (
        <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-center">User Directory</h1>
            <div className="bg-white rounded-lg shadow-md p-6">
                <SearchBar/>
                <div className="overflow-x-auto">
                    <div className="max-h-[74vh] overflow-y-auto">
                        <table className="min-w-full bg-white border border-gray-300">
                            <thead className="bg-gray-300 sticky top-0">
                            <tr>
                                {['name', 'username', 'email', 'phone'].map((column) => (
                                    <th key={column}
                                        className={`p-3 border cursor-pointer transition-colors duration-150 ease-in-out
                                                    ${sortColumn === column ? 'bg-indigo-500 text-white' : 'hover:bg-blue-100'}`}
                                        onClick={() => handleSort(column as keyof User)}>
                                        <div className="flex items-center justify-between">
                                            {column.charAt(0).toUpperCase() + column.slice(1)}
                                            {sortColumn === column && (
                                                sortDirection === 'asc' ? <ChevronUp size={16}/> :
                                                    <ChevronDown size={16}/>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers.map((user: User, index: number) => (
                                <tr key={user.id} className={`hover:bg-blue-50
                                ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}>
                                    <td className="p-3 border">{user.name}</td>
                                    <td className="p-3 border">{user.username}</td>
                                    <td className="p-3 border">{user.email}</td>
                                    <td className="p-3 border">{user.phone}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
