import React, {useState, useEffect} from 'react'
import { makeStyles, Paper } from "@material-ui/core";
import { ApiService } from "../../services/ApiService";
import Controls from "../../components/controls/Controls";
import TabPanel from '../../components/TabPanel';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {ReportHeader} from './ReportHeader'
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import {PersonnelTotalsReport} from './WorkTimeReports/PersonnelTotalsReport';
import {PerPersonnelReport} from './WorkTimeReports/PerPersonnelReport';

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
    const url = 'report/time';
    const classes = useStyles();

    const [endDate, setEndDate] = useState(new Date())
    const startDateAtBeggining = new Date()
    startDateAtBeggining.setTime(endDate.getTime()-(10*24*3600000));
    const [startDate, setStartDate] = useState(startDateAtBeggining)
    
    const [records, setRecords] = useState({
        personnelTimesList: [], totalTimeBreaks: 0, totalTimeWorked: 0,totalTimeOfficial: 0,
        totalRegularTimeWorked: 0, totalWeekendTimeWorked: 0, totalHolidayTimeWorked: 0,
        totalAbsences: 0, totalDaysWorked: 0
    });
    const [tabValue, setTabValue] = useState(0);
    const [employee, setEmployee] = useState(0);
    const [employees, setEmployees] = useState([]);
    const [visibleDataEmployee, setVisibleDataEmployee] = useState({
        personnelFullName: ''
    });

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    useEffect(() => {
        fetchEmployeeRecords();
    }, [])
    const fetchEmployeeRecords = async () => { setEmployees(await ApiService.get('personnel/simple')) }

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
        data.totalAbsences = 0
        data.totalTimeWorked = (((data.totalTimeWorked / 1000) / 60) / 60).toFixed(2)
        data.totalTimeBreaks = ((data.totalTimeBreaks / 1000) / 60).toFixed(2)
        data.totalTimeOfficial = (((data.totalTimeOfficial / 1000) / 60) / 60).toFixed(2)
        data.totalRegularTimeWorked = (((data.totalRegularTimeWorked / 1000) / 60) / 60).toFixed(2)
        data.totalWeekendTimeWorked = (((data.totalWeekendTimeWorked / 1000) / 60) / 60).toFixed(2)
        data.totalHolidayTimeWorked = (((data.totalHolidayTimeWorked / 1000) / 60) / 60).toFixed(2)
        for(let i = 0;i<data.personnelTimesList.length;i++){
            data.totalAbsences += data.personnelTimesList[i].totalLeaves;
            data.personnelTimesList[i].totalTimeWorked = (((data.personnelTimesList[i].totalTimeWorked / 1000) / 60) / 60).toFixed(2)
            data.personnelTimesList[i].totalTimeBreaks = ((data.personnelTimesList[i].totalTimeBreaks / 1000) / 60).toFixed(2)
            data.personnelTimesList[i].totalTimeOfficial = (((data.personnelTimesList[i].totalTimeOfficial / 1000) / 60) / 60).toFixed(2)
            data.personnelTimesList[i].totalRegularTimeWorked = (((data.personnelTimesList[i].totalRegularTimeWorked / 1000) / 60) / 60).toFixed(2)
            data.personnelTimesList[i].totalWeekendTimeWorked = (((data.personnelTimesList[i].totalWeekendTimeWorked / 1000) / 60) / 60).toFixed(2)
            data.personnelTimesList[i].totalHolidayTimeWorked = (((data.personnelTimesList[i].totalHolidayTimeWorked / 1000) / 60) / 60).toFixed(2)
            for(let j = 0; j<data.personnelTimesList[i].timeReportPerPersonnelForDateResponseList.length; j++){
                data.personnelTimesList[i].timeReportPerPersonnelForDateResponseList[j].totalTimeWorked = (((data.personnelTimesList[i].timeReportPerPersonnelForDateResponseList[j].totalTimeWorked / 1000) / 60) / 60).toFixed(2)
                data.personnelTimesList[i].timeReportPerPersonnelForDateResponseList[j].totalTimeBreaks = ((data.personnelTimesList[i].timeReportPerPersonnelForDateResponseList[j].totalTimeBreaks / 1000) / 60).toFixed(2)
                data.personnelTimesList[i].timeReportPerPersonnelForDateResponseList[j].totalTimeOfficial = (((data.personnelTimesList[i].timeReportPerPersonnelForDateResponseList[j].totalTimeOfficial / 1000) / 60) / 60).toFixed(2)
                data.personnelTimesList[i].timeReportPerPersonnelForDateResponseList[j].totalRegularTimeWorked = (((data.personnelTimesList[i].timeReportPerPersonnelForDateResponseList[j].totalRegularTimeWorked / 1000) / 60) / 60).toFixed(2)
                data.personnelTimesList[i].timeReportPerPersonnelForDateResponseList[j].totalWeekendTimeWorked = (((data.personnelTimesList[i].timeReportPerPersonnelForDateResponseList[j].totalWeekendTimeWorked / 1000) / 60) / 60).toFixed(2)
                data.personnelTimesList[i].timeReportPerPersonnelForDateResponseList[j].totalHolidayTimeWorked = (((data.personnelTimesList[i].timeReportPerPersonnelForDateResponseList[j].totalHolidayTimeWorked / 1000) / 60) / 60).toFixed(2)
            }
        }

        setRecords(data)
    }

    const handleFilterByDate = e => {
        setEmployee(0);
        let target = e.target;
        if(target.name === 'startDate'){
            setStartDate(target.value)
        }
        else if(target.name === 'endDate'){
            setEndDate(target.value)
        }
    }
    const handleEmployeeChange = (e) => {
        setEmployee(e.target.value)
        for(let i=0;i<records.personnelTimesList.length;i++){
            // eslint-disable-next-line
            if(records.personnelTimesList[i].personnelId == e.target.value){
                setVisibleDataEmployee(records.personnelTimesList[i])
                break;
            }
        }
    }

    return (
        <>
        <ReportHeader headerText="Work Time Report" />
        <Paper>
        <div style={{ textAlign:'center', marginTop: '20px', width: '80%', marginLeft:'auto', marginRight:'auto', marginBottom: '6px'}}>
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
            <div style={{display:'inline-block', position: 'relative', top:'17px'}}>
            <IconButton onClick={() => fetchRecords(startDate, endDate)}>
                <SearchIcon fontSize="large"  />
            </IconButton>
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
            <Tab label="By Date - Totals" {...a11yProps(0)}  />
            <Tab label="By Employee" {...a11yProps(1)}  />
            </Tabs>
        </AppBar>
        <TabPanel value={tabValue} index={0}>
            <PersonnelTotalsReport data={records} />
        </TabPanel>
        <TabPanel value={tabValue} index={1} >
            <div style={{textAlign:'center', width: '70%', marginLeft:'auto', marginRight:'auto', marginBottom: '14px'}}>
            <Controls.Select
                name="employee"
                label="Choose Employee"
                value={employee}
                onChange={handleEmployeeChange}
                options={employees}
                valueItem = "fullName"
                myWidth='180px'
                className={classes.controlsStyle}
            />
            </div>
            <PerPersonnelReport data={visibleDataEmployee} />
        </TabPanel>
        </div>
        
        </Paper>
        </>
    )
}
