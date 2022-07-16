import React, { useEffect, useState } from 'react';
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
import {
  useGetListQuery,
  useGetMovieQuery,
  useGetRecommendationsQuery,
} from '../../services/TMDB';
import genreIcons from '../../assets/genres';
import { MovieList } from '..';

import { useDispatch, useSelector } from 'react-redux';
import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';
import { userSelector } from '../../features/auth';

import useStyles from './styles';
import './MovieInformation.scss';

const MovieInformation = () => {
  const classes = useStyles();
  const { id } = useParams();
  const dispatch = useDispatch();

  // Get user
  const { user } = useSelector(userSelector);

  //get movie info
  const { data, isFetching, error } = useGetMovieQuery(id);
  const { data: favoriteMovies } = useGetListQuery({
    listName: 'favorite/movies',
    accountId: user.id,
    sessionId: localStorage.getItem('session_id'),
    page: 1,
  });
  const { data: watchlistMovies } = useGetListQuery({
    listName: 'watchlist/movies',
    accountId: user.id,
    sessionId: localStorage.getItem('session_id'),
    page: 1,
  });
  const { data: recommendations, isFetching: isRecommendationsFetching } =
    useGetRecommendationsQuery({
      movie_id: id,
      list: `/recommendations`,
    });

  const [open, setOpen] = useState(false);
  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  const [isMovieWatchListed, setIsMovieWatchListed] = useState(false);

  useEffect(() => {
    setIsMovieFavorited(
      !!favoriteMovies?.results?.find((movie) => movie?.id === data?.id)
    );
  }, [favoriteMovies, data]);

  useEffect(() => {
    setIsMovieWatchListed(
      !!watchlistMovies?.results?.find((movie) => movie?.id === data?.id)
    );
  }, [favoriteMovies, data]);

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
    const hourString = rhours === 1 ? `${rhours} hr` : `${rhours} hrs`;
    const minuteString =
      rminutes === 1 ? `${rminutes} min` : `${rminutes} mins`;

    let convertedString = rhours === 0 ? num : hourString + ' ' + minuteString;

    return convertedString;
  };

  const spokenLanguages = () => {
    let langString = ' | ';
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

  const convertDate = (date) => {
    let newDate = new Date(date.replace(/-/g, '/'));
    let convertedDate = newDate.toString().split(' ');
    let dateString = `${convertedDate[1]} ${parseInt(convertedDate[2])}, ${
      convertedDate[3]
    }`;
    return dateString;
  };

  const addToFavorites = async () => {
    await axios.post(
      `https://api.themoviedb.org/3/account/${user.id}/favorite?api_key=${
        process.env.REACT_APP_TMDB_KEY
      }&session_id=${localStorage.getItem('session_id')}`,
      {
        media_type: 'movie',
        media_id: id,
        favorite: !isMovieFavorited,
      }
    );

    setIsMovieFavorited((prev) => !prev);
  };

  const addToWatchlist = async () => {
    await axios.post(
      `https://api.themoviedb.org/3/account/${user.id}/watchlist?api_key=${
        process.env.REACT_APP_TMDB_KEY
      }&session_id=${localStorage.getItem('session_id')}`,
      {
        media_type: 'movie',
        media_id: id,
        watchlist: !isMovieWatchListed,
      }
    );

    setIsMovieWatchListed((prev) => !prev);
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
            {data?.runtime && timeConvert(data.runtime)}
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
        <Typography variant='h5' gutterBottom style={{ marginTop: '10px' }}>
          Overview
        </Typography>
        <Typography style={{ marginBottom: '2rem' }}>
          {data?.overview}
        </Typography>
        <Typography variant='h5' gutterBottom>
          Top Cast
        </Typography>
        <Grid item container spacing={2}>
          {data &&
            data.credits?.cast
              ?.map(
                (actor, idx) =>
                  actor.profile_path && (
                    <Grid
                      key={idx}
                      item
                      xs={4}
                      md={2}
                      component={Link}
                      to={`/actors/${actor.id}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <img
                        src={`https://image.tmdb.org/t/p/w500/${actor.profile_path}`}
                        alt='Actor'
                        className={classes.castImage}
                      />
                      <Typography color='textPrimary'>{actor.name}</Typography>
                      <Typography color='textSecondary'>
                        {actor.character.split('/')[0]}
                      </Typography>
                    </Grid>
                  )
              )
              .slice(0, 6)}
        </Grid>
        <Typography variant='h5' gutterBottom style={{ marginTop: '2rem' }}>
          Details
        </Typography>
        <Grid item container>
          <Grid
            item
            xs={12}
            sm={12}
            className={classes.detailsContainer}
            style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}
          >
            <Typography>
              <strong>Release Date:</strong> {convertDate(data?.release_date)}
            </Typography>
            <Typography>
              <strong>Runtime:</strong> {timeConvert(data?.runtime)}
            </Typography>
            <Typography>
              <strong>Genres:</strong>{' '}
              {data?.genres.map((genre, idx) => {
                if (idx === data?.genres.length - 1) {
                  return (
                    <Link
                      key={idx}
                      to='/'
                      className={classes.detailsLink}
                      onClick={() => dispatch(selectGenreOrCategory(genre.id))}
                    >
                      {genre.name}
                    </Link>
                  );
                } else {
                  return (
                    <Link
                      key={idx}
                      to='/'
                      className={classes.detailsLink}
                      onClick={() => dispatch(selectGenreOrCategory(genre.id))}
                    >
                      {genre.name},{' '}
                    </Link>
                  );
                }
              })}
            </Typography>
            <Typography>
              <strong>Languages:</strong>{' '}
              {data?.spoken_languages.map((language, idx) => {
                if (idx === data?.spoken_languages.length - 1) {
                  return `${language.english_name}`;
                } else {
                  return `${language.english_name}, `;
                }
              })}
            </Typography>
          </Grid>
        </Grid>
        <Grid item container style={{ marginTop: '2rem' }}>
          <div className={classes.buttonsContainer}>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size='medium' variant='outlined'>
                <Button
                  target='_blank'
                  rel='noopener noreferrer'
                  href={data?.homepage}
                  endIcon={<Language />}
                >
                  Website
                </Button>
                <Button
                  target='_blank'
                  rel='noopener noreferrer'
                  href={`https://www.imdb.com/title/${data?.imdb_id}`}
                  endIcon={<MovieIcon />}
                >
                  IMDB
                </Button>
                <Button
                  onClick={() => setOpen(true)}
                  href='#'
                  endIcon={<Theaters />}
                >
                  Trailer
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12} sm={6} className={classes.buttonsContainer}>
              <ButtonGroup size='medium' variant='outlined'>
                <Button
                  onClick={addToFavorites}
                  endIcon={
                    !isMovieFavorited ? (
                      <FavoriteBorderOutlined />
                    ) : (
                      <Favorite />
                    )
                  }
                >
                  {isMovieFavorited ? 'Unfavorite' : 'Favorite'}
                </Button>
                <Button
                  onClick={addToWatchlist}
                  endIcon={isMovieWatchListed ? <Remove /> : <PlusOne />}
                >
                  Watchlist
                </Button>
                <Button
                  endIcon={<ArrowBack />}
                  sx={{ borderColor: 'primary.main' }}
                >
                  <Typography
                    component={Link}
                    to='/'
                    color='inherit'
                    variant='subtitle2'
                    style={{ textDecoration: 'none' }}
                  >
                    Back
                  </Typography>
                </Button>
              </ButtonGroup>
            </Grid>
          </div>
        </Grid>
      </Grid>
      <Box marginTop='5rem' width='100%'>
        <Typography variant='h3' gutterBottom align='center'>
          You might also like
        </Typography>
        {/* Loop through the recommended movies */}
        {recommendations ? (
          <MovieList movies={recommendations} slice={12} />
        ) : (
          <Box>Sorry, nothing was found.</Box>
        )}
      </Box>
      <Modal
        closeAfterTransition
        className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
      >
        {data?.videos?.results?.length > 0 && (
          <iframe
            autoPlay
            className={classes.video}
            frameBorder='0'
            title='Trailer'
            src={`https://www.youtube.com/embed/${data.videos.results[0].key}`}
            allow='autoplay'
          ></iframe>
        )}
      </Modal>
    </Grid>
  );
};

export default MovieInformation;
