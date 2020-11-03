import React, {useState, useEffect} from 'react'
import { makeStyles, Paper, InputAdornment } from "@material-ui/core";
import { ApiService } from "../../services/ApiService";
import { DataGrid } from '@material-ui/data-grid';
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import { HubConnectionBuilder } from '@microsoft/signalr';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles(theme => ({
    controlsStyle:{
        paddingLeft: '6px',
        paddingRight: '6px',
    }
}))

export const Tabular2 = () => {
    
    const url = 'attendance-action/by-action'
    const classes = useStyles();
    const [records, setRecords] = useState([]);
    const [visibleRecords, setVisibleRecords] = useState([]);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        fetchRecords(new Date(), new Date());
        setupSignalR();
        // eslint-disable-next-line
    }, [])
    useEffect(() => {
        setVisibleRecords(records);
    }, [records])

    const fetchRecords = async (dateStart, dateEnd) => {
        const params = 
            "dateStart=" +
            dateStart.getFullYear() 
            + "-" + 
            (dateStart.getMonth()+1) 
            + "-" +
            dateStart.getDate()
            + "&dateEnd=" +
            dateEnd.getFullYear() 
            + "-" + 
            (dateEnd.getMonth()+1) 
            + "-" +
            dateEnd.getDate()
        const data = await ApiService.get(`${url}?${params}`)
        data.forEach(item => {
            item.dateAsString = item.dateTime.slice(0,10)
            item.timeAsString = item.dateTime.slice(11,19)
        })
        setRecords(data)
    }

    const handleFilterByDate = e => {
        let target = e.target;
        if(target.name === 'startDate'){
            setStartDate(target.value)
            fetchRecords(target.value, endDate)
        }
        else if(target.name === 'endDate'){
            setEndDate(target.value)
            fetchRecords(startDate, target.value)
        }
    }
    const handleSearch = e => {
        let target = e.target;
        setVisibleRecords(records.filter(x => x.personnelName.toLowerCase().includes(target.value.toLowerCase())))
    }

    const columns = [
        { field: 'personnelName', headerName: 'Full Name', width: 250 },
        { field: 'dateAsString', headerName: 'Date', width: 250 },
        { field: 'timeAsString', headerName: 'Time', width: 250 },
        { field: 'event', headerName: 'Event', width: 250 },
    ];

    const setupSignalR = async () =>{
        let properUrl = await ApiService.get('signalr/negotiate')
        const connection = new HubConnectionBuilder()
            .withUrl(properUrl.url, {accessTokenFactory: () => properUrl.accessToken})
            .withAutomaticReconnect()
            .build();
        connection.on('newMessage', function(message) {
            fetchRecords(startDate, endDate)
            setSnackbarMessage("Latest: " + message.personnelName + " -> " + message.event);
            setOpenSnackbar(true)
        })
        connection.start()
            .then(() => {})
            .catch(() => console.log('Something went wrong with SignalR connection.'))
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenSnackbar(false);
    };

    return (
        <Paper>
            <div style={{textAlign:'center', marginTop: '20px', width: '70%', marginLeft:'auto', marginRight:'auto', marginBottom: '20px'}}>
                <Controls.Input
                        label="Search By Employee"
                        InputProps={{
                            startAdornment: (<InputAdornment position="start">
                                <Search />
                            </InputAdornment>)
                        }}
                        onChange={handleSearch}
                        className={classes.controlsStyle}
                />
                <Controls.DatePicker
                    name="startDate"
                    label="Start Date"
                    value={startDate}
                    onChange={handleFilterByDate}
                    className={classes.controlsStyle}
                />
                <Controls.DatePicker
                    name="endDate"
                    label="End Date"
                    value={endDate}
                    onChange={handleFilterByDate}
                    className={classes.controlsStyle}
                />
            </div>
            <div style={{ height: 650, width: '95%', marginTop:'15', marginLeft:'auto', marginRight:'auto' }}>
                <DataGrid rows={visibleRecords} columns={columns} pageSize={10} />
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
        </Paper>
    )
}