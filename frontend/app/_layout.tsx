import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
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