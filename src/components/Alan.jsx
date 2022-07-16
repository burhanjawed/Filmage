import React, { useEffect, useContext } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { ColorModeContext } from '../utils/ToggleColorMode';
import { fetchToken } from '../utils';
import { userSelector } from '../features/auth';
import {
  selectGenreOrCategory,
  searchMovie,
} from '../features/currentGenreOrCategory';

const useAlan = () => {
  const { setMode } = useContext(ColorModeContext);
  const { isAuthenticated, user } = useSelector(userSelector);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    alanBtn({
      key: 'e678a007ed706e1d554b3b58959b4d3d2e956eca572e1d8b807a3e2338fdd0dc/stage',
      onCommand: ({ command, mode, genres, genreOrCategory, query }) => {
        if (command === 'chooseGenre') {
          const foundGenre = genres.find(
            (g) => g.name.toLowerCase() === genreOrCategory.toLowerCase()
          );

          if (foundGenre) {
            history.push('/');
            dispatch(selectGenreOrCategory(foundGenre.id));
          } else {
            // top rated - upcoming - popular
            const category = genreOrCategory.startsWith('top')
              ? 'top_rated'
              : genreOrCategory;

            history.push('/');
            dispatch(selectGenreOrCategory(category));
          }
        } else if (command === 'changeMode') {
          if (mode === 'light') {
            setMode('light');
          } else {
            setMode('dark');
          }
        } else if (command === 'login') {
          if (isAuthenticated) {
            fetchToken();
          } else {
            history.push(`/profile/${user.id}`);
          }
        } else if (command === 'logout') {
          localStorage.clear();

          history.push('/');
        } else if (command === 'myMovies') {
          if (!isAuthenticated) {
            history.push(`/profile/${user.id}`);
          } else {
            fetchToken();
          }
        } else if (command === 'search') {
          dispatch(searchMovie(query));
        }
      },
    });
  }, []);
};

export default useAlan;
