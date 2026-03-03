import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { NavAction } from '../../utils/navigationService';
import { navigationKeys } from '../../constants/navigationKeys';
import { Fonts } from '../../assets/fonts';
import { AppColors } from '../../theme/AppColors';

export default function SplashScreen() {
    useEffect(() => {
        const timer = setTimeout(() => {
            NavAction.navigate(navigationKeys.LoginScreen);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Plie</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ccc',
    },
    logo: {
        fontSize: 32,
        color: AppColors.primary100,
        fontWeight: 'bold',
        fontFamily: Fonts.BOLD
    },
})