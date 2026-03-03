import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserData {
    id?: string | number;
    name?: string;
    email?: string;
    token?: string;
    [key: string]: any;
}

interface AuthState {
    isLogin: boolean;
    userData: UserData | null;
}

const initialState: AuthState = {
    isLogin: false,
    userData: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setIsLogin: (state, action: PayloadAction<boolean>) => {
            state.isLogin = action.payload;
        },
        setUserData: (state, action: PayloadAction<UserData | null>) => {
            state.userData = action.payload;
        },
        logout: (state) => {
            state.isLogin = false;
            state.userData = null;
        },
    },
});

export const { setIsLogin, setUserData, logout } = authSlice.actions;
export default authSlice.reducer;
