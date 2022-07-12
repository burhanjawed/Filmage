import React from 'react';
import { Grid } from '@mui/material';
import { Movie } from '..';

import useStyles from './styles';

const MovieList = ({ movies, slice }) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.moviesContainer}>
      {!slice
        ? movies.results.map((movie, idx) => (
            <Movie key={idx} movie={movie} idx={idx} />
          ))
        : movies.results
            .map((movie, idx) => <Movie key={idx} movie={movie} idx={idx} />)
            .slice(0, slice)}
    </Grid>
  );
};

// Default props
MovieList.defaultProps = {
  slice: 0,
};

export default MovieList;
