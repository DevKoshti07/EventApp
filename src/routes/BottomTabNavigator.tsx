import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EventList from '../screens/EventList';
import Favourites from '../screens/Favourites';
import Profile from '../screens/Profile';
import Search from '../screens/Search';
import { navigationKeys } from '../constants/navigationKeys';
import { Icons } from '../assets/icons';
import { Fonts, FontSize } from '../assets/fonts';
import { AppColors } from '../theme/AppColors';

const BottomTab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <BottomTab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconSource;
                    let iconStyle = { tintColor: color };

                    switch (route.name) {
                        case navigationKeys.Search:
                            iconSource = Icons.icnSearch;
                            break;
                        case navigationKeys.EventList:
                            iconSource = Icons.icnEvents;
                            break;
                        case navigationKeys.Favourites:
                            iconSource = Icons.icnFavourites;
                            break;
                        case navigationKeys.Profile:
                            iconSource = Icons.icnProfile;
                            break;
                        default:
                            iconSource = Icons.icnEvents;
                    }

                    return (
                        <Image
                            source={iconSource}
                            style={[styles.tabIcon, iconStyle]}
                        />
                    );
                },
                tabBarActiveTintColor: '#000',
                tabBarInactiveTintColor: '#999',
                tabBarLabel: ({ focused, color, children }) => (
                    <Text style={[styles.tabLabel, { color }]}>
                        {children}
                    </Text>
                ),
                tabBarStyle: styles.tabBar,
                tabBarItemStyle: styles.tabBarItem,
                headerShown: false,
            })}
        >
            <BottomTab.Screen
                name={navigationKeys.Search}
                component={Search}
                options={{ tabBarLabel: 'Search' }}
            />
            <BottomTab.Screen
                name={navigationKeys.EventList}
                component={EventList}
                options={{ tabBarLabel: 'Events' }}
            />
            <BottomTab.Screen
                name={navigationKeys.Favourites}
                component={Favourites}
                options={{ tabBarLabel: 'Favourites' }}
            />
            <BottomTab.Screen
                name={navigationKeys.Profile}
                component={Profile}
                options={{ tabBarLabel: 'Profile' }}
            />
        </BottomTab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        height: 80,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingBottom: 5,
        paddingTop: 5,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    tabBarItem: {
        paddingVertical: 5,
    },
    tabIcon: {
        width: 22,
        height: 22,
        resizeMode: 'contain',
    },
    tabLabel: {
        fontSize: FontSize._12,
        fontFamily: Fonts.MEDIUM,
        marginTop: 2,
    },
});