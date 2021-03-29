import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import SideMenu from "../components/SideMenu";
import Header from "../components/Header";

import Department from "../pages/Department/Department";
import Employee from "../pages/Employee/Employee";
import Leave from '../pages/Leave/Leave';
import ShiftType from "../pages/ShiftType/ShiftType";
import {Dashboard} from "../pages/Dashboard/Dashboard";
import Title from "../pages/Title/Title";
import UserAccount from "../pages/UserAccount/UserAccount";
import LeaveType from "../pages/LeaveType/LeaveType";
import Holiday from "../pages/Holiday/Holiday";
import ShiftMapper from '../pages/ShiftMapper/ShiftMapper';
import {Profile} from '../pages/Profile/Profile';
import {DailyReport} from '../pages/Report/DailyReport';
import {WorkTimeReport} from '../pages/Report/WorkTimeReport';
import {ChartsReport} from '../pages/Report/ChartsReport';

import { ApiService } from "../services/ApiService";
import { HubConnectionBuilder } from '@microsoft/signalr';

import Snackbar from '@material-ui/core/Snackbar';
import Alert from './Alert';

const DefaultContainer = () => {
    const [conn, setConn] = useState();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [trackChange, setTrackChange] = useState(0); // id of new message

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenSnackbar(false);
    };

    useEffect(() => {
        setupSignalR();
    },[])
    
    useEffect(() => {
        return () => {
            if((typeof conn !== "undefined") && (typeof conn.stop === 'function')) {
                conn.stop();
            }
        }
    },[conn])

    const setupSignalR = async () =>{
        let properUrl = await ApiService.get('signalr/negotiate')
        const connection = new HubConnectionBuilder()
            .withUrl(properUrl.url, {accessTokenFactory: () => properUrl.accessToken})
            .withAutomaticReconnect()
            .build();
        connection.start()
            .then(() => {})
            .catch(() => console.log('Something went wrong with SignalR connection.'))

        if((typeof connection !== "undefined") && (typeof connection.on === 'function')){
            connection.on('newMessage', function(message) {
                setTrackChange(message.id);
                if(!message.hasOwnProperty('personnelName') || message.personnelName == null){
                    setSnackbarMessage("Latest: Unknown User used action -> " + message.event);
                }
                else{
                    setSnackbarMessage("Latest: " + message.personnelName + " -> " + message.event);
                }
                setOpenSnackbar(true)
            })
        }
        setConn(connection)
    }

    return(
    <Router>
      <Header />
      <SideMenu />
      <div className="appMain">
          <Switch>
            <Route 
                exact path='/'
                render={(props) => (
                    <Dashboard {...props} trackChange={trackChange} />
                )}
            />
            <Route path='/employee' component={Employee} />
            <Route path='/department' component={Department} />
            <Route path='/title' component={Title} />
            <Route path='/user' component={UserAccount} />
            <Route path='/leave' component={Leave} />
            <Route path='/leave-type' component={LeaveType} />
            <Route path='/shift-type' component={ShiftType} />
            <Route path='/shift' component={ShiftMapper} />
            <Route path='/holiday' component={Holiday} />
            <Route path='/settings/profile' component={Profile} />
            <Route path='/report/daily' component={DailyReport} />
            <Route path='/report/work-time' component={WorkTimeReport} />
            <Route path='/report/charts' component={ChartsReport} />
          </Switch>
      </div>

      <Snackbar
                anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
                }}
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success">
            {snackbarMessage}
        </Alert>
      </Snackbar>

    </Router>
    );
};

export default DefaultContainer;