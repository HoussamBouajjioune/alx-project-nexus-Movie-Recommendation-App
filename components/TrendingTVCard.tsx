import { Link } from "expo-router";
import { View, Text, TouchableOpacity, Image } from "react-native";

interface TrendingTVCardProps {
    id: number;
    poster_path: string | null;
    name: string;
    index: number;
}

const TrendingTVCard = ({
    id,
    poster_path,
    name,
    index,
}: TrendingTVCardProps) => {
    return (
        <Link
            href={{
                pathname: "/tv/[id]",
                params: { id: id.toString() },
            }}
            asChild
        >
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

                <Text
                    className="text-sm font-bold mt-2 text-white"
                    numberOfLines={2}
                >
                    {index + 1} : {name}
                </Text>
            </TouchableOpacity>
        </Link>
    );
};

export default TrendingTVCard;
