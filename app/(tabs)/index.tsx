import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import useFetch from "@/services/usefetch";
import { fetchMovies, fetchTrendingMovies, fetchTVShows } from "@/services/api";
import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";
import TVShowCard from "@/components/TVShowCard"; // À créer, similaire à MovieCard
import { icons } from "@/constants/icons";

const Index = () => {
  const router = useRouter();
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);

  // Films
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  const {
    data: moviesTrending,
    loading: moviesTrendingLoading,
    error: moviesTrendingError,
  } = useFetch(() => fetchTrendingMovies());

  // TV Shows
  const {
    data: tvShows,
    loading: tvShowsLoading,
    error: tvShowsError,
  } = useFetch(() => fetchTVShows({ query: "" }));

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        try {
          const userData = await AsyncStorage.getItem("userProfile");
          if (userData) setUser(JSON.parse(userData));
          else setUser(null);
        } catch (err) {
          console.error("Failed to load user info", err);
        }
      };
      loadUser();
    }, [])
  );

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("userProfile");
        if (userData) {
          const parsed = JSON.parse(userData);
          setUser(parsed);
        }
      } catch (err) {
        console.error("Failed to load user info", err);
      }
    };
    loadUser();
  }, []);

  const isLoading = moviesLoading || moviesTrendingLoading || tvShowsLoading;
  const isError = moviesError || moviesTrendingError || tvShowsError;

  return (
    <View className="flex-1 bg-primary">
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        {/* 👋 Greeting Header */}
        {user && (
          <View className="flex-row justify-between items-center mt-10 mb-4">
            <View className="flex-row items-center">
              <Text className="text-white text-lg mr-1">Hello 👋</Text>
              <Text className="text-white text-xl font-bold">
                {user.firstName} {user.lastName}
              </Text>
            </View>
          </View>
        )}

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : isError ? (
          <Text>Error: {moviesError?.message || moviesTrendingError?.message || tvShowsError?.message}</Text>
        ) : (
          <View className="flex-1 mt-2">
            {/* Trending Movies */}
            {moviesTrending && (
              <View className="mt-2">
                <Text className="text-2xl text-white font-bold mt-5 mb-3">
                  Trending Movies
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  className="mb-4 mt-3"
                  data={moviesTrending}
                  contentContainerStyle={{
                    gap: 26,
                  }}
                  renderItem={({ item, index }) => (
                    <TrendingCard {...item} index={index} />
                  )}
                />
              </View>
            )}

            {/* Latest Movies */}
            <Text className="text-2xl text-white font-bold mt-5 mb-3">
              Latest Movies
            </Text>

            <FlatList
              data={movies}
              renderItem={({ item }) => <MovieCard {...item} />}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "flex-start",
                gap: 20,
                paddingRight: 5,
                marginBottom: 10,
              }}
              className="mt-2 pb-32"
              scrollEnabled={false}
            />

            {/* Latest TV Shows */}
            <Text className="text-2xl text-white font-bold mt-5 mb-3">
              Latest TV Shows
            </Text>

            <FlatList
              data={tvShows}
              renderItem={({ item }) => <TVShowCard {...item} />}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: "flex-start",
                gap: 20,
                paddingRight: 5,
                marginBottom: 10,
              }}
              className="mt-2 pb-32"
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Index;
