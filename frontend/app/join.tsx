import { Modal, Pressable, StyleSheet, Text, View, TextInput, TouchableOpacity, Button, ActivityIndicator } from 'react-native'
import React, {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import globalStyles from './globalStyles/globalStyles'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from 'expo-router'
import InformationPopup from './components/InformationPopup'
import supabase from './db.mjs'

export default function Join() {
  const [roomCode, setRoomCode] = useState('')
  const router = useRouter()
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const findRoom = async() => {
    setLoading(true)
    try {
      const response = await supabase.from('rooms').select('*').eq('publicId', roomCode)

      console.log('Response from join', response)
      if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
        const room = response.data[0]
        console.log('Room:', room)
        console.log('Room id check', room._id)

        const roomData = JSON.stringify(room)
        await AsyncStorage.setItem('Room', roomData)
        await AsyncStorage.setItem('Filter', JSON.stringify(room.filter))

        const roomStored = await AsyncStorage.getItem('Room')
        console.log('Room found in storage', roomStored)
        if (roomStored) {
          router.push('/room')
        }
      } else {
        alert('Cannot find room with that room code')
      }
    } catch (error) {
      console.log('Error', error)
      alert('Cannot find room with that room code.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <MaterialIcons name='info-outline' size={40} style={{color: 'darkorange'}} />
          </TouchableOpacity>
        )
    })
  }, [navigation])

  if (loading) {
    return (
      <ActivityIndicator size="large" color="blue" />
    )
  }

  return (
    <SafeAreaView>
      <InformationPopup title="Join Info" body='Enter the room code given when hosting a page, should be a six character number (i.e. 123456)' modalVisible={modalVisible} setModalVisible={setModalVisible} />
      <TextInput
        style={globalStyles.textInput}
        keyboardType='numeric'
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