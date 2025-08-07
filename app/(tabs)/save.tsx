// import {
//   View,
//   Text,
//   ActivityIndicator,
//   ScrollView,
//   FlatList,
// } from "react-native";
// import { useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// import MovieCard from "@/components/MovieCard";
// import { fetchMovieDetails } from "@/services/api";

// const STORAGE_KEY = "@savedMovies";

// const Save = () => {
//   const [savedMovies, setSavedMovies] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadSavedMovies = async () => {
//       try {
//         const stored = await AsyncStorage.getItem(STORAGE_KEY);
//         const ids: string[] = stored ? JSON.parse(stored) : [];

//         const moviePromises = ids.map((id) => fetchMovieDetails(id));
//         const movies = await Promise.all(moviePromises);

//         setSavedMovies(movies);
//       } catch (error) {
//         console.error("Failed to load saved movies:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadSavedMovies();
//   }, []);

//   return (
//     <View className="flex-1 bg-primary">
//       <ScrollView
//         className="flex-1 mt-6 px-5"
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
//       >
//         <View className="flex-1">
//           <Text className="text-2xl text-white font-bold mt-10 mb-3">
//             Saved Movies
//           </Text>

//           {loading ? (
//             <ActivityIndicator size="large" color="#fff" />
//           ) : savedMovies.length === 0 ? (
//             <Text className="text-light-200 text-base mt-4">
//               No movies saved yet.
//             </Text>
//           ) : (
//             <FlatList
//               data={savedMovies}
//               renderItem={({ item }) => <MovieCard {...item} />}
//               keyExtractor={(item) => item.id.toString()}
//               numColumns={3}
//               columnWrapperStyle={{
//                 justifyContent: "flex-start",
//                 gap: 20,
//                 paddingRight: 5,
//                 marginBottom: 10,
//               }}
//               className="pb-32 mt-5"
//               scrollEnabled={false}
//             />
//           )}
//         </View>
//       </ScrollView>
//     </View>
//   );
// };

// export default Save;

import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Image,
} from "react-native";
import { useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

import MovieCard from "@/components/MovieCard";
import { fetchMovieDetails } from "@/services/api";
import { icons } from "@/constants/icons";

const STORAGE_KEY = "@savedMovies";

const Save = () => {
  const [savedMovies, setSavedMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSavedMovies = async () => {
    try {
      setLoading(true);
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const ids: string[] = stored ? JSON.parse(stored) : [];

      const moviePromises = ids.map((id) => fetchMovieDetails(id));
      const movies = await Promise.all(moviePromises);

      setSavedMovies(movies);
    } catch (error) {
      console.error("Failed to load saved movies:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSavedMovies();
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView className="bg-primary flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  if (savedMovies.length === 0) {
    return (
      <SafeAreaView className="bg-primary flex-1 px-10">
        <View className="flex justify-center items-center flex-1 flex-col gap-5">
          <Image source={icons.save} className="size-10" tintColor="#fff" />
          <Text className="text-gray-500 text-base">No Save Movies</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-primary">
      <ScrollView
        className="flex-1 mt-6 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <View className="flex-1">
          <Text className="text-2xl text-white font-bold mt-10 mb-3">
            Saved Movies
          </Text>

          <FlatList
            data={savedMovies}
            renderItem={({ item }) => <MovieCard {...item} />}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "flex-start",
              gap: 20,
              paddingRight: 5,
              marginBottom: 10,
            }}
            className="pb-32 mt-5"
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Save;
