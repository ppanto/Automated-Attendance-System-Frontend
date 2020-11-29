import React from 'react';
import { CssBaseline, createMuiTheme, ThemeProvider } from '@material-ui/core';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import {PrivateRoute} from '../components/PrivateRoute';

import SideMenu from "../components/SideMenu";
import Header from "../components/Header";
import Title from "../pages/Title/Title";
import Department from "../pages/Department/Department";
import Employee from "../pages/Employee/Employee";
import UserAccount from "../pages/UserAccount/UserAccount";
import LeaveType from "../pages/LeaveType/LeaveType";
import ShiftType from "../pages/ShiftType/ShiftType";
import {Dashboard} from "../pages/Dashboard/Dashboard";
import Holiday from "../pages/Holiday/Holiday";
import {Login} from "../pages/Login/Login";
import {Profile} from '../pages/Profile/Profile';
import ShiftMapper from '../pages/ShiftMapper/ShiftMapper';
import Leave from '../pages/Leave/Leave';
import {DailyReport} from '../pages/Report/DailyReport';
import {WorkTimeReport} from '../pages/Report/WorkTimeReport';
import {ChartsReport} from '../pages/Report/ChartsReport';

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
  //localStorage.setItem('user', JSON.stringify({username:'a',password:'a'}));
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

const DefaultContainer = () => (
  <Router>
    <Header />
    <SideMenu />
    <div className="appMain">
        <Switch>
          <Route exact path='/' component={Dashboard}></Route>
          <Route path='/employee' component={Employee}></Route>
          <Route path='/department' component={Department}></Route>
          <Route path='/title' component={Title}></Route>
          <Route path='/user' component={UserAccount}></Route>
          <Route path='/leave' component={Leave}></Route>
          <Route path='/leave-type' component={LeaveType}></Route>
          <Route path='/shift-type' component={ShiftType}></Route>
          <Route path='/shift' component={ShiftMapper}></Route>
          <Route path='/holiday' component={Holiday}></Route>
          <Route path='/settings/profile' component={Profile}></Route>
          <Route path='/report/daily' component={DailyReport}></Route>
          <Route path='/report/work-time' component={WorkTimeReport}></Route>
          <Route path='/report/charts' component={ChartsReport}></Route>
        </Switch>
    </div>
  </Router>
);

export default App;
