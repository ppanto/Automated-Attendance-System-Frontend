import React from 'react';
import { CssBaseline, createMuiTheme, ThemeProvider } from '@material-ui/core';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {PrivateRoute} from '../components/PrivateRoute';

import {Login} from "../pages/Login/Login";
import DefaultContainer from "../components/DefaultContainer";


const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#333996",
      light: '#3c44b126'
    },
    secondary: {
      main: "#f83245",
      light: '#f8324526'
    },
    background: {
      default: "#f4f5fd"
    },
  },
  overrides:{
    MuiAppBar:{
      root:{
        transform:'translateZ(0)'
      }
    }
  },
  props:{
    MuiIconButton:{
      disableRipple:true
    }
  }
})

function App() {
  //localStorage.setItem('user', JSON.stringify({username:'Admin',token:'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBZG1pbiIsImV4cCI6MTYxOTM4OTE3N30.y7NmYVTVEZwTNA9c11TVaLzBd-x7UueSkcxH6qIaYf4ZQysjAQDpwXqsrrTL_jcFJN4Ed5l41-SrR9Ue6zj07g'}));
  return (
    <ThemeProvider theme={theme}>
      <Router>
          <Switch>
            <PrivateRoute exact path='/' component={DefaultContainer}></PrivateRoute>
            <Route path='/login' component={Login}></Route>
            <Redirect to='/login' />
            {/* <Redirect to='/' /> */}
          </Switch>
      </Router>
      <CssBaseline />
    </ThemeProvider>
  );
}

export default App;
