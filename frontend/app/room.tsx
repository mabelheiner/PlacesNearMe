import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Place from './components/Place'
import { useNavigation } from 'expo-router'
import { Gesture, GestureDetector, GestureHandlerRootView, Pressable } from 'react-native-gesture-handler'
import Animated, { FlipInEasyX, runOnJS, useSharedValue } from 'react-native-reanimated'
import globalStyles from './globalStyles/globalStyles'

interface Restaurant {
  id: number,
  name: string,
  address: string,
  lat: number,
  lon: number,
  googleMapsLink: string,
  logoUrl: string,
}

export default function Room() {
  const [roomId, setRoomId] = useState<string>('')
  const [restaurants, setRestaurants] = useState<any[]>([])
  const [roomInfo, setRoomInfo] = useState<{id: string; restaurants: Restaurant[]}>({id: '', restaurants: []})
  const [loading, setLoading] = useState(false)
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const restaurantIndex = useSharedValue(0) 

  const navigation = useNavigation()

  useEffect(() => {
    const fetchRoomId = async () => {
      setLoading(true)
      try {
        const responseRoomId = await AsyncStorage.getItem('Room Code')
        const responseRestaurantData = await AsyncStorage.getItem('restaurants')

        const responseRoom = await AsyncStorage.getItem('Room')
        console.log('Response from room', responseRoom)

        if (responseRoom) {
          setRoomInfo(JSON.parse(responseRoom))

          navigation.setOptions({
            title: `Room: ${JSON.parse(responseRoom).publicId}`
          })
        }
  
        console.log('room id', responseRoomId)
        console.log('restaurants', responseRestaurantData)
  
        if (responseRoomId) {
          setRoomId(responseRoomId)
        }
  
        if (responseRestaurantData) {
          setRestaurants(JSON.parse(responseRestaurantData))
          const res = JSON.parse(responseRestaurantData)
          console.log('First restaurant', res[currentIndex])
        }

      } catch (error) {
        console.error('Error in fetching data from AsyncStorage', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRoomId()
  }, [])

  if (loading) {
    return (
      <Text>Loading...</Text>
    )
  }

  const swipeGesture = Gesture.Pan().onEnd((event) => {
    console.log('Gesture detected')
    const { translationX } = event

    if (
      translationX < -50 &&
      restaurantIndex.value < restaurants.length - 1
    ) {
      restaurantIndex.value += 1
      runOnJS(setCurrentIndex)(restaurantIndex.value)
    } else if (
      translationX > 50 &&
      restaurantIndex.value > 0
    ) {
      restaurantIndex.value -= 1
      runOnJS(setCurrentIndex)(restaurantIndex.value)
    }

    console.log('Restaurant index', restaurantIndex.value)
  })

  const decrementIndex = () => {
    restaurantIndex.value = Math.max(restaurantIndex.value - 1, 0)
  }

  const incrementIndex = () => {
    restaurantIndex.value = Math.min(restaurantIndex.value + 1, restaurants.length - 1)
  }
  return (
    <GestureHandlerRootView>  

      {restaurants.length < 0 ? (<Text>Loading...</Text>) : 
      (
        
          <GestureDetector gesture={swipeGesture}>
            <Animated.View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: '100%', backgroundColor: 'blue'}}>
              {/* <Pressable
                style={globalStyles.button}
                onPress={decrementIndex}
              >
                <Text style={globalStyles.buttonText}>-</Text>
              </Pressable> */}
              {restaurants.length > 0 &&
              currentIndex >= 0 &&
              currentIndex < restaurants.length ?
              (
              <>
                  <View style={styles.restaurantCard}>
                    <Text style={{position: 'absolute', top: 0, right: 0}}>{currentIndex + 1}/{restaurants.length}</Text>
                    <View style={styles.place}>
                      <Place restaurant={restaurants[currentIndex]} />
                    </View>                    
                  </View>                  
              </>
              ) : (<Text>No display available</Text>)
              }
              {/* <Pressable
                style={globalStyles.button}
                onPress={incrementIndex}
              >
                <Text style={globalStyles.buttonText}>+</Text>
              </Pressable> */}
            </Animated.View>
          </GestureDetector>
        
      )}
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  restaurantCard: {
    padding: 16,
    height: '100%',
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center'
  },
  place: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})