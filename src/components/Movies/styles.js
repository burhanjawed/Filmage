import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  sortContainer: {
    justifyContent: 'flex-end',
    display: 'flex',
    padding: '10px',

    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
}));
