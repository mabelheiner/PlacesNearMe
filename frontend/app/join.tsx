import { Pressable, StyleSheet, Text, TextInput } from 'react-native'
import React, {useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import globalStyles from './globalStyles/globalStyles'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'

export default function Join() {
  const [roomCode, setRoomCode] = useState('')
  const router = useRouter()

  const findRoom = async() => {
    console.log('Find room triggered')
    try {
      const response = await axios.get(`http://10.41.1.141:3000/rooms/${roomCode}`)
      console.log('Response', response)
      if (response.status === 200) {
        AsyncStorage.setItem('Room', JSON.stringify(response.data.room))
        //router.push('/room')
      } else {
        alert('Cannot find room with that room code')
      }
    } catch (error) {
      console.log('Error', error)
      alert('Cannot find room with that room code.')
    }
    console.log('After try catch')
  }
  return (
    <SafeAreaView>
      <TextInput
        style={globalStyles.textInput}
        placeholder='Room Code'
        value={roomCode}
        onChangeText={setRoomCode}
      />
      <Pressable
        style={globalStyles.button}
        onPress={findRoom}>
          <Text style={globalStyles.buttonText}>Find Room</Text>
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({})