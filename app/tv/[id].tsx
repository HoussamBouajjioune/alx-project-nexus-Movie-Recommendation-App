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
import { fetchTVDetails } from "@/services/api"; // 🔁 use TV API
import AsyncStorage from "@react-native-async-storage/async-storage";

interface InfoProps {
  label: string;
  value?: string | number | null;
}

const STORAGE_KEY = "@savedTV";

const TVInfo = ({ label, value }: InfoProps) => (
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

  const { data: tv, loading } = useFetch(() =>
    fetchTVDetails(id as string)
  );

  useEffect(() => {
    const checkSaved = async () => {
      try {
        const savedList = await AsyncStorage.getItem(STORAGE_KEY);
        const parsed = savedList ? JSON.parse(savedList) : [];
        setSaved(parsed.includes(id));
      } catch (err) {
        console.error("Error loading saved TV shows", err);
      }
    };
    checkSaved();
  }, [id]);

  const toggleSave = async () => {
    try {
      const savedList = await AsyncStorage.getItem(STORAGE_KEY);
      let parsed: string[] = savedList ? JSON.parse(savedList) : [];

      if (parsed.includes(id as string)) {
        parsed = parsed.filter((tvId) => tvId !== id);
        setSaved(false);
        Alert.alert("Removed", "TV show removed from your saved list.");
      } else {
        parsed.push(id as string);
        setSaved(true);
        Alert.alert("Saved", "TV show added to your saved list.");
      }

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    } catch (err) {
      console.error("Error updating saved TV shows", err);
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
              uri: `https://image.tmdb.org/t/p/w500${tv?.poster_path}`,
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
              {tv?.name}
            </Text>

            <TouchableOpacity
              onPress={toggleSave}
              className={`ml-2 rounded-full p-2 border ${saved ? "bg-white border-black" : "bg-transparent border-white"
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
              {tv?.first_air_date?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">
              {tv?.episode_run_time?.[0] || "?"}m
            </Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />
            <Text className="text-white font-bold text-sm">
              {Math.round(tv?.vote_average ?? 0)}/10
            </Text>
            <Text className="text-light-200 text-sm">
              ({tv?.vote_count} votes)
            </Text>
          </View>

          <TVInfo label="Overview" value={tv?.overview} />
          <TVInfo
            label="Genres"
            value={
              tv?.genres?.map((g: { name: string }) => g.name).join(" • ") || "N/A"
            }
          />

          <View className="flex flex-row justify-between w-1/2">
            <TVInfo label="Seasons" value={tv?.number_of_seasons} />
            <TVInfo label="Episodes" value={tv?.number_of_episodes} />
          </View>

          <TVInfo
            label="Production Companies"
            value={
              tv?.production_companies?.map((c: { name: string }) => c.name).join(" • ") || "N/A"
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
