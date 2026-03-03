import NetInfo from '@react-native-community/netinfo';
import axios from 'axios';
import { Config, getFullApiUrl } from '../../config';
import { navigationKeys } from '../../constants/navigationKeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavAction } from '../../utils/navigationService';

const TIME_OUT = 120000; // 15 seconds

// const dispatch = store.dispatch;

const _checkInternetConnectivity = async (): Promise<any> => {
    const netInfoState = await NetInfo.fetch();
    return netInfoState?.isConnected;
};

const get = async (endpoint: any, params: any = '', customHeaders: any = {}, timeoutApi = TIME_OUT) => {
    // const TOKEN = store.getState().homeScreen?.userData?.token;
    const isConnected = await _checkInternetConnectivity();

    if (!isConnected) {
        // _showToast('No Internet Connection!', 'error');
        return { error: 'No Internet Connection' };
    }

    let rootHeaders = {};

    // if (TOKEN) {
    //     rootHeaders = { Authorization: `Bearer ${TOKEN}` }
    // }

    console.log(customHeaders);

    if (customHeaders && Object.keys(customHeaders).length > 0) {
        rootHeaders = { ...rootHeaders, ...customHeaders };
    }

    if (endpoint && endpoint.length > 0) {
        try {
            const response = await axios.get(getFullApiUrl(endpoint) as any, {
                headers: rootHeaders,
                params: params,
                timeout: timeoutApi
            });

            return response?.data;

        } catch (error: any) {

            console.log('[ error.response ] ----------------------->> ', error);

            if (error?.response?.data?.StatusCode == 401) {
                console.log("executed");
                AsyncStorage.clear();
                NavAction.reset(0, [{ name: navigationKeys.LoginScreen }]);
            }
            if (error?.response) {
                return error?.response?.data || 'Something went wrong';
            }

            return { error: error || 'Unknown Error' };
        }
    }
    return { error: 'Endpoint not provided' };
};

const post = async (endpoint: any, data: any, customHeaders = [], timeoutApi = TIME_OUT) => {
    // const TOKEN = store.getState().homeScreen?.userData?.token;
    const isConnected = await _checkInternetConnectivity();

    if (!isConnected) {
        // _showToast('No Internet Connection', 'error');
        return { error: 'No Internet Connection' };
    }

    let rootHeaders = {};

    // if (TOKEN) {
    //     rootHeaders = { Authorization: `Bearer ${TOKEN}` }
    // }

    console.log(customHeaders);

    if (customHeaders && Object.keys(customHeaders).length > 0) {
        rootHeaders = { ...rootHeaders, ...customHeaders };
    }

    if (endpoint && endpoint.length > 0) {
        try {
            const response = await axios.post(getFullApiUrl(endpoint) as any, data, {
                headers: rootHeaders,
                timeout: timeoutApi
            });
            return response?.data;
        } catch (error: any) {

            console.log('[ error.response ] ----------------------->> ', error.response.data);

            if (error?.response?.data?.StatusCode == 401) {
                console.log("executed");
                // dispatch(setLogout());
                // dispatch(setIsLogin(false));
                // dispatch(setClocking(false));
                // NavAction.reset(0, [{ name: NavigationKeys.AuthNavigator }]);
            }

            if (error?.response) {
                return error?.response || 'Something went wrong';
            }

            return { error: error || 'Unknown Error' };
        }
    }
    return { error: 'Endpoint not provided' };
};

export const APIMethods = {
    get,
    post
};