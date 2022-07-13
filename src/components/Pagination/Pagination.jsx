import React from 'react';
import { Typography, Button } from '@mui/material';

import useStyles from './styles';

const Pagination = ({ currentPage, setPage, totalPages }) => {
  const classes = useStyles();

  if (totalPages === 0) return null;

  const handlePrev = () => {
    setPage((prevPage) => {
      if (prevPage === 1) {
        return 1;
      } else {
        return prevPage - 1;
      }
    });
  };

  const handleNext = () => {
    setPage((prevPage) => {
      if (prevPage === totalPages) {
        return totalPages;
      } else {
        return prevPage + 1;
      }
    });
  };

  return (
    <div className={classes.container}>
      <Button
        className={classes.button}
        variant='contained'
        color='primary'
        type='button'
        onClick={handlePrev}
      >
        Prev
      </Button>
      <Typography variant='h4' className={classes.pageNumber}>
        {currentPage}
      </Typography>
      <Button
        className={classes.button}
        variant='contained'
        color='primary'
        type='button'
        onClick={handleNext}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
