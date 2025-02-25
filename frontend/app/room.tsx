import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Place from './components/Place'
import { router, useNavigation, useRouter } from 'expo-router'
import { Gesture, GestureDetector, GestureHandlerRootView, Pressable } from 'react-native-gesture-handler'
import Animated, { FlipInEasyX, runOnJS, useSharedValue } from 'react-native-reanimated'
import globalStyles from './globalStyles/globalStyles'
import { MaterialIcons } from '@expo/vector-icons'
import InformationPopup from './components/InformationPopup'
import axios from 'axios'
import { navigate } from 'expo-router/build/global-state/routing'
import supabase from './db.mjs'

const CafesPlaceholder = require('../app/assets/images/placeholders/Cafes.png')
const DojosPlaceholder = require('../app/assets/images/placeholders/Dojos.png')
const FastFoodPlaceholder = require('../app/assets/images/placeholders/Fast Food.png')
const GasStationsPlacholder = require('../app/assets/images/placeholders/Gas Stations.png')
const GolfCoursesPlaceholder = require('../app/assets/images/placeholders/Golf Courses.png')
const GroceryStoresPlaceholder = require('../app/assets/images/placeholders/Grocery Stores.png')
const IceCreamPlaceholder = require('../app/assets/images/placeholders/Ice Cream.png')
const LibrariesPlaceholder = require('../app/assets/images/placeholders/Libraries.png')
const MovieTheaterPlaceholder = require('../app/assets/images/placeholders/Movie Theater.png')
const ParkPlaceholder = require('../app/assets/images/placeholders/Park.png')
const PlanetariumsPlaceholder = require('../app/assets/images/placeholders/Planetariums.png')
const RestaurantPlaceholder = require('../app/assets/images/placeholders/Restaurant.png')
const SalonPlaceHolder = require('../app/assets/images/placeholders/Salons.png')
const ZooPlaceholder = require('../app/assets/images/placeholders/Zoos.png')
const logoPlaceholder = require('../app/assets/images/placeholders/logoPlaceholder.jpg')


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
  const [roomInfo, setRoomInfo] = useState<{publicId: string; restaurants: Restaurant[]}>({publicId: '', restaurants: []})
  const [loading, setLoading] = useState(false)
  
  const [currentIndex, setCurrentIndex] = useState(0)
  const restaurantIndex = useSharedValue(0) 

  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false)

  const [filterLabel, setFilterLabel] = useState<string>('')
  const [placeholderImage, setPlaceholderImage] = useState(CafesPlaceholder)

  const [saved, setSaved] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchRoomId = async () => {
      try {

        const responseRoom = await AsyncStorage.getItem('Room')
        console.log('Response from room', responseRoom)

        if (responseRoom) {
          const jsonParse = JSON.parse(responseRoom)

          if (jsonParse[0] !== undefined) {
            const roomData = jsonParse[0]
            console.log('json room', roomData.filter)
            setRoomInfo(roomData)
            setRestaurants(roomData.restaurantList)
            setFilterLabel(roomData.filter)
            AsyncStorage.setItem('Filter', roomData.filter)
            setRoomId(roomData.publicId)

            console.log('Filter', roomData.filter)
            let filterLabel = roomData.filter
            console.log('Filter label', filterLabel)
            if (filterLabel === "Restaurants") {
              setPlaceholderImage(RestaurantPlaceholder)
            } else if (filterLabel === 'Fast Food') {
              setPlaceholderImage(FastFoodPlaceholder)
            } else if (filterLabel === 'Movie Theaters') {
              setPlaceholderImage(MovieTheaterPlaceholder)
            } else if (filterLabel === 'Golf Courses') {
              setPlaceholderImage(GolfCoursesPlaceholder)
            } else if (filterLabel === 'Cafes') {
              setPlaceholderImage(CafesPlaceholder)
            } else if (filterLabel === 'Gas Stations') {
              setPlaceholderImage(GasStationsPlacholder)
            } else if (filterLabel === 'Libraries') {
              setPlaceholderImage(LibrariesPlaceholder)
            } else if (filterLabel === 'Ice Cream') {
              setPlaceholderImage(IceCreamPlaceholder)
            } else if (filterLabel === 'Dojos') {
              setPlaceholderImage(DojosPlaceholder)
            } else if (filterLabel === 'Grocery Stores') {
              setPlaceholderImage(GroceryStoresPlaceholder)
            } else if (filterLabel === 'Planetariums') {
              setPlaceholderImage(PlanetariumsPlaceholder)
            } else if (filterLabel === 'Salons') {
              setPlaceholderImage(SalonPlaceHolder)
            } else if (filterLabel === 'Zoos') {
              setPlaceholderImage(ZooPlaceholder)
            } else {
              setPlaceholderImage(logoPlaceholder)
            }

            navigation.setOptions({
              title: `Room: ${roomData.publicId}`
            })
          } else {
            const roomData = jsonParse
            console.log('json room here', roomData)
            setRoomInfo(roomData)
            setRestaurants(roomData.restaurantList)

            setFilterLabel(roomData.filter)
            AsyncStorage.setItem('Filter', roomData.filter)
            setRoomId(roomData.publicId)

            console.log('Filter', roomData.filter)
            let filterLabel = roomData.filter
            console.log('Filter label', filterLabel)
            if (filterLabel === "Restaurants") {
              setPlaceholderImage(RestaurantPlaceholder)
            } else if (filterLabel === 'Fast Food') {
              setPlaceholderImage(FastFoodPlaceholder)
            } else if (filterLabel === 'Movie Theaters') {
              setPlaceholderImage(MovieTheaterPlaceholder)
            } else if (filterLabel === 'Golf Courses') {
              setPlaceholderImage(GolfCoursesPlaceholder)
            } else if (filterLabel === 'Cafes') {
              setPlaceholderImage(CafesPlaceholder)
            } else if (filterLabel === 'Gas Stations') {
              setPlaceholderImage(GasStationsPlacholder)
            } else if (filterLabel === 'Libraries') {
              setPlaceholderImage(LibrariesPlaceholder)
            } else if (filterLabel === 'Ice Cream') {
              setPlaceholderImage(IceCreamPlaceholder)
            } else if (filterLabel === 'Dojos') {
              setPlaceholderImage(DojosPlaceholder)
            } else if (filterLabel === 'Grocery Stores') {
              setPlaceholderImage(GroceryStoresPlaceholder)
            } else if (filterLabel === 'Planetariums') {
              setPlaceholderImage(PlanetariumsPlaceholder)
            } else if (filterLabel === 'Salons') {
              setPlaceholderImage(SalonPlaceHolder)
            } else if (filterLabel === 'Zoos') {
              setPlaceholderImage(ZooPlaceholder)
            } else {
              setPlaceholderImage(logoPlaceholder)
            }

            navigation.setOptions({
              title: `Room: ${roomData.publicId}`
            })
          }          
        }

      } catch (error) {
        console.error('Error in fetching data from AsyncStorage', error)
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchRoomId()
  }, [])

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <MaterialIcons name='info-outline' size={40} style={{color: 'darkorange'}} />
        </TouchableOpacity>
      )
    })
  }, [navigation])

  useEffect(() => {
    const addSavedtoDatabase = async () => {
      setLoading(true)
      const favorites = saved
      AsyncStorage.setItem('Favorites', JSON.stringify(favorites))
      try {
        const response = await supabase.from('rooms').update({'savedFavorites': favorites}).eq('publicId', roomId).select()

        console.log('Response from favorites', response)
        if (response.status === 200) {
          console.log('Success!')
          router.push('/saved')
        } else {
          console.log('Error in saving your favorites, please try again.')
        }
      } catch (error) {
          console.log('Error', error)
      } finally {
        setLoading(false)
      }
    }
    console.log('Current index', currentIndex)
    console.log('Saved', saved)

    
    if (currentIndex === restaurants.length - 1 && currentIndex != 0) {
      //alert('end of list')
      addSavedtoDatabase()
      //router.push('/saved')
      
    }
  }, [currentIndex])

  if (loading) {
    return (
      <Text>Loading...</Text>
    )
  }

  const swipeGesture = Gesture.Pan().onEnd((event) => {
    const { translationX } = event;
  
    if (translationX < -50 && restaurantIndex.value < restaurants.length - 1) {
      restaurantIndex.value += 1;
      runOnJS(setCurrentIndex)(restaurantIndex.value);
    } 
    else if (translationX > 50 && restaurantIndex.value < restaurants.length - 1) {
      // Ensure currentIndex is valid before accessing `restaurants[currentIndex]`
      if (currentIndex < restaurants.length) {
        setSaved((prevSaved) => [...prevSaved, restaurants[currentIndex]]);
      }
      
      restaurantIndex.value += 1;
      runOnJS(setCurrentIndex)(restaurantIndex.value);
    }
  });
  
  return (
    <GestureHandlerRootView>  
      <InformationPopup title='Room Info' body='Swipe right or left through places within your location to see what you want to do. Swipe right to save the activity and swipe left to pass on the activity' modalVisible={modalVisible} setModalVisible={setModalVisible} />

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
                      <Place restaurant={restaurants[currentIndex]} placeholderImage={placeholderImage} />
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