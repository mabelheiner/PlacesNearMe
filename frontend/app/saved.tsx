import { StyleSheet, Text, View, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Place from './components/Place';

const placeholders: Record<string, any> = {
    "Restaurants": require('../app/assets/images/placeholders/Restaurant.png'),
    "Fast Food": require('../app/assets/images/placeholders/Fast Food.png'),
    "Movie Theaters": require('../app/assets/images/placeholders/Movie Theater.png'),
    "Golf Courses": require('../app/assets/images/placeholders/Golf Courses.png'),
    "Cafes": require('../app/assets/images/placeholders/Cafes.png'),
    "Gas Stations": require('../app/assets/images/placeholders/Gas Stations.png'),
    "Libraries": require('../app/assets/images/placeholders/Libraries.png'),
    "Ice Cream": require('../app/assets/images/placeholders/Ice Cream.png'),
    "Dojos": require('../app/assets/images/placeholders/Dojos.png'),
    "Grocery Stores": require('../app/assets/images/placeholders/Grocery Stores.png'),
    "Planetariums": require('../app/assets/images/placeholders/Planetariums.png'),
    "Salons": require('../app/assets/images/placeholders/Salons.png'),
    "Zoos": require('../app/assets/images/placeholders/Zoos.png'),
};

const logoPlaceholder = require('../app/assets/images/placeholders/logoPlaceholder.jpg');

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
                    setFilter(filterLabel);
                    setPlaceholderImage(placeholders[filterLabel] || logoPlaceholder);
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
        <Place restaurant={item} placeholderImage={placeholderImage} />
    );

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="blue" />
            ) : (
                <FlatList 
                    data={favorites}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderPlace}
                    ListEmptyComponent={<Text>No places were saved.</Text>}
                />
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
});
