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
import TVShowCard from "@/components/TVShowCard";
import { fetchMovieDetails, fetchTVDetails } from "@/services/api";
import { icons } from "@/constants/icons";

const STORAGE_MOVIE = "@savedMovies";
const STORAGE_TV = "@savedTV";

const Save = () => {
  const [savedMovies, setSavedMovies] = useState<any[]>([]);
  const [savedTV, setSavedTV] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadSavedItems = async () => {
    try {
      setLoading(true);

      const [movieIDsRaw, tvIDsRaw] = await Promise.all([
        AsyncStorage.getItem(STORAGE_MOVIE),
        AsyncStorage.getItem(STORAGE_TV),
      ]);

      const movieIDs: string[] = movieIDsRaw ? JSON.parse(movieIDsRaw) : [];
      const tvIDs: string[] = tvIDsRaw ? JSON.parse(tvIDsRaw) : [];

      const movieResults = await Promise.allSettled(
        movieIDs.map((id) => fetchMovieDetails(id))
      );
      
      const tvResults = await Promise.allSettled(
        tvIDs.map((id) => fetchTVDetails(id))
      );

      const movies = movieResults
        .filter((r) => r.status === "fulfilled")
        .map((r: any) => r.value);
      const tvs = tvResults
        .filter((r) => r.status === "fulfilled")
        .map((r: any) => r.value);

      setSavedMovies(movies);
      setSavedTV(tvs);
    } catch (error) {
      console.error("Failed to load saved items:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => {
    loadSavedItems();
  }, []));

  if (loading) {
    return (
      <SafeAreaView className="bg-primary flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  if (savedMovies.length === 0 && savedTV.length === 0) {
    return (
      <SafeAreaView className="bg-primary flex-1 px-10">
        <View className="flex justify-center items-center flex-1 flex-col gap-5">
          <Image source={icons.save} className="size-10" tintColor="#fff" />
          <Text className="text-gray-500 text-base">No Saved Movies or TV Shows</Text>
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
        {savedMovies.length > 0 && (
          <View className="flex-1 mb-6">
            <Text className="text-2xl text-white font-bold mt-10 mb-3">
              Saved Movies
            </Text>
            <FlatList
              data={savedMovies}
              renderItem={({ item }) => <MovieCard {...item} />}
              keyExtractor={(item) => `movie-${item.id}`}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "flex-start",
                gap: 20,
                paddingRight: 5,
                marginBottom: 10,
              }}
              scrollEnabled={false}
            />
          </View>
        )}

        {savedTV.length > 0 && (
          <View className="flex-1 mb-6">
            <Text className="text-2xl text-white font-bold mt-10 mb-3">
              Saved TV Shows
            </Text>
            <FlatList
              data={savedTV}
              renderItem={({ item }) => <TVShowCard {...item} />}
              keyExtractor={(item) => `tv-${item.id}`}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "flex-start",
                gap: 20,
                paddingRight: 5,
                marginBottom: 10,
              }}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Save;
