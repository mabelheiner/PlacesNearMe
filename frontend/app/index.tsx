import { StyleSheet, Pressable, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import globalStyles from './globalStyles/globalStyles' 
import { Link } from 'expo-router'

export default function Index() {
  return (
    <SafeAreaView style={globalStyles.containerContentCenter}>
      <Pressable style={globalStyles.button}>
        <Text style={globalStyles.buttonText}>
          <Link href='/host'>Host</Link>
        </Text>
      </Pressable>
      <Pressable style={globalStyles.button}>
        <Text style={globalStyles.buttonText}>
          <Link href='/join'>Join</Link>
        </Text>
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
})