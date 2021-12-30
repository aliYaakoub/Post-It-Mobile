import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { MaterialCommunityIcons, Ionicons, AntDesign } from '@expo/vector-icons';

import HomeScreen from './HomeScreen';
import defaultStyles from '../../config/defaultStyles';
import UserSettingsScreen from './UserSettingsScreen';
import NewPostScreen from './NewPostScreen';
import LogInScreen from './LogInScreen';
import { useAuth } from '../../contexts/AuthContext';

const Tab = createBottomTabNavigator()

const MainScreen = () => {

    const { currentUser } = useAuth()

    return (
        <Tab.Navigator
            screenOptions={{
                keyboardHidesTabBar: true,
                tabBarShowLabel: false,
                tabBarStyle: {
                    position: 'absolute',
                    bottom: 5,
                    left: 5,
                    right: 5,
                    backgroundColor: '#000000cc',
                    borderRadius: 25,
                    height: 70,
                    // overflow: 'hidden'
                }
            }}
        >
            <Tab.Screen name='home' component={HomeScreen} options={{
                headerShown: false,
                tabBarHideOnKeyboard: true,
                tabBarIcon: ({focused}) => (
                    <View style={styles.container}>
                        <MaterialCommunityIcons 
                            name='home' 
                            size={35} 
                            color={focused ? defaultStyles.colors.secondary : defaultStyles.colors.text.primary} 
                        />
                    </View>
                )
            }} />
            <Tab.Screen name='newPost' component={NewPostScreen} options={{
                tabBarHideOnKeyboard: true,
                headerShown: false,
                tabBarIcon: ({focused}) => (
                    <View style={[styles.container]}>
                        {!focused ?
                            <Ionicons 
                                name="md-add-circle-outline" 
                                size={60} 
                                color={focused ? defaultStyles.colors.secondary : defaultStyles.colors.text.primary}
                            />
                            :
                            <Ionicons 
                                name="md-add-circle" 
                                size={60} 
                                color={focused ? defaultStyles.colors.secondary : defaultStyles.colors.text.primary}
                            />
                        }
                    </View>
                )
            }}  />
            {currentUser ? 
                <Tab.Screen name='settings' component={UserSettingsScreen} options={{
                    headerShown: false,
                    tabBarHideOnKeyboard: true,
                    tabBarIcon: ({focused}) => (
                        <View style={styles.container}>
                            <Ionicons 
                                name="settings-outline" 
                                size={35} 
                                color={focused ? defaultStyles.colors.secondary : defaultStyles.colors.text.primary} 
                            />
                        </View>
                    )
                }}  />
                :
                <Tab.Screen name='login' component={LogInScreen} options={{
                    headerShown: false,
                    tabBarHideOnKeyboard: true,
                    tabBarIcon: ({focused}) => (
                        <View style={styles.container}>
                            <AntDesign 
                                name="login" 
                                size={35} 
                                color={focused ? defaultStyles.colors.secondary : defaultStyles.colors.text.primary} 
                            />
                        </View>
                    )
                }}  />
            }
        </Tab.Navigator>
    )
}

export default MainScreen

const styles = StyleSheet.create({
    active: {
        color: defaultStyles.colors.primary
    },
    default: {
        color: defaultStyles.colors.text.secondary
    },
    container: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    }
})
