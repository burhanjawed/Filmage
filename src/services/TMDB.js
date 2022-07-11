import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const tmdbApiKey = process.env.REACT_APP_TMDB_KEY;

export const tmdbApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://api.themoviedb.org/3' }),
  endpoints: (builder) => ({
    // Get Genres
    getGenres: builder.query({
      query: () => {
        return `genre/movie/list?api_key=${tmdbApiKey}`;
      },
    }),

    // Get Movies by [Type]
    getMovies: builder.query({
      query: ({ genreIdOrCategoryName, page, sort, searchQuery }) => {
        // Get movies by search
        if (searchQuery) {
          return `/search/movie?query=${searchQuery}&page=${page}&api_key=${tmdbApiKey}`;
        }

        // Get movies by category
        if (
          genreIdOrCategoryName &&
          typeof genreIdOrCategoryName === 'string'
        ) {
          return `movie/${genreIdOrCategoryName}?page=${page}&api_key=${tmdbApiKey}`;
        }

        // Get movies by genre
        if (
          genreIdOrCategoryName &&
          typeof genreIdOrCategoryName === 'number'
        ) {
          if (sort === 'popular') {
            return `discover/movie?with_genres=${genreIdOrCategoryName}&sort_by=popularity.desc&page=${page}&api_key=${tmdbApiKey}`;
          } else if (sort === 'releaseDate') {
            return `discover/movie?with_genres=${genreIdOrCategoryName}&sort_by=release_date.desc&page=${page}&api_key=${tmdbApiKey}`;
          } else if (sort === 'topRated') {
            return `discover/movie?with_genres=${genreIdOrCategoryName}&sort_by=vote_average.desc&page=${page}&api_key=${tmdbApiKey}`;
          }
        }

        // Get popular movies
        return `movie/popular?page=${page}&api_key=${tmdbApiKey}`;
      },
    }),

    // Get single movie
    getMovie: builder.query({
      query: (id) =>
        `/movie/${id}?append_to_response=videos,credits&api_key=${tmdbApiKey}`,
    }),
  }),
});

export const { useGetGenresQuery, useGetMoviesQuery, useGetMovieQuery } =
  tmdbApi;
