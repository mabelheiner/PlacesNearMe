import { StyleSheet, Text, View, TextInput, Linking, Button, ActivityIndicator, Pressable, Keyboard, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import globalStyles from './globalStyles/globalStyles'
import RNPickerSelect from 'react-native-picker-select'
import axios from 'axios'
import { FlatList, Gesture, GestureDetector, GestureHandlerRootView, ScrollView, } from 'react-native-gesture-handler'
import Place from './components/Place'
import { Link, useNavigation, useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MaterialIcons } from '@expo/vector-icons'
import InformationPopup from './components/InformationPopup'
import Animated, {runOnJS, Easing, useSharedValue, withRepeat, withTiming, useAnimatedStyle} from 'react-native-reanimated'
import supabase from './db.mjs'
import { Picker } from '@react-native-picker/picker'
import Slider from '@react-native-community/slider'
import { Ionicons } from '@expo/vector-icons'

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

export default function Host() {
  const router = useRouter()
  const navigation = useNavigation()
  const [modalVisible, setModalVisible] = useState(false)
  const [searchOpen, setSearchOpen] = useState(true)
  const [miles, setMiles] = useState(20)
  const radiusRef = useRef(miles)
  const [city, setCity] = useState('')
  const [cityCenter, setCityCenter] = useState({lat: 0, lon: 0})
  const [state, setState] = useState("default")
  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", 
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", 
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", 
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", 
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
    "New Hampshire", "New Jersey", "New Mexico", "New York", 
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", 
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", 
    "West Virginia", "Wisconsin", "Wyoming"
  ];

  const [filter, setFilter] = useState("default")
  const [label, setLabel] = useState('')
  const filters = [
    {
      label: 'Restaurants',
      value: '"amenity"="restaurant"',
    },
    {
      label: 'Fast Food',
      value: '"amenity"="fast_food"', 
    },
    {
      label: 'Movie Theaters',
      value: '"amenity"="cinema"',
    },
    {
      label: 'Golf Courses',
      value: '"amenity"="golf_course"', 
    },
    {
      label: 'Cafes',
      value: '"amenity"="cafe"',
    },
    {
      label: 'Gas Stations',
      value: '"amenity"="fuel"',
    },
    {
      label: 'Libraries',
      value: '"amenity"="library"',
    },
    {
      label: 'Ice Cream',
      value: '"amenity"="ice_cream"', 
    },
    {
      label: 'Dojos',
      value: '"amenity"="dojo"',
    },
    {
      label: 'Grocery Stores',
      value: '"shop"="supermarket"', 
    },
    {
      label: 'Planetariums',
      value: '"amenity"="planetarium"', 
    },
    {
      label: 'Salons',
      value: '"shop"="beauty"', 
    },
    {
      label: 'Zoos',
      value: '"tourism"="zoo"',
    }   
  ]

  const [isScrolledToEnd, setIsScrolledToEnd] = useState(false)

  const [placeholderImage, setPlaceholderImage] = useState(logoPlaceholder);
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const rotateAnim = useSharedValue(0)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])

  const generateGoogleMapsLink = (name: string, lat: number, lon: number) => {
    const formattedName = encodeURIComponent(name);
    return `https://www.google.com/maps/search/${formattedName}/@${lat},${lon},17z`;
  };

  const handleScroll = (event: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent
    const isEndReached = contentOffset.y + layoutMeasurement.height >= contentSize.height - 400
    setIsScrolledToEnd(isEndReached)
  } 

  const fetchCityCenter = async () => {
    const cityQuery = `
      [out:json];
      area[name="${state}"][admin_level=4]->.stateArea;
      area[name="${city.trim()}"][admin_level=8]->.cityArea;
      node(area.cityArea);
      out center;
    `;
  
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(cityQuery)}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.elements.length > 0) {
        const { lat, lon } = data.elements[0]; // Extract city center coordinates
        setCityCenter({ lat, lon });
        return {lat, lon}
      } else {
        console.error("City center not found.");
      }
    } catch (error) {
      console.error("Error fetching city center:", error);
    }
  };

  const fetchRestaurants = async () => {
    setLoading(true)
    setTimeLeft(0)
    Keyboard.dismiss()

    console.log('Filter', filter)
    console.log('State', state)

    if (filter == "default") {
      alert("Please select a filter from the dropdown menu.")
      setLoading(false)
      return
    } else if (state == "default") {
      alert("Please select a state from the dropdown menu.")
      setLoading(false)
      return
    }

    try {
      const response = await fetchCityCenter()

      if (response) {
        const radiusMeters = miles * 1609.34; // Convert miles to meters
        console.log('city center', cityCenter)
        console.log('city lat', response.lat)
        console.log('city lon', response.lon)
        console.log('response', response)
        const lat = response.lat
        const lon = response.lon

        const latDiff = radiusMeters / 111320;
        const lonDiff = radiusMeters / (111320 * Math.cos(lat * (Math.PI / 180)));

        const minLat = lat - latDiff;
        const maxLat = lat + latDiff;
        const minLon = lon - lonDiff;
        const maxLon = lon + lonDiff;

        const query = `
        [out:json];
        (
          nwr[${filter}]["name"](${minLat},${minLon}, ${maxLat}, ${maxLon});
        );
        out center;
        `;

        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

        try {
          const response = await axios.get(url);
          let data = response.data.elements;
          console.log('Response from api', response)
          console.log('Data from api', data)
    
          let uniquePlaces = []
          const seenPlaces = new Set()
    
          for (const item of data) {
            if (item.tags && item.tags.name && !seenPlaces.has(item.tags.name)) {
              seenPlaces.add(item.tags.name)
              uniquePlaces.push(item)
            }
          }
    
          if (uniquePlaces.length > 50) {
            data = uniquePlaces.slice(0, 50)
          } else {
            data = uniquePlaces
          }
    
          const formattedData: Restaurant[] = data.map((item: any) => {
            const addressParts: string[] = [];
            if (
              item.tags["addr:housenumber"] &&
              item.tags["addr:street"] &&
              item.tags["addr:city"] &&
              item.tags["addr:state"] &&
              item.tags["addr:postcode"]
            ) {
              addressParts.push(item.tags["addr:housenumber"]);
              addressParts.push(`${item.tags["addr:street"]},`);
              addressParts.push(item.tags["addr:city"]);
              addressParts.push(item.tags["addr:state"]);
              addressParts.push(item.tags["addr:postcode"]);
            }
    
            const address =
              addressParts.join(" ") || "No street address available";
            const googleMapsLink = generateGoogleMapsLink(
              item.tags?.name || "Unnamed",
              item.lat,
              item.lon
            );
    
            return {
              id: item.id,
              name: item.tags?.name || "Unnamed",
              address,
              lat: item.lat,
              lon: item.lon,
              googleMapsLink,
              logoUrl: "", // Placeholder for now
            };
          });
    
          await AsyncStorage.setItem('restaurants', JSON.stringify(formattedData))
    
          setRestaurants(formattedData);
          console.log('Restaurants set as', formattedData)
        } catch (error) {
          console.error("Error fetching restaurants:", error);
        }
      }
    } catch (error) {
      console.log('Error', error)
    } finally {
      setLoading(false)
    }    
  }; 

  
  /* <View style={styles.restaurantCard}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.address}>{item.address}</Text>
        <Button title='View on Google Maps'
        onPress={() => Linking.openURL(item.googleMapsLink)}
        />
      </View> */

  const generateRoomCode = async () => {
    setLoading(true)
    if (restaurants.length === 0) {
      alert('Please search for places to choose from.')
      setLoading(false)
      return
    } 
    const room = {
      publicId: Math.floor(100000 + Math.random() * 900000).toString(),
      restaurantList: restaurants,
      filter: label
    }
    console.log('Room', room)

    try {
      const response = await supabase.from('rooms').upsert({
        publicId: room.publicId,
        restaurantList: room.restaurantList,
        filter: room.filter
      }).select()

      console.log('Room response', response)

      if (response.status === 201 && response.data !== null) {
        AsyncStorage.setItem('Room', JSON.stringify(response.data[0]))
        router.push('/room')
      } 
    } catch (error) {
      console.log('Error', error)
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

  useEffect(() => {
    if (loading) {
      const timer = setInterval(() => {
        setTimeLeft(prevTime => prevTime + 1)
      }, 1000)
      return () => clearInterval(timer)
    } else {
      setTimeLeft(100)
    }
  }, [loading, timeLeft])

  const renderRestaurant = ({ item }: { item: Restaurant }) => {
    //console.log('Item', item)c
    const swipeGesture = Gesture.Pan()
    .activeOffsetX([-20, 20]) // ignore small horizontal movements
    .failOffsetY([-5, 5]) // allows vertical scrolling
    .onEnd((event) => {
      const {translationX} = event

      if (translationX < -50) {
        runOnJS(setRestaurants)(restaurants.filter((remove) => remove.name != item.name))
      }
    })

    return (
        <GestureDetector gesture={swipeGesture}>
        <Animated.View style={[styles.restaurantCard, {justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}]}>
          <Place restaurant={item} placeholderImage={placeholderImage} />
        </Animated.View>    
        </GestureDetector> 
  )}

  const handleRadiusChange = (value: number) => {
    radiusRef.current = value
  }

  const handleRadiusChangeComplete = (value: number) => {
    setMiles(radiusRef.current)
  }
  
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <InformationPopup title='Host Info' body='Enter the city and state in which you would like to search for fun places in. Swipe down to look through these activities and when you are happy with what is there, click "Create Room" to create a room with a unique six digit code which your friends can enter in their "Join" page to look through the same activities' modalVisible={modalVisible} setModalVisible={setModalVisible} />
      <GestureHandlerRootView style={{flex: 1}}>
        <View style={searchOpen ? styles.placesSearchViewOpen : styles.placesSearchViewClose}>
          <TextInput
          style={globalStyles.textInput}
          placeholder='City to search'
          value={city}
          onChangeText={setCity}
          autoCapitalize='characters'
        />
        <Picker
          selectedValue={state}
          onValueChange={(stateValue) => setState(stateValue)}>

            <Picker.Item label='Select a state' value="default" style={{color: 'gray'}} />

            {states.map((state, index) => (
              <Picker.Item key={index} label={state} value={state} style={{color: 'black'}} />
            ))}
        </Picker>
        <Picker
          selectedValue={filter}
          onValueChange={(filterValue, index) => {
            setFilter(filterValue)
            console.log('filterValue', filterValue)
            console.log('index', index)
            console.log('label in filters', filters[index - 1].label) 
            let filterLabel = filters[index - 1].label
            setLabel(filterLabel)
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
          }}>

              <Picker.Item label='Select a filter' value="default" style={{color: 'gray'}} />

              {filters.map((filter, index) => (
                <Picker.Item key={index} label={filter.label} value={filter.value} style={{color: 'black'}} />
              ))}
        </Picker>
        <View style={styles.sliderContainer}>
          <Text style={styles.sliderLabel}>Within: {miles} miles</Text>
          <Slider
            style={styles.slider}
            minimumValue={10}
            maximumValue={100}
            step={1}
            value={radiusRef.current}
            onValueChange={handleRadiusChange}
            onSlidingComplete={handleRadiusChangeComplete}
            minimumTrackTintColor='#06339F'
            maximumTrackTintColor='#ccc'
            thumbTintColor='#06339F'
          />
        </View>
        <Pressable
          style={globalStyles.button}
          onPress={fetchRestaurants}
          >
          <Text style={globalStyles.buttonText}>Fetch Places</Text>
        </Pressable>
      </View>
      <Pressable style={{marginLeft: 'auto', marginRight: 20 }} onPress={() => setSearchOpen(!searchOpen)}>{searchOpen ? <Ionicons name='chevron-up-circle-outline' size={24} color='#06339f' /> : <Ionicons name='chevron-down-circle-outline' size={24} color='#06339f' />}</Pressable>
      {loading ? (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <View style={{ width: 100, height: 100, justifyContent: 'center', alignItems: 'center', position: 'relative'}}>
            <ActivityIndicator size={60} color="blue"/>
            <Text style={{position: 'absolute', fontSize: 20, fontWeight: 'bold'}}>{timeLeft}%</Text>
          </View>
        </View>
      ): (
        <>
        <GestureHandlerRootView>
          <FlatList
            data={restaurants}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderRestaurant}
            onScroll={handleScroll}
            ListHeaderComponent={
              <Text style={globalStyles.title}>Preview of Places</Text>
            }
            ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Places within your search criteria will appear here.</Text>}
            />
          </GestureHandlerRootView>
          {/* {isScrolledToEnd && ( */}
          <Pressable 
          style={globalStyles.button}
          onPress={generateRoomCode}>
          <Text style={globalStyles.buttonText}>
            {/* <Link href='/room'> */}
              Create Room
            {/* </Link> */}
          </Text>
        </Pressable>
        {/* )} */}
        </>
      )}
      </GestureHandlerRootView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  textInput: {
    
  },
  container: {
    flex: 1,
    padding: 16,
  },
  restaurantCard: {
    padding: 16,
    marginVertical: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  address: {
    fontSize: 14,
    color: '#666',
  },
  sliderContainer: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  slider: { 
    width: "100%", 
    height: 40,
  },
  sliderLabel: { 
    textAlign: "center", 
    fontSize: 16, 
    fontWeight: "bold" 
  },
  placesSearchViewOpen: {
    flex: 1,
    marginBottom: 40
  },
  placesSearchViewClose: {
    display: 'none',    
  }
})
