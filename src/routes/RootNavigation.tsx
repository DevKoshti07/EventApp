import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { navigationKeys } from '../constants/navigationKeys';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import EventList from '../screens/EventList';
import Favourites from '../screens/Favourites';
import Profile from '../screens/Profile';
import SplashScreen from '../screens/SplashScreen';
import { navigationRef } from '../utils/navigationService';
import BottomTabNavigator from './BottomTabNavigator';
import Search from '../screens/Search';

const Stack = createNativeStackNavigator();

export default function RootNavigation() {
    return (
        <NavigationContainer ref={navigationRef}>
            <Stack.Navigator initialRouteName={navigationKeys.SplashScreen} screenOptions={{ headerShown: false, gestureEnabled: false }}>
                <Stack.Screen name={navigationKeys.SplashScreen} component={SplashScreen} />
                <Stack.Screen name={navigationKeys.LoginScreen} component={LoginScreen} />
                <Stack.Screen name={navigationKeys.SignUpScreen} component={SignUpScreen} />
                <Stack.Screen name={navigationKeys.BottomTabNavigator} component={BottomTabNavigator} />
                <Stack.Screen name={navigationKeys.Search} component={Search} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({})