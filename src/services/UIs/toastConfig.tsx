import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { hasNotch } from 'react-native-device-info';
import Toast, { ToastConfig as ToastMessageType } from 'react-native-toast-message';
import { AppColors } from '../../theme/AppColors';
interface ToastConfigParams {
    text1?: string;
    topOffset?: number;
    type?: 'success' | 'warning' | 'error';
}

type ToastView = (params: ToastConfigParams) => React.ReactNode;

export const has_Notch = hasNotch();

const CustomToastView: ToastView = ({ text1, type }) => {

    let backgroundColor;

    switch (type) {
        case 'error': backgroundColor = AppColors.warningRed;
            break;
        case 'warning': backgroundColor = AppColors.warningOrange;
            break;
        case 'success': backgroundColor = AppColors.warningGreen;
            break;
        default: break;
    }

    return (
        <View style={[styles.mainViewStyle, { backgroundColor }]}>

            <View style={styles.subViewStyle}>
                <Text numberOfLines={2} style={styles.textStyle}>
                    {text1 ?? 'Something went wrong'}
                </Text>
            </View>

        </View>
    );
};

const toastConfig: ToastMessageType = {
    error: (props) => <CustomToastView  {...props} type="error" />,
    success: (props) => <CustomToastView {...props} type="success" />,
    warning: (props) => <CustomToastView {...props} type="warning" />,
};

const styles = StyleSheet.create({
    mainViewStyle: {
        height: 50,
        width: '90%',
        justifyContent: 'center',
        borderRadius: 10,
        // bottom: 50,
    },
    subViewStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
    },
    iconStyle: {
        tintColor: AppColors.basicWhite,
    },
    textStyle: {
        color: AppColors.basicWhite,
        width: '90%',
        fontSize: 14,
        paddingLeft: 10,
    },
});

export const _showToast = (msg: string, type: string = 'error') => {
    Toast.show({ type, text1: msg, visibilityTime: 2000 })
};

export default toastConfig;