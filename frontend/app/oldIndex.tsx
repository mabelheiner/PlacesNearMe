/*************************************
 * This file is being preserved as it 
 * works with gesture and puts most
 * of the app functionality in one page.
 * I'm going to refactor this to separate
 * into multiple pages and run with a 
 * backend server, so I want to keep this 
 * as a good fallback point.
 ************************************/

import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  Pressable,
} from "react-native";
import axios from "axios";
import Place from "./components/Place";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useDerivedValue,
  runOnJS,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

interface Restaurant {
  id: number;
  name: string;
  address: string;
  lat: number;
  lon: number;
  googleMapsLink: string;
  logoUrl: string;
}

export default function Index() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0); // React state for render-safe index

  const restaurantIndex = useSharedValue(0); // SharedValue for gestures

  // Derived value to ensure `restaurantIndex` is clamped and update `currentIndex` when it changes
  const clampedIndex = useDerivedValue(() => {
    const clamped = Math.min(
      Math.max(restaurantIndex.value, 0),
      restaurants.length - 1
    );

    // Update the React state safely with `runOnJS`
    runOnJS(setCurrentIndex)(clamped);

    return clamped;
  });

  const generateGoogleMapsLink = (name: string, lat: number, lon: number) => {
    const formattedName = encodeURIComponent(name);
    return `https://www.google.com/maps/search/${formattedName}/@${lat},${lon},17z`;
  };

  const fetchRestaurants = async () => {
    setLoading(true);
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

      setRestaurants(formattedData);
      restaurantIndex.value = 0; // Reset index when new data is fetched
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    } finally {
      setLoading(false);
    }
  };

  const swipeGesture = Gesture.Pan().onEnd((event) => {
    const { translationX } = event;

    if (
      translationX < -50 &&
      restaurantIndex.value < restaurants.length - 1
    ) {
      restaurantIndex.value += 1;
    } else if (translationX > 50 && restaurantIndex.value > 0) {
      restaurantIndex.value -= 1;
    }
  });

  const decrementIndex = () => {
    restaurantIndex.value = Math.max(restaurantIndex.value - 1, 0);
  };

  const incrementIndex = () => {
    restaurantIndex.value = Math.min(
      restaurantIndex.value + 1,
      restaurants.length - 1
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.textInput}
        placeholder="City to Search"
        value={city}
        onChangeText={setCity}
      />
      <TextInput
        style={styles.textInput}
        placeholder="State to Search"
        value={state}
        onChangeText={setState}
      />
      <Button title="Fetch Restaurants" onPress={fetchRestaurants} />
      {loading ? (
        <Text>Loading...</Text>
      ) : restaurants.length === 0 ? (
        <Text>No restaurants found.</Text>
      ) : (
        <GestureHandlerRootView>
          <GestureDetector gesture={swipeGesture}>
            <Animated.View style={styles.restaurantView}>
              <Pressable
                style={styles.restaurantButtons}
                onPress={decrementIndex}
              >
                <Text>-</Text>
              </Pressable>
              {restaurants.length > 0 &&
              currentIndex >= 0 &&
              currentIndex < restaurants.length ? (
                <>
                  <Text style={{position: 'absolute', top: 0, right: 0}}>{currentIndex + 1}/{restaurants.length}</Text>
                  <Place restaurant={restaurants[currentIndex]} />
                </>                
              ) : (
                <Text>
                  No restaurants to display. Please change your area of search.
                </Text>
              )}
              <Pressable
                style={styles.restaurantButtons}
                onPress={incrementIndex}
              >
                <Text>+</Text>
              </Pressable>
            </Animated.View>
          </GestureDetector>
        </GestureHandlerRootView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 50 },
  textInput: {
    fontSize: 14,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
  },
  restaurantView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  restaurantButtons: {
    padding: 10,
    margin: 10,
    backgroundColor: "#ddd",
    borderRadius: 5,
  },
});
