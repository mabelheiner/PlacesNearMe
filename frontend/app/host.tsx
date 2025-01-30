import { StyleSheet, Text, View, TextInput, Linking, Button, ActivityIndicator, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import globalStyles from './globalStyles/globalStyles'
import RNPickerSelect from 'react-native-picker-select'
import axios from 'axios'
import { FlatList, GestureHandlerRootView, Pressable } from 'react-native-gesture-handler'
import Place from './components/Place'
import { Link, useNavigation, useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

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
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
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

  const [loading, setLoading] = useState(false)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])

  const generateGoogleMapsLink = (name: string, lat: number, lon: number) => {
    const formattedName = encodeURIComponent(name);
    return `https://www.google.com/maps/search/${formattedName}/@${lat},${lon},17z`;
  };

  const fetchRestaurants = async () => {
    setLoading(true)
    Keyboard.dismiss()

    const query = `
      [out:json];
      area[name="${state}"][admin_level=4]->.stateArea;
      area[name="${city}"][admin_level=8]->.cityArea;
      nwr["amenity"="fast_food"](area.cityArea)(area.stateArea);
      out geom;
    `;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(
      query
    )}`;

    try {
      const response = await axios.get(url);
      const data = response.data.elements;

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
    } finally {
      setLoading(false);
    }
  };

  /* <View style={styles.restaurantCard}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.address}>{item.address}</Text>
        <Button title='View on Google Maps'
        onPress={() => Linking.openURL(item.googleMapsLink)}
        />
      </View> */

  const renderRestaurant = ({ item }: { item: Restaurant }) => {
    //console.log('Item', item)
    return (
      <View style={[styles.restaurantCard, {justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}]}>
        <Place restaurant={item} />
      </View>      
  )}

  const generateRoomCode = async () => {
    const room = {
      publicId: Math.floor(100000 + Math.random() * 900000).toString(),
      restaurantList: restaurants
    }
    //console.log('Room', room)

    try {
      const response = await axios.post('https://placesnearme.onrender.com/rooms/', room)
      //console.log('Response', response)
      //console.log('Response status', response.status === 201) 
      if (response.status === 201) {
        //console.log('New Room', response.data.room)
        AsyncStorage.setItem('Room', JSON.stringify(response.data.room))
        router.push('/room') 
      }
    } catch (error) {
      console.log('Error', error)
    } 
  }
  
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <GestureHandlerRootView style={{ flex: 1}}>
      <TextInput
        style={globalStyles.textInput}
        placeholder='City to Search'
        value={city}
        onChangeText={setCity}
      />
      <RNPickerSelect
          onValueChange={(value) => setState(value)}
          placeholder={{
            label: 'State to Search',
            value: null
          }}
          items={states.map((state) => ({
            label: state, 
            value: state
          }))}
      />
      <Pressable 
        style={globalStyles.button}
        onPress={fetchRestaurants}
        >
        <Text style={globalStyles.buttonText}>Fetch Places</Text>
      </Pressable>
      {loading ? (
        <ActivityIndicator size="large" color="blue" />
      ): (
        <>
        <Text style={globalStyles.title}>Preview of Places</Text>
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRestaurant}
          ListEmptyComponent={<Text>No restaurants to display</Text>}
          />
        <Pressable 
          style={globalStyles.button}
          onPress={generateRoomCode}>
          <Text style={globalStyles.buttonText}>
            {/* <Link href='/room'> */}
              Create Room
            {/* </Link> */}
          </Text>
        </Pressable>
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
})