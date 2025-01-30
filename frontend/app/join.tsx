import { Modal, Pressable, StyleSheet, Text, View, TextInput, TouchableOpacity, Button } from 'react-native'
import React, {useEffect, useState} from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import globalStyles from './globalStyles/globalStyles'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from 'expo-router'
import InformationPopup from './components/InformationPopup'
export default function Join() {
  const [roomCode, setRoomCode] = useState('')
  const router = useRouter()
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false)

  const findRoom = async() => {
    console.log('Find room triggered')
    try {
      const response = await axios.get(`https://placesnearme.onrender.com/rooms/${roomCode}`)
      console.log('Response', response)
      if (response.status === 200) {
        const rooms = JSON.stringify(response.data)
        AsyncStorage.setItem('Room', rooms)
        router.push('/room')
      } else {
        alert('Cannot find room with that room code')
      }
    } catch (error) {
      console.log('Error', error)
      alert('Cannot find room with that room code.')
    }
    console.log('After try catch')
  }

  const joinInfo = () => {
    alert('Join info')
    console.log('Join info')
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

  return (
    <SafeAreaView>
      <InformationPopup title="Join Info" body='Enter the room code given when hosting a page, should be a six character number (i.e. 123456)' modalVisible={modalVisible} setModalVisible={setModalVisible} />
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