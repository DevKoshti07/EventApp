import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface EventStyle {
    id: number | string;
    name: string;
}

export interface EventItem {
    id: number | string;
    title: string;
    start_date?: string;
    end_date?: string;
    start_time?: string;
    end_time?: string;
    date?: string;
    min_price?: string | number;
    max_price?: string | number;
    price?: string;
    city?: string;
    country?: string;
    location?: string;
    type?: string;
    category?: string;
    styles?: EventStyle[];
    banner_image?: string;
    image?: string;
    isFavourite: boolean;
    [key: string]: any;
}

interface HomeScreenDataState {
    events: EventItem[];
    selectedFilter: string;
}

const initialState: HomeScreenDataState = {
    events: [],
    selectedFilter: 'All',
};

const homeScreenDataSlice = createSlice({
    name: 'homeScreenData',
    initialState,
    reducers: {
        setEvents: (state, action: PayloadAction<any[]>) => {
            state.events = action.payload.map((item: any) => ({
                ...item,
                isFavourite: false,
            }));
        },
        setSelectedFilter: (state, action: PayloadAction<string>) => {
            state.selectedFilter = action.payload;
        },
        toggleEventFavourite: (state, action: PayloadAction<number | string>) => {
            const event = state.events.find(e => e.id === action.payload);
            if (event) event.isFavourite = !event.isFavourite;
        },
    },
});

export const { setEvents, setSelectedFilter, toggleEventFavourite } = homeScreenDataSlice.actions;
export default homeScreenDataSlice.reducer;
