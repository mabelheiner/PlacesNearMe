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
import * as Location from 'expo-location'
import Checkbox from 'expo-checkbox'

const PlanetariumsPlaceholder = require('../app/assets/images/placeholders/Planetariums.png')
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
  const [searchOpen, setSearchOpen] = useState(false)
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
  const [filterIndex, setFilterIndex] = useState(0)
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
  const [placeholderImage, setPlaceholderImage] = useState(logoPlaceholder);
  const placeholderImages : Record<string, string> = {
    "Restaurants" : RestaurantPlaceholder,
    "Fast Food" : FastFoodPlaceholder,
    "Movie Theaters" : MovieTheaterPlaceholder,
    "Golf Courses" : GolfCoursesPlaceholder,
    "Cafes" : CafesPlaceholder,
    "Gas Stations" : GasStationsPlacholder,
    "Ice Cream" : IceCreamPlaceholder,
    "Dojos" : DojosPlaceholder,
    "Grocery Stores" : GroceryStoresPlaceholder,
    "Planetariums" : PlanetariumsPlaceholder,
    "Salons" : SalonPlaceHolder,
    "Zoos" : ZooPlaceholder
  }
  
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])

  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [isChecked, setChecked] = useState(false)
  const [locationMessage, setLocationMessage] = useState<String | null>(null)

  const generateGoogleMapsLink = (name: string, lat: number, lon: number) => {
    const formattedName = encodeURIComponent(name);
    return `https://www.google.com/maps/search/${formattedName}/@${lat},${lon},17z`;
  };

  const configurePlaceholder = () => {
    setPlaceholderImage(placeholderImages[filters[filterIndex - 1]?.label] || logoPlaceholder)
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
        const { lat, lon } = data.elements[0]; 
        return {lat, lon}
      } else {
        console.error("City center not found.");
      }
    } catch (error) {
      console.error("Error fetching city center:", error);
    }
  };
  
  const fetchRestaurantsByDeviceLocation = async () => {
    setLoading(true)

    if (filter === "default") {
      alert("Please select a valid filter.")
      return
    }

    try {
      if (location != null) {
        const radiusMeters = miles * 1609.34

        const query = `
          [out:json];
          (
            node[${filter}](around:${radiusMeters}, ${location.coords.latitude}, ${location.coords.longitude});
          );
          out center;
        `;

        const url = `https://overpass.kumi.systems/api/interpreter?data=${encodeURIComponent(query)}`

        const response = await axios.get(url)
        let data = response.data.elements;

        console.log('Data from api', data)
  
      if (!data.length) {
        alert("No results found. Please adjust your search.");
        setRestaurants([])
        setLoading(false);
        return;
      }

      const uniqueRestaurants = new Map<string, Restaurant>()
  
      data.slice(0, 50).forEach((item: any) => {
        const restaurant: Restaurant = {
          id: item.id,
          name: item.tags?.name || "Unnamed",
          address: item.tags["addr:housenumber"]
            ? `${item.tags["addr:housenumber"]} ${item.tags["addr:street"]}, ${item.tags["addr:city"]}, ${item.tags["addr:state"]} ${item.tags["addr:postcode"]}`
            : "No street address available",
          lat: item.lat,
          lon: item.lon,
          googleMapsLink: generateGoogleMapsLink(item.tags?.name || "Unnamed", item.lat, item.lon),
          logoUrl: "",
        }

        if (restaurant.name === "Unnamed") return;

        const normalizeRestaurantName = restaurant.name.toLowerCase().trim()

        if (!uniqueRestaurants.has(normalizeRestaurantName)) {
          uniqueRestaurants.set(normalizeRestaurantName, restaurant)
        }
      });

      const formattedData = Array.from(uniqueRestaurants.values())
  
      await AsyncStorage.setItem("restaurants", JSON.stringify(formattedData));
  
      setRestaurants(formattedData);
      setPlaceholderImage(placeholderImages[filters[filterIndex - 1]?.label] || logoPlaceholder)

      }
    } catch (error) {
      console.error("Error fetching restaurants:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRestaurants = async () => {
    setLoading(true);
    setTimeLeft(0);
    Keyboard.dismiss();

    if (isChecked) {
      fetchRestaurantsByDeviceLocation()
      return
    }
  
    if (filter === "default" || state === "default") {
      alert("Please select a valid filter and state.");
      setLoading(false);
      return;
    }    
  
    try {
      
      const cityQuery = `
        [out:json];
        area[name="${state}"][admin_level=4]->.stateArea;
        area[name="${city.trim()}"][admin_level=8]->.cityArea;
        node(area.cityArea)["name"];
        out center;
      `;
  
      const cityResponse = await fetch(
        `https://overpass.kumi.systems/api/interpreter?data=${encodeURIComponent(cityQuery)}`
      );
      const cityData = await cityResponse.json();
  
      if (!cityData.elements.length) {
        alert("City center not found.");
        setLoading(false);
        return;
      }
  
      const { lat, lon } = cityData.elements[0];
      const radiusMeters = miles * 1609.34; // Convert miles to meters
  
      const query = `
        [out:json];
        (
          node[${filter}](around:${radiusMeters}, ${lat}, ${lon});
        );
        out center;
      `;
  
      const url = `https://overpass.kumi.systems/api/interpreter?data=${encodeURIComponent(query)}`;
  
      const response = await axios.get(url);
      let data = response.data.elements;
      //console.log('Data from api', data)
  
      if (!data.length) {
        alert("No results found. Please adjust your search.");
        setRestaurants([])
        setLoading(false);
        return;
      }

      const uniqueRestaurants = new Map<string, Restaurant>()
  
      data.slice(0, 50).forEach((item: any) => {
        const restaurant: Restaurant = {
          id: item.id,
          name: item.tags?.name || "Unnamed",
          address: item.tags["addr:housenumber"]
            ? `${item.tags["addr:housenumber"]} ${item.tags["addr:street"]}, ${item.tags["addr:city"]}, ${item.tags["addr:state"]} ${item.tags["addr:postcode"]}`
            : "No street address available",
          lat: item.lat,
          lon: item.lon,
          googleMapsLink: generateGoogleMapsLink(item.tags?.name || "Unnamed", item.lat, item.lon),
          logoUrl: "",
        }

        if (restaurant.name === "Unnamed") return;

        const normalizeRestaurantName = restaurant.name.toLowerCase().trim()

        if (!uniqueRestaurants.has(normalizeRestaurantName)) {
          uniqueRestaurants.set(normalizeRestaurantName, restaurant)
        }
      });

      const formattedData = Array.from(uniqueRestaurants.values())
  
      await AsyncStorage.setItem("restaurants", JSON.stringify(formattedData));
  
      setRestaurants(formattedData);
      setPlaceholderImage(placeholderImages[filters[filterIndex - 1]?.label] || logoPlaceholder)

    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };
  
  /* const fetchRestaurants = async () => {
    setLoading(true)
    setTimeLeft(0)
    Keyboard.dismiss()

    if (filter === "default" || state === "default") {
      alert("Please select a valid filter and state.");
      setLoading(false);
      return;
    }
    
    try {
      const response = await fetchCityCenter()
      configurePlaceholder()
      console.log('City center fetched')

      if (!response) {
        setLoading(false)
        return
      }

        const radiusMeters = miles * 1609.34; // Convert miles to meters
        //console.log('city center', cityCenter)
        //console.log('city lat', response.lat)
        //console.log('city lon', response.lon)
        //console.log('response', response)
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
          //console.log('Restaurants set as', formattedData)
        } catch (error) {
          console.error("Error fetching restaurants:", error);
        }
    } catch (error) {
      console.log('Error', error)
    } finally {
      setLoading(false)
    }    
  }; 
 */
  
  /* <View style={styles.restaurantCard}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.address}>{item.address}</Text>
        <Button title='View on Google Maps'
        onPress={() => Linking.openURL(item.googleMapsLink)}
        />
      </View> */

  const generateRoomCode = async () => {
    setLoading(true)
    console.log('filter', filterIndex)
    if (restaurants.length === 0) {
      alert('Please search for places to choose from.')
      setLoading(false)
      return
    } 
    const room = {
      publicId: Math.floor(100000 + Math.random() * 900000).toString(),
      restaurantList: restaurants,
      filter: filters[filterIndex-1].label
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
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setLocationMessage('Device location not enabled, please change this in your settings.')
        return
      }

      setChecked(true)

      /* let location = await Location.getCurrentPositionAsync({})
      setLocation(location)
      alert('Using your device\'s location.')
      console.log('Device location', location) */
    }

    getCurrentLocation()
  }, []) 

  useEffect(() => {
    console.log('Location changed', location)
    if (location != null) {
      console.log('Latitude', location.coords.latitude)
      console.log('Longitude', location.coords.longitude)
    } else {
      setChecked(false)
    }
    
  }, [location])

  useEffect(() => {
    async function getDeviceLocation() {
      setLoading(true)
      setTimeLeft(0)

      if (location == null) {
        try {
          let location = await Location.getCurrentPositionAsync({})
          console.log('location after fetch', location)
          if (location.coords.latitude !== null && location.coords.longitude !== null) {
            setLocation(location)
          }
        } catch (error) {
          alert("Error in getting the location of your device. Please check if the appropriate permissions are allowed.")
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }
    getDeviceLocation()
  }, [isChecked])

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
        <Animated.View style={styles.restaurantCard}>
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
    <SafeAreaView style={{flex: 1, backgroundColor: '#f5f5f5'}}>
      <InformationPopup title='Host Info' body='Enter the city and state in which you would like to search for fun places in. Swipe down to look through these activities and when you are happy with what is there, click "Create Room" to create a room with a unique six digit code which your friends can enter in their "Join" page to look through the same activities' modalVisible={modalVisible} setModalVisible={setModalVisible} />
      
      <GestureHandlerRootView style={{flex: 1}}>
      <Pressable style={{marginLeft: 'auto', marginRight: 20 }} onPress={() => setSearchOpen(!searchOpen)}>{searchOpen ? <Ionicons name='menu' size={36} color='#06339f' /> : <Ionicons name='close-sharp' size={36} color='#06339f' />}</Pressable>
        
        <View style={searchOpen ? styles.placesSearchViewOpen : styles.placesSearchViewClose}>
          <TextInput
          style={globalStyles.textInput}
          placeholder='City to search'
          value={city}
          onChangeText={setCity}
          autoCapitalize='words'
          />
        <Picker
          selectedValue={state}
          onValueChange={(stateValue) => setState(stateValue)}>

            <Picker.Item label='Select a state' value="default" style={{color: 'gray'}} />

            {states.map((state, index) => (
              <Picker.Item key={index} label={state} value={state} style={{color: 'black'}} />
            ))}
        </Picker>

        <View style={{marginLeft: 10, flexDirection: 'row', alignItems: 'center', marginTop: 8, marginBottom: 8}}>
          <Checkbox style={{borderRadius: 4}} color='#06339f' value={isChecked} onValueChange={setChecked} />
          <Text style={{marginLeft: 8}}>Use device location</Text>
        </View>
        {locationMessage != null && (<Text style={{color: 'red', marginLeft: 10}}>{locationMessage}</Text>)}

        
        <Picker
          selectedValue={filter}
          onValueChange={(filterValue, index) => {
            setFilter(filterValue)
            setFilterIndex(index)
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
            maximumValue={150}
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
            ListHeaderComponent={
              <Text style={globalStyles.title}>Preview of Places</Text>
            }
            ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Places within your search criteria will appear here.</Text>}
            />
            <Pressable 
          style={globalStyles.button}
          onPress={generateRoomCode}>
          <Text style={globalStyles.buttonText}>
              Create Room
          </Text>
        </Pressable>
          </GestureHandlerRootView>
          
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
    justifyContent: 'center',
    alignItems: 'center',
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
    display: 'none'
  },
  placesSearchViewClose: {
  }
})
