export const TMDB_CONFIG = {
  BASE_URL: "https://api.themoviedb.org/3",
  API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`,
  },
};

export const fetchTVDetails = async (id: string) => {
  const res = await fetch(`${TMDB_CONFIG.BASE_URL}/tv/${id}`, {
    headers: TMDB_CONFIG.headers,
  });
  const data = await res.json();
  return data;
};


export const fetchMovies = async ({
  query,
  idgenre
}: {
  query?: string;
  idgenre?: Number
}): Promise<Movie[]> => {
  let endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;
  if (idgenre) {
    endpoint = `${TMDB_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc&with_genres=${idgenre}`;
  }

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results;
};

export const fetchMovieDetails = async (
  movieId: string
): Promise<MovieDetails> => {
  try {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`,
      {
        method: "GET",
        headers: TMDB_CONFIG.headers,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch movie details: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    throw error;
  }
};

export const fetchTrendingMovies = async (): Promise<Movie[]> => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/trending/movie/week`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch trending movies: ${response.statusText}`);
  }

  const data = await response.json();

  // retourne uniquement les 10 premiers
  return data.results.slice(0, 10);
};


export const fetchTVShows = async ({
  query,
  idgenre,
}: {
  query?: string;
  idgenre?: number;
}): Promise<TVShow[]> => {
  let endpoint = query
    ? `${TMDB_CONFIG.BASE_URL}/search/tv?query=${encodeURIComponent(query)}`
    : `${TMDB_CONFIG.BASE_URL}/discover/tv?sort_by=popularity.desc`;

  if (idgenre) {
    endpoint = `${TMDB_CONFIG.BASE_URL}/discover/tv?sort_by=popularity.desc&with_genres=${idgenre}`;
  }

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch TV shows: ${response.statusText}`);
  }

  const data = await response.json();
  return data.results;
};

export const fetchTrendingTVShows = async (): Promise<TVShow[]> => {
  const endpoint = `${TMDB_CONFIG.BASE_URL}/trending/tv/week`;

  const response = await fetch(endpoint, {
    method: "GET",
    headers: TMDB_CONFIG.headers,
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch trending TV shows: ${response.statusText}`);
  }

  const data = await response.json();

  // retourne uniquement les 10 premiers
  return data.results.slice(0, 10);
};
