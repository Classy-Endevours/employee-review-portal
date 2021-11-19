import React from 'react';
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Container,
  Typography
} from '@material-ui/core';
import { LockOutlined as LockOutlinedIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import Storage from '../_helpers/Storage';
import { Login } from '../_services/employee.service';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '../redux/actions';

const useStyles = makeStyles(theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  imgContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(1)
  }
}));

export default function SignIn(props) {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const iUser = {
    username: '',
    password: ''
  };
  const [submitted, setSubmitted] = React.useState(false);
  const [userLogin, setUserLogin] = React.useState(iUser);
  const dispatch = useDispatch();

  const handleChange = e => {
    const { name, value } = e.target;
    var usr = { ...userLogin };
    usr[name] = value;
    setUserLogin(usr);
  };

  const user = useSelector(state => state.user);
  const handleSubmit = e => {
    e.preventDefault();
    setSubmitted(true);
    if (userLogin.username && userLogin.password) {
      console.log(JSON.stringify(userLogin));
      Login(userLogin.username, userLogin.password).then(
        userWToken => {
          if (userWToken) {
            Storage.saveUser(JSON.stringify(userWToken));
            dispatch(setCurrentUser(userWToken.user));
            console.log(user);
            props.history.push('/');
            enqueueSnackbar('Logged in Successfully', { variant: 'success' });
          }
        },
        err => {
          enqueueSnackbar('Username or password is wrong', {
            variant: 'error'
          });
          setSubmitted(false);
        }
      );
    } else {
      enqueueSnackbar('Values cannot be empty', { variant: 'warning' });
      setSubmitted(false);
    }
  };

  return (
    <div style={{
      display: 'flex'
    }}>
      <img
        style={{ width: "400px", margin: "auto" }}
        src="loginPage.svg"
        alt="login page"
      />
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate onSubmit={handleSubmit}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="User Name"
              name="username"
              autoComplete="username"
              autoFocus
              onChange={handleChange}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={submitted}
            >
              Sign In
            </Button>
          </form>
        </div>
      </Container>
    </div>
  );
}
