import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import useFetch from "@/services/usefetch";
import {
  fetchMovies,
  fetchTrendingMovies,
  fetchTVShows,
  fetchTrendingTVShows,
} from "@/services/api";
import MovieCard from "@/components/MovieCard";
import TrendingCard from "@/components/TrendingCard";
import TVShowCard from "@/components/TVShowCard";
import TrendingTVCard from "@/components/TrendingTVCard";

const Index = () => {
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);

  // Fetch Movies
  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() => fetchMovies({ query: "" }));

  const {
    data: trendingMovies,
    loading: trendingMoviesLoading,
    error: trendingMoviesError,
  } = useFetch(fetchTrendingMovies);

  // Fetch TV Shows
  const {
    data: tvShows,
    loading: tvShowsLoading,
    error: tvShowsError,
  } = useFetch(() => fetchTVShows({ query: "" }));

  const {
    data: trendingTV,
    loading: trendingTVLoading,
    error: trendingTVError,
  } = useFetch(fetchTrendingTVShows);

  // Load user profile from AsyncStorage
  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        try {
          const userData = await AsyncStorage.getItem("userProfile");
          setUser(userData ? JSON.parse(userData) : null);
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

  const isLoading =
    moviesLoading || trendingMoviesLoading || tvShowsLoading || trendingTVLoading;
  const isError =
    moviesError || trendingMoviesError || tvShowsError || trendingTVError;

  return (
    <View className="flex-1 bg-primary">
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        {/* 👋 Greeting */}
        {user && (
          <View className="flex-row justify-between items-center mt-16 mb-4">
            <View className="flex-row items-center">
              <Text className="text-white text-xl mr-1">Hello : </Text>
              <Text className="text-white text-xl font-bold">
                {user.firstName} {user.lastName}  👋
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
          <Text className="text-red-500">
            Error: {moviesError?.message || trendingMoviesError?.message || tvShowsError?.message || trendingTVError?.message}
          </Text>
        ) : (
          <View className="flex-1 mt-2">

            {/* Trending Movies */}
            {trendingMovies && (
              <View className="mt-2">
                <Text className="text-2xl text-white font-bold  mb-3">
                  Trending Movies
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={trendingMovies}
                  contentContainerStyle={{ gap: 26 }}
                  renderItem={({ item, index }) => (
                    <TrendingCard {...item} index={index} />
                  )}
                />
              </View>
            )}

            {/* Latest Movies */}
            {movies && (
              <>
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
                  className="mt-2 pb-10"
                  scrollEnabled={false}
                />
              </>
            )}

            {/* Trending TV Shows */}
            {trendingTV && (
              <View className="mt-5">
                <Text className="text-2xl text-white font-bold mb-3">
                  Trending TV Shows
                </Text>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={trendingTV}
                  keyExtractor={(item) => item.id.toString()}
                  contentContainerStyle={{ gap: 26 }}
                  renderItem={({ item, index }) => <TrendingTVCard {...item} index={index} />
                  }

                />
              </View>
            )}

            {/* Latest TV Shows */}
            {tvShows && (
              <>
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
              </>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Index;
