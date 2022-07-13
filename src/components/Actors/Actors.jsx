import React from 'react';
import { Grid, Typography, Button, Box, CircularProgress } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useParams, useHistory } from 'react-router-dom';
import useStyles from './styles';
import {
  useGetActorQuery,
  useGetMoviesByActorQuery,
} from '../../services/TMDB';
import { MovieList } from '..';
import './Actors.scss';

const Actors = () => {
  const classes = useStyles();
  const { id } = useParams();
  const history = useHistory();
  const page = 1;

  const { data, isFetching, error } = useGetActorQuery(id);
  const {
    data: actorMovieData,
    isFetching: actorMovieIsFetching,
    error: actorMovieError,
  } = useGetMoviesByActorQuery({ id, page });

  if (isFetching || actorMovieIsFetching) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center'>
        <CircularProgress size='8rem' />
      </Box>
    );
  }

  if (error || actorMovieError) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center'>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => history.goBack()}
          color='primary'
        >
          Go Back
        </Button>
      </Box>
    );
  }

  const convertDate = (date) => {
    let newDate = new Date(date.replace(/-/g, '/'));
    let convertedDate = newDate.toString().split(' ');
    let dateString = `${convertedDate[1]} ${parseInt(convertedDate[2])}, ${
      convertedDate[3]
    }`;
    return dateString;
  };

  const truncate = (str, n) => {
    return str.length > n ? str.substr(0, n - 1) + '...' : str;
  };

  return (
    <Grid container className={classes.containerSpaceAround}>
      <Grid item sm={12} lg={5} xl={4}>
        <img
          src={
            data?.profile_path &&
            `https://image.tmdb.org/t/p/w500${data?.profile_path}`
          }
          alt={data?.name}
          className={classes.poster}
        />
      </Grid>
      <Grid
        item
        container
        direction='column'
        lg={7}
        xl={8}
        className={classes.description}
      >
        <Typography variant='h3' gutterBottom>
          {data?.name}
        </Typography>
        <Typography variant='h5' gutterBottom>
          {data?.birthday && `Born: ${convertDate(data?.birthday)}`}
        </Typography>
        <Typography variant='body1' paragraph>
          {data?.biography ? truncate(data?.biography, 850) : 'No biography'}
        </Typography>
        <Grid item container className={classes.buttons}>
          <Button
            variant='contained'
            target='_blank'
            rel='noopener noreferrer'
            color='primary'
            href={`https://www.imdb.com/name/${data?.imdb_id}`}
          >
            IMDB
          </Button>
          <Button startIcon={<ArrowBack />}>
            <Typography
              variant='subtitle2'
              onClick={() => history.goBack()}
              color='primary'
              style={{ textDecoration: 'none' }}
            >
              Back
            </Typography>
          </Button>
        </Grid>
      </Grid>
      <Box marginTop='5rem' width='100%'>
        <Typography variant='h3' gutterBottom align='center'>
          Movies
        </Typography>
        {/* Loop through the movies actor has starred in */}
        {actorMovieData ? (
          <MovieList movies={actorMovieData} slice={12} />
        ) : (
          <Box>Sorry, nothing was found.</Box>
        )}
      </Box>
    </Grid>
  );
};

export default Actors;
