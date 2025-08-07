import { Link } from "expo-router";
import { View, Text, TouchableOpacity, Image } from "react-native";

const TrendingCard = ({
  id,
  poster_path,
  title,
  index,
}: Movie & { index: number }) => {
  return (
    <Link href={`/movie/${id}`} asChild>
      <TouchableOpacity className="w-32 relative pl-5">
        <Image
          source={{
            uri: poster_path
              ? `https://image.tmdb.org/t/p/w500${poster_path}`
              : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
          }}
          className="w-32 h-48 rounded-lg"
          resizeMode="cover"
        />

        {/* <View className="absolute bottom-5 -left-3 px-2 py-3 rounded-full"> */}
          {/* <MaskedView
            maskElement={
              <Text className="font-bold text-white text-6xl">{index + 1}</Text>
            }
          > */}
            {/* <Image
              source={images.rankingGradient}
              className="size-14"
              resizeMode="cover"
            /> */}
          {/* </MaskedView> */}
        {/* </View> */}

        <Text
          className="text-sm font-bold mt-2 text-white"
          numberOfLines={2}
        >
          {index + 1} : {title}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};

export default TrendingCard;