import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CommonDataState {
    isLoading: boolean;
    isNetworkAvailable: boolean;
}

const initialState: CommonDataState = {
    isLoading: false,
    isNetworkAvailable: true,
};

const commonDataSlice = createSlice({
    name: 'commonData',
    initialState,
    reducers: {
        setIsLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setIsNetworkAvailable: (state, action: PayloadAction<boolean>) => {
            state.isNetworkAvailable = action.payload;
        },
    },
});

export const { setIsLoading, setIsNetworkAvailable } = commonDataSlice.actions;
export default commonDataSlice.reducer;
