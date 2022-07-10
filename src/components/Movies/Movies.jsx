import React, { useState, useEffect } from 'react';
import {
  Box,
  CircularProgress,
  useMediaQuery,
  Typography,
  Select,
  InputLabel,
  MenuItem,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';
import { MovieList } from '..';
import './Movies.scss';
import useStyles from './styles';

import { useGetMoviesQuery } from '../../services/TMDB';

const Movies = () => {
  const classes = useStyles();

  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('popular');

  const { genreIdOrCategoryName } = useSelector(
    (state) => state.currentGenreOrCategory
  );

  const { data, error, isFetching } = useGetMoviesQuery({
    genreIdOrCategoryName,
    page,
    sort,
  });

  useEffect(() => {
    setSort('popular');
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
      <div className={classes.sortContainer}>
        <InputLabel id='sortBy'>Sort By</InputLabel>
        <Select
          labelId='sortBy'
          id='sortBySelect'
          value={sort}
          label='Sort By'
          sx={{ m: 1, minWidth: 120 }}
          size='small'
          onChange={(e) => setSort(e.target.value)}
        >
          <MenuItem value={'popular'}>Popular</MenuItem>
          <MenuItem value={'releaseDate'}>Release Date</MenuItem>
          <MenuItem value={'topRated'}>Top Rated</MenuItem>
        </Select>
      </div>
      <MovieList movies={data} />
    </div>
  );
};

export default Movies;
