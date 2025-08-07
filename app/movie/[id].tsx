import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useEffect, useState } from "react";

import { icons } from "@/constants/icons";
import useFetch from "@/services/usefetch";
import { fetchMovieDetails } from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const STORAGE_KEY = "@savedMovies";

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [saved, setSaved] = useState(false);

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );

  // Load saved state on mount
  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const savedMovies = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = savedMovies ? JSON.parse(savedMovies) : [];
        setSaved(parsed.includes(id));
      } catch (err) {
        console.error("Failed to load saved movies:", err);
      }
    };
    checkSavedStatus();
  }, [id]);

  // Toggle save/unsave
  const handleSaveToggle = async () => {
    try {
      const savedMovies = await AsyncStorage.getItem(STORAGE_KEY);
      let parsed: string[] = savedMovies ? JSON.parse(savedMovies) : [];

      if (parsed.includes(id as string)) {
        parsed = parsed.filter((movieId) => movieId !== id);
        setSaved(false);
        Alert.alert("Removed from Saved", "Movie has been removed from your saved list.");
      } else {
        parsed.push(id as string);
        setSaved(true);
        Alert.alert("Added to Saved", "Movie has been added to your saved list.");
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch (err) {
      console.error("Failed to update saved movies:", err);
    }
  };

  if (loading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View>
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-[550px]"
            resizeMode="stretch"
          />

          <TouchableOpacity className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center">
            <Image
              source={icons.play}
              className="w-6 h-7 ml-1"
              resizeMode="stretch"
            />
          </TouchableOpacity>
        </View>

        <View className="flex-col items-start justify-center mt-5 px-5">
          <View className="flex-row justify-between items-center w-full">
            <Text className="text-white font-bold text-xl flex-1">
              {movie?.title}
            </Text>

            <TouchableOpacity
              onPress={handleSaveToggle}
              className={`ml-2 rounded-full p-2 border ${
                saved ? "bg-white border-black" : "bg-transparent border-white"
              }`}
            >
              <Feather
                name="bookmark"
                size={20}
                color={saved ? "black" : "white"}
              />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>
            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(
                (movie?.revenue ?? 0) / 1_000_000
              )} million`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />
        </View>

        <TouchableOpacity
          className="mt-6 mr-7 ml-7 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
          onPress={router.back}
        >
          <Image
            source={icons.arrow}
            className="size-5 mr-1 mt-0.5 rotate-180"
            tintColor="#fff"
          />
          <Text className="text-white font-semibold text-base">Go Back</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Details;
