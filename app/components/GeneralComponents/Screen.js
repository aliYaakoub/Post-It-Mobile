import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Constants from 'expo-constants';
import { StatusBar } from 'expo-status-bar';

const Screen = ({children, style}) => {
    return (
        <View style={[styles.container, style]}>
            {children}
            <StatusBar style='light' />
        </View>
    )
}

export default Screen

const styles = StyleSheet.create({
    container: {
        paddingTop: Constants.statusBarHeight,
        flex: 1
    }
})
