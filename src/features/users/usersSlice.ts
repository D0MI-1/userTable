import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    phone: string;
}

export interface UserState {
    users: User[];
    filteredUsers: User[];
    filters: {
        name: string;
        username: string;
        email: string;
        phone: string;
    }
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    sortColumn: keyof User | null;
    sortDirection: 'asc' | 'desc';
}

const initialState: UserState = {
    users: [],
    filteredUsers: [],
    filters: {
        name: '',
        username: '',
        email: '',
        phone: '',
    },
    status: 'idle',
    error: null,
    sortColumn: null,
    sortDirection: 'asc',
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    return (await response.json()) as User[];
})

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        filterUsers: (state, action: PayloadAction<{ key: keyof UserState['filters']; value: string }>) => {
            state.filters[action.payload.key] = action.payload.value;
            state.filteredUsers = state.users.filter(user =>
                Object.entries(state.filters).every(([key, value]) => {
                    const userValue = user[key as keyof User];
                    if (typeof userValue === 'string' && typeof value === 'string') {
                        return userValue.toLowerCase().includes(value.toLowerCase());
                    }
                    if (typeof userValue === 'number' && typeof value === 'string') {
                        return userValue.toString().includes(value);
                    }
                    return true; // Fallback value
                })
            );
        },
        sortUsers: (state, action: PayloadAction<keyof User>) => {
            const column = action.payload;

            if (state.sortColumn === column) {
                state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
            } else {
                state.sortColumn = column;
                state.sortDirection = 'asc';
            }
            state.filteredUsers.sort((a, b) => {
                if (a[column] < b[column]) return state.sortDirection === 'asc' ? -1 : 1;
                if (a[column] > b[column]) return state.sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
            state.filteredUsers = state.users;
            state.sortDirection = initialState.sortDirection;
            state.sortColumn = initialState.sortColumn;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
                state.filteredUsers = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || null;
            });
    }
})

export const { filterUsers, clearFilters, sortUsers } = usersSlice.actions;
export default usersSlice.reducer;