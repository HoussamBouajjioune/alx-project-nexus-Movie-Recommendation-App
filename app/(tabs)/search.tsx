import { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Image,
} from "react-native";

import useFetch from "@/services/usefetch";
import { fetchMovies } from "@/services/api";

import SearchBar from "@/components/SearchBar";
import MovieDisplayCard from "@/components/MovieCard";
import Genre from "@/components/Genre";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [genreQuery, setGenreQuery] = useState(0);
  const [displayedMovies, setDisplayedMovies] = useState<Movie[]>([]);

  const {
    data: searchMovies = [],
    loading: loadingSearch,
    error: errorSearch,
    refetch: refetchSearch,
    reset: resetSearch,
  } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  const {
    data: genreMovies = [],
    loading: loadingGenre,
    error: errorGenre,
    refetch: refetchGenre,
    reset: resetGenre,
  } = useFetch(() => fetchMovies({ idgenre: genreQuery }), false);

  const isLoading = loadingSearch || loadingGenre;
  const error = errorSearch || errorGenre;

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setGenreQuery(0); // Clear genre when searching
  };

  const handleGenreSelect = (id: number) => {
    setGenreQuery(id);
    setSearchQuery(""); // Clear search when selecting genre
  };

  // Effect: Fetch on search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        refetchSearch();
      } else {
        resetSearch();
      }
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Effect: Fetch on genre selection
  useEffect(() => {
    if (genreQuery > 0) {
      refetchGenre();
    } else {
      resetGenre();
    }
  }, [genreQuery]);

  // Effect: Determine which list to display
  useEffect(() => {
    if (searchQuery.trim()) {
      setDisplayedMovies(Array.isArray(searchMovies) ? searchMovies : []);
    } else if (genreQuery > 0) {
      setDisplayedMovies(Array.isArray(genreMovies) ? genreMovies : []);
    } else {
      setDisplayedMovies([]);
    }
  }, [searchMovies, genreMovies, searchQuery, genreQuery]);

  return (
    <View className="flex-1 bg-primary">

      <FlatList
        className="px-5"
        data={displayedMovies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <MovieDisplayCard {...item} />}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "flex-start",
          gap: 16,
          marginVertical: 16,
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            <Text className="text-2xl text-white font-bold mt-10">
              Search Movies
            </Text>

            <View className="mt-5 mb-5">
              <SearchBar
                placeholder="Search for a movie"
                value={searchQuery}
                onChangeText={handleSearch}
              />
            </View>

            {/* OR Divider */}
            <View className="flex-row items-center my-3">
              <View className="flex-1 h-px bg-gray-400" />
              <Text className="text-gray-400 mx-3">or</Text>
              <View className="flex-1 h-px bg-gray-400" />
            </View>

            <Genre onSelect={handleGenreSelect} />

            {isLoading && (
              <ActivityIndicator
                size="large"
                color="#0000ff"
                className="my-3"
              />
            )}

            {error && (
              <Text className="text-red-500 px-5 my-3">
                Error: {error.message}
              </Text>
            )}

            {!isLoading &&
              !error &&
              displayedMovies.length > 0 &&
              (searchQuery.trim() || genreQuery > 0) && (
                <Text className="text-xl text-white font-bold mb-2">
                  {searchQuery.trim()
                    ? `Search Results for "${searchQuery}"`
                    : `Movies in Selected Genre`}
                </Text>
              )}
          </>
        }
        ListEmptyComponent={
          !isLoading && !error ? (
            <View className="mt-10 px-5">
              <Text className="text-center text-gray-500">
                {searchQuery.trim() || genreQuery > 0
                  ? "No movies found"
                  : "Start typing to search or choose a genre"}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default Search;
