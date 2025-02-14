import { StyleSheet, Text, View, FlatList, ActivityIndicator, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Place from './components/Place';
import globalStyles from './globalStyles/globalStyles';
import { useRouter } from 'expo-router';

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

const Saved = () => {
    const [favorites, setFavorites] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState<string | null>(null);
    const [placeholderImage, setPlaceholderImage] = useState(logoPlaceholder);

    const router = useRouter()

    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            try {
                const response = await AsyncStorage.getItem('Favorites');
                const filterResponse = await AsyncStorage.getItem('Filter');

                if (response) {
                    setFavorites(JSON.parse(response));
                }

                if (filterResponse) {
                    const filterLabel = JSON.parse(filterResponse);
                    console.log('Filter', filterLabel)
                    setFilter(filterLabel);
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
                }
            } catch (error) {
                console.error('Error fetching favorites:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    const renderPlace = ({ item }: { item: Restaurant }) => (
        <View style={styles.restaurantCard}>
            <Place restaurant={item} placeholderImage={placeholderImage} />
        </View>
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : (
                <View style={{flex: 1}}>
                    <Text style={globalStyles.title}>Your Saved Places</Text>
                    <FlatList 
                        data={favorites}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderPlace}
                        ListEmptyComponent={<Text>No places were saved.</Text>}
                    />
                    <Pressable style={globalStyles.button} onPress={() => router.push('/groupResults')}><Text style={globalStyles.buttonText}>See Group Results</Text></Pressable>
                </View>
            )}
        </View>
    );
};

export default Saved;

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
