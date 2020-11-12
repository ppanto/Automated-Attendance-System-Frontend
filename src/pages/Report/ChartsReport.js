import React, {useState, useEffect} from 'react'
import {ReportHeader} from './ReportHeader';
import { ApiService } from "../../services/ApiService";
import Controls from "../../components/controls/Controls";
import { makeStyles, Paper } from "@material-ui/core";
import {WorkTimeChart} from './Charts/WorkTimeChart';
import {TimeChart} from './Charts/TimeChart';
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import IsDateValid from '../../helpers/IsDateValid';
import {GeneralSnackbar} from '../../components/GeneralSnackbar'

const useStyles = makeStyles(theme => ({
    controlsStyle:{
        paddingLeft: '6px',
        paddingRight: '6px',
    },
    reportPapers: {
        borderTop:'3px solid rgb(224,148,239)',
        marginTop:'1%',
        marginBottom:'2%',
        marginRight:'1%',
        height:'480px',
        width:'50%',
        minWidth:'350px'
    },
    centeredReportHeaders:{
        marginLeft:'auto', marginRight:'auto', width:'270px',fontWeight:'bold',
        marginTop:'4px', fontSize: '17px'
    },
    chartDiv:{
        width:'95%', margin:'auto', minWidth:'640px'
    }
}))

export const ChartsReport = () => {
    const url = 'report/chart'
    const classes = useStyles();

    const [endDate, setEndDate] = useState(new Date())
    const startDateAtBeggining = new Date()
    startDateAtBeggining.setTime(endDate.getTime()-(7*24*3600000));
    const [startDate, setStartDate] = useState(startDateAtBeggining)
    const [records, setRecords] = useState([]);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchRecords(startDate, endDate);
        // eslint-disable-next-line
    }, [])

    const fetchRecords = async (dateStart, dateEnd) => {
        if(!IsDateValid(dateStart) || !IsDateValid(dateEnd)) return;
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
        for(let i=0; i<data.length; i++){
            data[i].timeWorkedAsHours = Math.floor( (((data[i].totalTimeWorked / 1000) / 60) / 60) );
            data[i].averageTimeWorked = (data[i].timeWorkedAsHours/data[i].personnelAtWork).toFixed(2)
            data[i].timeBreakAsMinutes = Math.floor( ((data[i].totalTimeBreaks / 1000) / 60 ) );
            data[i].averageBreak = (data[i].timeBreakAsMinutes/data[i].personnelAtWork).toFixed(2)
            data[i].timeOfficialAsHours = ( (((data[i].totalTimeOfficial / 1000) / 60) / 60).toFixed(2) );
            data[i].averageOfficial = (data[i].timeOfficialAsHours/data[i].personnelAtWork).toFixed(2)
        }
        setRecords(data)
        setOpen(true)
    }
    const handleFilterByDate = e => {
        let target = e.target;
        if(target.name === 'startDate'){
            setStartDate(target.value)
        }
        else if(target.name === 'endDate'){
            setEndDate(target.value)
        }
    }

    return (
        <>
            <ReportHeader headerText="Report - Charts" />

            <Paper >
            <div style={{ textAlign:'center', marginTop: '20px', width: '70%', marginLeft:'auto', marginRight:'auto'}}>
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


            <div style={{width:'100%',display:'flex', flexDirection:'row', overflow:'hidden'}}>
                <Paper className={classes.reportPapers} style={{marginLeft:'1%'}}>
                    <div className={classes.centeredReportHeaders}>
                        <span>Total Work Time</span>
                    </div>
                    <div className={classes.chartDiv}>
                        <WorkTimeChart data={records} />
                    </div>
                </Paper>
                <Paper className={classes.reportPapers}>
                    <div className={classes.centeredReportHeaders}>
                        <span>Break Time</span>
                    </div>
                    <div className={classes.chartDiv}>
                        <TimeChart data={records}
                            lineName="Total Break Time (Minutes)"
                            dataKey="fullDate"
                            lineStroke="#8884d8"
                            lineDataKey="timeBreakAsMinutes"
                            lineName2="Average Break Time (Minutes)"
                            lineStroke2="#508f74"
                            lineDataKey2="averageBreak"
                        />
                    </div>
                </Paper>
            </div>
            <div style={{width:'100%',display:'flex', flexDirection:'row', overflow:'hidden'}}>
                <Paper className={classes.reportPapers} style={{marginLeft:'1%'}}>
                    <div className={classes.centeredReportHeaders}>
                        <span>Official Absence Time</span>
                    </div>
                    <div className={classes.chartDiv}>
                        <TimeChart data={records}
                            lineName="Total Official Absence Time (Hours)"
                            dataKey="fullDate"
                            lineStroke="#1987a6"
                            lineDataKey="timeOfficialAsHours"
                            lineName2="Average Official Absence Time (Hours)"
                            lineStroke2="#6d9644"
                            lineDataKey2="averageOfficial"
                        />
                    </div>
                </Paper>
                <Paper className={classes.reportPapers}>
                    <div className={classes.centeredReportHeaders}>
                        <span>Employees At Office Per Day</span>
                    </div>
                    <div className={classes.chartDiv}>
                        <TimeChart data={records}
                            lineName="Number of Employees"
                            dataKey="fullDate"
                            lineStroke="#1987a6"
                            lineDataKey="personnelAtWork"
                        />
                    </div>
                </Paper>
            </div>

            </Paper>
            <GeneralSnackbar open={open} setOpen={setOpen} duration={2000}
            severity="success" message="Data Loaded"  />
        </>
    )
}
