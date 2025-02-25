import { StyleSheet, Text, View, FlatList, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Place from './components/Place';
import globalStyles from './globalStyles/globalStyles';
import { useRouter } from 'expo-router';
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
  id: number;
  name: string;
  address: string;
  lat: number;
  lon: number;
  googleMapsLink: string;
  logoUrl: string;
}

const GroupResults = () => {
  const [roomInfo, setRoomInfo] = useState<{ restaurants: Restaurant[] } | null>(null);
  const [groupFavorites, setGroupFavorites] = useState<Restaurant[]>([])
  const [placeholderImage, setPlaceholderImage] = useState(logoPlaceholder)
  const router = useRouter()

  useEffect(() => {
    const fetchRoomInfo = async () => {
      try {
        const storedRoom = await AsyncStorage.getItem('Room');

        if (storedRoom) {
          const roomData = JSON.parse(storedRoom);
          const roomId = roomData.publicId;
          console.log('Room ID:', roomId);

          /* const response = await axios.get(`https://placesnearme.onrender.com/rooms/${roomId}`); */
          const response = await supabase.from('rooms').select('*').eq('publicId', roomId)
          console.log('Response from supabase', response)
          if (response.status === 200 && response?.data) {
            console.log('Setting room info', response.data[0])
            const room = response.data[0];
            setRoomInfo(room);
            setGroupFavorites(room.savedFavorites)

            let filterLabel = room.filter
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

            // Store the parsed room data instead of a string
            await AsyncStorage.setItem('Room', JSON.stringify(room));
            
          }
        }
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };

    fetchRoomInfo(); 
  }, []); 

  const renderPlace = ({ item }: { item: Restaurant }) => (
    <View style={styles.restaurantCard}>
        <Place restaurant={item} placeholderImage={placeholderImage} />
    </View>
);

  return (
    <View style={styles.container}>
      {groupFavorites ? (
        <View style={{flex: 1}}>
          <Text style={globalStyles.title}>Group Results</Text>
          <FlatList 
              data={groupFavorites}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderPlace}
              ListEmptyComponent={<Text>No places were saved.</Text>}
              contentContainerStyle={{flexGrow: 1}}
          />
          <Pressable style={globalStyles.button} onPress={() => router.push('/')}><Text style={globalStyles.buttonText}>Back to Home</Text></Pressable>
        </View>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default GroupResults;

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
  },
  restaurantCard: {
      padding: 16,
      marginVertical: 8,
      backgroundColor: '#f9f9f9',
      borderRadius: 8,
  }
});
