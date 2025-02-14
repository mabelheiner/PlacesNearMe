import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { useFonts } from 'expo-font'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function _layout() {
    const [fontsLoaded, error] = useFonts({
        'Roboto': require('./assets/fonts/Roboto.ttf'),
        'SpaceMono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        'PlayfairDisplay': require('./assets/fonts/PlayfairDisplay.ttf')
    }) 

    useEffect(() => {
        console.log('Fonts loaded', fontsLoaded)
        console.log('Error', error);  
              
    }, [fontsLoaded])

    useEffect(() => {
        console.log('Error found:', error)
    }, [error])

    if (!fontsLoaded) {
        return <View style={{backgroundColor: 'white'}}>
            <Text>Loading...</Text>
        </View>
    }
  return (
    <Stack>
        <Stack.Screen name='index' options={{headerShown: false}} />
        <Stack.Screen name='host' />
        <Stack.Screen name="join" />
        <Stack.Screen name="room" options={{gestureEnabled: false}}/>
        <Stack.Screen name='saved' />
        <Stack.Screen name='groupResults' />
    </Stack>
  )
}