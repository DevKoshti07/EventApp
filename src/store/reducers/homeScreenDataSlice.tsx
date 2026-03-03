import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EventItem {
    id: string;
    title: string;
    date: string;
    price: string;
    category: string;
    location: string;
    isLiked: boolean;
    isFavourite: boolean;
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
        setEvents: (state, action: PayloadAction<EventItem[]>) => {
            state.events = action.payload;
        },
        setSelectedFilter: (state, action: PayloadAction<string>) => {
            state.selectedFilter = action.payload;
        },
        toggleEventLike: (state, action: PayloadAction<string>) => {
            const event = state.events.find(e => e.id === action.payload);
            if (event) event.isLiked = !event.isLiked;
        },
        toggleEventFavourite: (state, action: PayloadAction<string>) => {
            const event = state.events.find(e => e.id === action.payload);
            if (event) event.isFavourite = !event.isFavourite;
        },
    },
});

export const { setEvents, setSelectedFilter, toggleEventLike, toggleEventFavourite } = homeScreenDataSlice.actions;
export default homeScreenDataSlice.reducer;
