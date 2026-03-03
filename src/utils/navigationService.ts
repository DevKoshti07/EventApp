import React from 'react';

export const navigationRef = React.createRef<any>();

const navigate = (name: string, params?: any) => {
    navigationRef.current?.navigate(name, params);
};

const goBack = () => {
    navigationRef.current?.goBack();
};

const reset = (index: any, routes: any) => {
    navigationRef.current?.reset({
        index,
        routes,
    });
};

const replace = (name: any, params?: any) => {
    navigationRef.current?.replace(name, params);
};

const getCurrentRoute = () => {
    return navigationRef.current?.getCurrentRoute();
};

const popToTop = () => {
    navigationRef.current?.popToTop();
};

export const NavAction = {
    navigate,
    goBack,
    reset,
    getCurrentRoute,
    replace,
    popToTop,
};
