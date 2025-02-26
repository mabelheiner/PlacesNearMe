import { View, StyleSheet, Pressable, Text, TouchableOpacity, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import globalStyles from './globalStyles/globalStyles' 
import { Link } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { MaterialIcons } from '@expo/vector-icons'
import InformationPopup from './components/InformationPopup'
import {LinearGradient} from 'expo-linear-gradient'

const heroImage = require('./assets/images/index.png')

export default function Index() {
  const [modalVisible, setModalVisible] = useState(false);
  
  return (
    <>
    <Image
      source={heroImage}
      style={{position: 'absolute', bottom: 0, opacity: 1, width: '100%', resizeMode: 'contain', backgroundColor: '#73c6f6' }}
      />
    <SafeAreaView style={globalStyles.containerContentCenter}>
      <StatusBar style='dark' translucent={true} hidden={false} />
      <TouchableOpacity style={{position: 'absolute', top: 30, right: 0}} onPress={() => setModalVisible(true)}>
        <MaterialIcons name='info-outline' size={40} style={{color: '#06339F'}}/>
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
      {/* <Image
          style={styles.image}
          source={heroImage}
        />  */}
      <View style={{position: 'relative', top: '25%'}}>
      <Text 
        style={{marginBottom: 0, fontWeight: 'bold', color: '#06339F', fontSize: 24, textAlign: 'center'}}>
          You Decide
      </Text>
      <Text 
        style={{marginBottom: 50, color: '#06339F', fontSize: 24, textAlign: 'center'}}>
          Where You Want to Go
      </Text>
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
      </View>
    </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginVertical: 16,
    borderRadius: 8,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})