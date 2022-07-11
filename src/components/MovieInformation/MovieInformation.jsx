import React from 'react';
import {
  Modal,
  Typography,
  Button,
  ButtonGroup,
  Grid,
  Box,
  CircularProgress,
  useMediaQuery,
  Rating,
} from '@mui/material';
import {
  Movie as MovieIcon,
  Theaters,
  Language,
  PlusOne,
  Favorite,
  FavoriteBorderOutlined,
  Remove,
  ArrowBack,
} from '@mui/icons-material';

import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { useGetMovieQuery } from '../../services/TMDB';
import genreIcons from '../../assets/genres';

import { useDispatch, useSelector } from 'react-redux';
import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';

import useStyles from './styles';
import './MovieInformation.scss';

const MovieInformation = () => {
  const classes = useStyles();
  const { id } = useParams();
  const dispatch = useDispatch();
  //get movie info
  const { data, isFetching, error } = useGetMovieQuery(id);

  console.log(data);

  if (isFetching) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center'>
        <CircularProgress size='8rem' />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center'>
        <Link to='/'>Something has gone wrong - Go back</Link>
      </Box>
    );
  }

  const timeConvert = (n) => {
    let num = n;
    let hours = num / 60;
    let rhours = Math.floor(hours);
    let minutes = (hours - rhours) * 60;
    let rminutes = Math.round(minutes);
    const hourString = rhours === 1 ? `${rhours} hour` : `${rhours} hours`;
    const minuteString =
      rminutes === 1 ? `${rminutes} minute` : `${rminutes} minutes`;

    let convertedString =
      rhours === 0 ? minuteString : hourString + ' ' + minuteString;

    return convertedString;
  };

  const spokenLanguages = () => {
    let langString = ' / ';
    if (data.spoken_languages.length > 0) {
      for (let i = 0; i < data.spoken_languages.length; i++) {
        if (i === 0) {
          langString += `${data.spoken_languages[i].english_name}`;
        } else {
          langString += `, ${data.spoken_languages[i].english_name}`;
        }
      }
      return langString;
    }
  };

  return (
    <Grid container className={classes.containerSpaceAround}>
      <Grid item sm={12} lg={4}>
        <img
          src={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`}
          alt={data?.title}
          className={classes.poster}
        />
      </Grid>
      <Grid item container direction='column' lg={7}>
        <Typography variant='h3' align='center' gutterBottom>
          {data?.title} ({data.release_date.split('-')[0]})
        </Typography>
        <Typography variant='h5' align='center' gutterBottom>
          {data?.tagline}
        </Typography>
        <Grid item className={classes.containerSpaceAround}>
          <Box display='flex' align='center'>
            <Rating readOnly value={data.vote_average / 2} />
            <Typography
              variant='subtitle1'
              gutterBottom
              style={{ marginLeft: '10px' }}
            >
              {data?.vote_average} / 10
            </Typography>
          </Box>
          <Typography variant='h6' align='center' gutterBottom>
            {data?.runtime && timeConvert(data?.runtime)}
            {data.spoken_languages.length > 0 && spokenLanguages()}
          </Typography>
        </Grid>
        <Grid item className={classes.genresContainer}>
          {data?.genres?.map((genre, idx) => (
            <Link
              key={idx}
              className={classes.links}
              to='/'
              onClick={() => dispatch(selectGenreOrCategory(genre.id))}
            >
              <img
                src={genreIcons[genre.name.toLowerCase()]}
                alt='genre'
                className={classes.genreImage}
                height={30}
              />
              <Typography color='textPrimary' variant='subtitle1'>
                {genre?.name}
              </Typography>
            </Link>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default MovieInformation;
