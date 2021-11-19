import React, { useEffect } from 'react';
import clsx from 'clsx';
import {
  makeStyles,
  ThemeProvider,
  createMuiTheme
} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  useMediaQuery
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ExitToApp
} from '@material-ui/icons';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { MenuItems } from './_core/MenuItems';
import DashContainer from './_core/DashContainer';
import SignIn from './_core/SignIn';
import { blue, orange } from '@material-ui/core/colors';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { Logout } from './_services/employee.service';
import storage from './_helpers/Storage';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    background: theme.palette.background.default
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: 'none'
  },
  title: {
    flexGrow: 1
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9)
    }
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  fixedHeight: {
    height: 240
  }
}));

function Dashboard() {
  const mobileView = useMediaQuery(theme => theme.breakpoints.down('sm'));
  const classes = useStyles();
  const [open, setOpen] = React.useState(true);
  const [, setHeader] = React.useState('');
  const { enqueueSnackbar } = useSnackbar();
  const user = storage.getUser(); //useSelector(state => state.user);

  useEffect(() => {
    setOpen(!mobileView);
  }, [mobileView]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const updateHeader = headerText => {
    setHeader(headerText);
  };

  const logOut = () => {
    Logout(user._id);
    window.location.reload();
    enqueueSnackbar('Logged out successfully!', { variant: 'success' });
  };

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position='absolute'
        className={clsx(classes.appBar, open && classes.appBarShift)}
      >
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='open drawer'
            onClick={handleDrawerOpen}
            className={clsx(
              classes.menuButton,
              open && classes.menuButtonHidden
            )}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            component='h1'
            variant='h6'
            color='inherit'
            noWrap
            className={classes.title}
          >
            {/* {header} */}
          </Typography>
          <Typography>{user.name}</Typography>
          <IconButton onClick={logOut}>
            <ExitToApp />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        variant='permanent'
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose)
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>
          <MenuItems role={user.role} />
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <DashContainer
          updateHeader={updateHeader}
          fixedHeightPaper={fixedHeightPaper}
          classes={classes}
          role={user.role}
        />
      </main>
    </div>
  );
}

export default function App() {
  const theme = createMuiTheme({
    palette: {
      type: 'light',
      primary: blue,
      secondary: {
        main: orange[700]
      }
    },
    overrides: {
      MuiTextField: {
        root: {
          margin: '10px'
        }
      },
      MuiTableHead: {
        root: {
          fontWeight: 'bolder'
        }
      }
    }
  });
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <SnackbarProvider maxSnack={3}>
          <Route
            path='/'
            render={props => {
              const user = storage.getUser(); //useSelector(state => state.user);
              return user ? <Dashboard {...props} /> : <Redirect to='/login' />;
            }}
          ></Route>
          <Route path='/login' render={props => <SignIn {...props} />} />
        </SnackbarProvider>
      </ThemeProvider>
    </Router>
  );
}
