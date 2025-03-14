import { StyleSheet, Text, View, Image, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import supabase from '../db.mjs'

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
  placeholderImage: Image;
}

const Place: React.FC<PlaceProps> = ({ restaurant, placeholderImage }) => {
  const [imageSource, setImageSource] = useState<Image | string>(placeholderImage); // Default to the local placeholder

  useEffect(() => {
    const fetchLogo = async (website: string) => {
      website.trim().replace(/'/g, "").replace(/\s+/g, '').toLowerCase();
      //console.log('Website after cleaning:', website);
      const logoName = website.replaceAll(" ", "")
  
      try {
        const response = await supabase
        .from('logos')
        .select('logoUrl, requestCount')
        .eq('name', website)
        .single()

        //console.log('Response from logos', response)
        
        if (response?.data){
          const updatedCount = (response.data.requestCount || 0)

          await supabase.from('logos').update({requestCount: updatedCount + 1}).eq('name', website)

          if (response.data.logoUrl) {
            setImageSource(response.data.logoUrl)
          } else {
            const logoUrl = `https://logo.clearbit.com/${logoName}.com`
            //console.log(`Grabbing logo from: ${logoUrl}`)
            setImageSource(logoUrl);

            await supabase.from('logos').insert({ name: website, logoUrl: logoUrl, requestCount: 1})
          }
        } else {
            const logoUrl = `https://logo.clearbit.com/${logoName}.com`
            //console.log(`Grabbing logo from: ${logoUrl}`)
            setImageSource(logoUrl);

            await supabase.from('logos').insert({ name: website, logoUrl: logoUrl, requestCount: 1})

        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      }
    };

    
    fetchLogo(restaurant.name)
  }, [restaurant]);

  if (!restaurant) {
    return <Text>No place data.</Text>
  }   

  const handleImageError = () => {
    //console.log(`Failed to load image: ${restaurant.logoUrl}, falling back to placeholder`);
    setImageSource(placeholderImage); // Fallback to placeholder on error
  };

  return (
    <View style={{flex: 1}}>
      <Text style={styles.restaurantName}>
        {restaurant.name}
      </Text>
      <Image
        source={typeof imageSource === 'string' ? {uri: imageSource} : placeholderImage}
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
