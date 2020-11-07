import React, {useState, useEffect} from 'react'
import {ReportHeader} from './ReportHeader';
import { ApiService } from "../../services/ApiService";
import Controls from "../../components/controls/Controls";
import { makeStyles, Paper } from "@material-ui/core";
import {WorkTimeChart} from './Charts/WorkTimeChart';
import {TimeChart} from './Charts/TimeChart';

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
}))

export const ChartsReport = () => {
    const url = 'report/chart'
    const classes = useStyles();

    const [endDate, setEndDate] = useState(new Date())
    const startDateAtBeggining = new Date()
    startDateAtBeggining.setTime(endDate.getTime()-(7*24*3600000));
    const [startDate, setStartDate] = useState(startDateAtBeggining)
    const [records, setRecords] = useState([]);

    useEffect(() => {
        fetchRecords(startDate, endDate);
        // eslint-disable-next-line
    }, [])

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
        for(let i=0; i<data.length; i++){
            data[i].timeWorkedAsHours = Math.floor( (data[i].totalTimeWorked / 1000 / 60 / 60) );
            data[i].timeBreakAsMinutes = Math.floor( (data[i].totalTimeWorked / 1000 / 60 ) );
            data[i].timeOfficialAsHours = ( (data[i].totalTimeWorked / 1000 / 60 / 60).toFixed(2) );
        }
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

    return (
        <>
            <ReportHeader headerText="Report - Charts" />

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


            <div style={{width:'100%',display:'flex', flexDirection:'row', overflow:'hidden'}}>
                <Paper className={classes.reportPapers} style={{marginLeft:'1%'}}>
                    <div className={classes.centeredReportHeaders}>
                        <span>Total Work Time</span>
                    </div>
                    <div>
                        <WorkTimeChart data={records} />
                    </div>
                </Paper>
                <Paper className={classes.reportPapers}>
                    <div className={classes.centeredReportHeaders}>
                        <span>Total Break Time</span>
                    </div>
                    <div>
                        <TimeChart data={records}
                            lineName="Break Time (Minutes)"
                            dataKey="fullDate"
                            lineStroke="#ded357"
                            lineDataKey="timeBreakAsMinutes"
                        />
                    </div>
                </Paper>
            </div>
            <div style={{width:'100%',display:'flex', flexDirection:'row', overflow:'hidden'}}>
                <Paper className={classes.reportPapers} style={{marginLeft:'1%'}}>
                    <div className={classes.centeredReportHeaders}>
                        <span>Total Official Absence Time</span>
                    </div>
                    <div>
                        <TimeChart data={records}
                            lineName="Official Absence Time (Hours)"
                            dataKey="fullDate"
                            lineStroke="#367354"
                            lineDataKey="timeOfficialAsHours"
                        />
                    </div>
                </Paper>
                <Paper className={classes.reportPapers}>
                    <div className={classes.centeredReportHeaders}>
                        <span>Employees At Office Per Day</span>
                    </div>
                    <div>
                        <TimeChart data={records}
                            lineName="Number of Employees"
                            dataKey="fullDate"
                            lineStroke="#f5672a"
                            lineDataKey="personnelAtWork"
                        />
                    </div>
                </Paper>
            </div>

            </Paper>
        </>
    )
}