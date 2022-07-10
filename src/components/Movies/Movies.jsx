import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  useMediaQuery,
  Typography,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  NativeSelect,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';
import { MovieList } from '..';
import './Movies.scss';
import useStyles from './styles';

import { useGetMoviesQuery } from '../../services/TMDB';

const Movies = () => {
  const classes = useStyles();
  const isMobile = useMediaQuery('(max-width:600px)');

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('popular');

  const { genreIdOrCategoryName, searchQuery } = useSelector(
    (state) => state.currentGenreOrCategory
  );

  const { data, error, isFetching } = useGetMoviesQuery({
    genreIdOrCategoryName,
    page,
    sort,
    searchQuery,
  });

  useEffect(() => {
    sort !== 'popular' && setSort('popular');
  }, [genreIdOrCategoryName]);

  if (isFetching) {
    return (
      <Box display='flex' justifyContent='center'>
        <CircularProgress size='4rem' />
      </Box>
    );
  }

  if (!data.results.length) {
    return (
      <Box display='flex' alignItems='center' mt='20px'>
        <Typography variant='h4'>
          No movies match that name.
          <br />
          Please search for something else.
        </Typography>
      </Box>
    );
  }

  if (error) return 'An error has occurred.';

  return (
    <div>
      {typeof genreIdOrCategoryName === 'number' && (
        <div className={classes.sortContainer}>
          <FormControl sx={{ m: 1, minWidth: 160 }}>
            <InputLabel id='sortBy'>Sort By</InputLabel>
            {isMobile ? (
              <NativeSelect
                id='sortBySelect'
                defaultValue={sort}
                label='Sort By'
                onChange={(e) => setSort(e.target.value)}
              >
                <option value={'popular'}>Popular</option>
                <option value={'releaseDate'}>Release Date</option>
                <option value={'topRated'}>Top Rated</option>
              </NativeSelect>
            ) : (
              <Select
                labelId='sortBy'
                id='sortBySelect'
                value={sort}
                label='Sort By'
                onChange={(e) => setSort(e.target.value)}
              >
                <MenuItem value={'popular'}>Popular</MenuItem>
                <MenuItem value={'releaseDate'}>Release Date</MenuItem>
                <MenuItem value={'topRated'}>Top Rated</MenuItem>
              </Select>
            )}
          </FormControl>
        </div>
      )}
      <MovieList movies={data} />
    </div>
  );
};

export default Movies;
