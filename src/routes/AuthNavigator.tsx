import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import SignUpScreen from '../screens/Auth/SignUpScreen';
import { navigationKeys } from '../constants/navigationKeys';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name={navigationKeys.LoginScreen} component={LoginScreen} />
            <Stack.Screen name={navigationKeys.SignUpScreen} component={SignUpScreen} />
        </Stack.Navigator>
    )
}
