import { StyleSheet, Text, View, Pressable } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Modal } from 'react-native'
import globalStyles from '../globalStyles/globalStyles'

interface InformationPopupProps {
    title: string;
    body: React.ReactNode;
    modalVisible: boolean;
    setModalVisible: (visible: boolean) => void;
}
export default function InformationPopup({title, body, modalVisible, setModalVisible}: InformationPopupProps) {
  return (
    <Modal
        animationType='slide'
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <View style={{width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center'}}>
            <Text style={{fontSize: 18, marginBottom: 10}}>{title}</Text>
            <Text style={{textAlign: 'center', marginBottom: 10}}>{body}</Text>
            <Pressable style={globalStyles.button} onPress={() => setModalVisible(false)}><Text style={globalStyles.buttonText}>Close</Text></Pressable>
          </View>
        </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({})