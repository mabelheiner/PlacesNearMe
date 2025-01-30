import { StyleSheet, Text, View, Image, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const logoPlaceholder = require("../assets/images/logoPlaceholder.jpg");

interface Restaurant {
  id: number;
  name: string;
  address: string;
  lat: number;
  lon: number;
  googleMapsLink: string;
  logoUrl: string; // Logo URL is required
}

interface PlaceProps {
  restaurant: Restaurant;
}

const Place: React.FC<PlaceProps> = ({ restaurant }) => {
  const [imageSource, setImageSource] = useState<any>(logoPlaceholder); // Default to the local placeholder

  useEffect(() => {
    // If the logoUrl is provided and valid, use it. Otherwise, fetch the logo from the API or use placeholder.
    if (restaurant.logoUrl && restaurant.logoUrl.trim() !== "") {
      setImageSource({ uri: restaurant.logoUrl });
    } else {
      fetchLogo(restaurant.name); // Fetch logo if it's not available
    }
    //console.log('Restaurant received', restaurant);
  }, [restaurant]);

  if (!restaurant) {
    return <Text>No restuarant data.</Text>
  } else {
    //console.log('Restaurant', restaurant)
  }

  const fetchLogo = async (website: string) => {
    website = website.trim().replace(/'/g, "").replace(/\s+/g, '').toLowerCase();
    //console.log('Website after cleaning:', website);
  
    try {
      const response = await fetch(`https://api.kickfire.com/logo?website=${website}.com`);
      //console.log('Fetch url', `https://api.kickfire.com/logo?website=${website}.com`);

      //console.log('response', response)
      
      if (response.status === 200) {
        setImageSource({uri: response.url})
        return
      } else {
        setImageSource(logoPlaceholder)
        return
      }
    } catch (error) {
      console.error('Error fetching logo:', error);
    }
  };
  
  

  const handleImageError = () => {
    //console.log(`Failed to load image: ${restaurant.logoUrl}, falling back to placeholder`);
    setImageSource(logoPlaceholder); // Fallback to placeholder on error
  };

  return (
    <View style={{flex: 1}}>
      <Text style={styles.restaurantName}>
        {restaurant.name}
      </Text>
      <Image
        source={imageSource}
        style={styles.image}
        onError={handleImageError}
      />   
      {/* {restaurant.address !== "No street address available" && (
        <Text
          style={{ color: "blue" }}
          onPress={() => Linking.openURL(restaurant.googleMapsLink)}
        >
          View on Google Maps
        </Text>
      )} */}
    </View>
  );
};

const styles = StyleSheet.create({
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  image: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginVertical: 16,
    borderRadius: 8,
  },
});

export default Place;
