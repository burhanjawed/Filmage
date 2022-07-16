import React from 'react';
import { Grid } from '@mui/material';
import { Movie } from '..';

import useStyles from './styles';

const MovieList = ({ movies, slice, type, excludeFirst }) => {
  const classes = useStyles();
  const startFrom = excludeFirst ? 1 : 0;

  return (
    <Grid container className={classes.moviesContainer}>
      {!slice
        ? movies?.results.map((movie, idx) => (
            <Movie key={idx} movie={movie} idx={idx} />
          ))
        : movies?.results
            .map((movie, idx) => <Movie key={idx} movie={movie} idx={idx} />)
            .slice(startFrom, slice)}
    </Grid>
  );
};

// Default props
MovieList.defaultProps = {
  slice: 0,
};

export default MovieList;
