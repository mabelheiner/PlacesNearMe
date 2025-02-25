import { StyleSheet, Pressable, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import globalStyles from './globalStyles/globalStyles' 
import { Link } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { MaterialIcons } from '@expo/vector-icons'
import InformationPopup from './components/InformationPopup'

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);
  
  return (
    <SafeAreaView style={globalStyles.containerContentCenter}>
      <StatusBar style='dark' translucent={true} hidden={false} />
      <TouchableOpacity style={{position: 'absolute', top: 30, right: 20}} onPress={() => setModalVisible(true)}>
        <MaterialIcons name='info-outline' size={40} style={{color: 'darkorange'}}/>
      </TouchableOpacity>
      <InformationPopup 
        title='How to Host and Join a Room' 
        body={
          <Text>
            <Text style={{fontWeight: 'bold'}}>Host: </Text> 
            Click this button to search a for places within a particular city and create a room for your friends to vote on what they want to do.{'\n'}
            <Text style={{fontWeight: 'bold'}}>Join: </Text>
            Click this button to join a room that is already by hosted. Be sure to have the room code ready.`
          </Text>
        } 
        modalVisible={modalVisible} 
        setModalVisible={setModalVisible} 
      />
      <Pressable style={globalStyles.button}>
        <Text style={globalStyles.buttonText}>
          <Link href='/host'>Host a Room</Link>
        </Text>
      </Pressable>
      <Pressable style={globalStyles.button}>
        <Text style={globalStyles.buttonText}>
          <Link href='/join'>Join a Room</Link>
        </Text>
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
})