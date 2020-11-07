import React, {useState, useEffect} from 'react'
import { makeStyles, Paper, InputAdornment } from "@material-ui/core";
//import { ApiService } from "../../services/ApiService";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
//import { DataGrid } from '@material-ui/data-grid';
import TabPanel from '../../components/TabPanel';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {ReportHeader} from './ReportHeader'

function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
}

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        marginTop: '8px',
    },
    controlsStyle:{
        paddingLeft: '6px',
        paddingRight: '6px',
    }
}))

export const WorkTimeReport = () => {
    //const url = 'report/time';
    const classes = useStyles();

    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [searchByEmployeeFilter, setSearchByEmployeeFilter] = useState('')
    //const [records, setRecords] = useState([]);
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        fetchRecords(new Date(), new Date());
    }, [])
    // useEffect(() => {
    //     setVisibleRecords(records);
    // }, [records])

    const fetchRecords = async (dateStart, dateEnd) => {
        // const params = 
        //     "dateStart=" +
        //     dateStart.getFullYear() 
        //     + "-" + 
        //     (dateStart.getMonth()+1) 
        //     + "-" +
        //     dateStart.getDate()
        //     + "&dateEnd=" +
        //     dateEnd.getFullYear() 
        //     + "-" + 
        //     (dateEnd.getMonth()+1) 
        //     + "-" +
        //     dateEnd.getDate()
        //const data = await ApiService.get(`${url}?${params}`)
        //setRecords(data)
    }

    const handleFilterByDate = e => {
        setSearchByEmployeeFilter('');
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

    return (
        <>
        <ReportHeader headerText="Time Report" />
        <Paper>
        <div style={{paddingTop:'8px', textAlign:'center', marginTop: '20px', width: '70%', marginLeft:'auto', marginRight:'auto'}}>
            <div style={{display:'inline-block', marginRight:'6px'}}>
            <Controls.DatePicker
                name="startDate"
                label="Start Date"
                value={startDate}
                onChange={handleFilterByDate}
                className={classes.controlsStyle}
            />
            </div>
            <div style={{display:'inline-block'}}>
            <Controls.DatePicker
                name="endDate"
                label="End Date"
                value={endDate}
                onChange={handleFilterByDate}
                className={classes.controlsStyle}
            />
            </div>
        </div>

        <div className={classes.root}>
        <AppBar position="static" color="default">
            <Tabs value={tabValue} 
            onChange={handleTabChange} 
            aria-label="my tabs"
            indicatorColor="primary"
              textColor="primary"
              centered>
            <Tab label="By Date" {...a11yProps(0)} />
            <Tab label="By Employee" {...a11yProps(1)} />
            </Tabs>
        </AppBar>
        <TabPanel value={tabValue} index={0}>
            Item One
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
            <div style={{textAlign:'center', width: '70%', marginLeft:'auto', marginRight:'auto', marginBottom: '14px'}}>
            <Controls.Input
                label="Filter By Employee"
                InputProps={{
                    startAdornment: (<InputAdornment position="start">
                        <Search />
                    </InputAdornment>)
                }}
                //onChange={handleSearch}
                className={classes.controlsStyle}
                value={searchByEmployeeFilter}
            />
            </div>
        </TabPanel>
        </div>
        
        </Paper>
        </>
    )
}
