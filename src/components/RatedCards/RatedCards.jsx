import React from 'react';
import { Typography, Box } from '@mui/material';
import useStyles from './styles';

import { Movie } from '..';

const RatedCards = ({ title, data }) => {
  const classes = useStyles();

  console.log(data);

  return (
    <Box>
      <Typography variant='h5' gutterBottom>
        {title}
      </Typography>
      <Box display='flex' flexWrap='wrap' className={classes.container}>
        {data?.results.length !== 0 &&
          data?.results.map((movie, idx) => (
            <Movie key={movie.id} movie={movie} idx={idx} />
          ))}
      </Box>
    </Box>
  );
};

export default RatedCards;
