import React, {useState, useEffect} from 'react'
import { Paper, makeStyles } from "@material-ui/core";
import { ApiService } from "../../services/ApiService";
import Controls from "../../components/controls/Controls";
import {AttendanceStatusChart} from "./Charts/AttendanceStatusChart";
import {DayStatusChart} from "./Charts/DayStatusChart";
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from "@material-ui/core/styles";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import { DataGrid } from '@material-ui/data-grid';
import {ReportHeader} from './ReportHeader';
import IsDateValid from '../../helpers/IsDateValid';
import {GeneralSnackbar} from '../../components/GeneralSnackbar'

const useStyles = makeStyles(theme => ({
    reportPapers: {
        borderTop:'3px solid rgb(224,148,239)',
        marginTop:'1%',
        marginBottom:'2%',
        marginRight:'1%',
        height:'530px',
    },
    centeredReportHeaders:{
        marginLeft:'auto', marginRight:'auto', width:'270px',fontWeight:'bold',
        marginTop:'4px', fontSize: '17px'
    },
    myTypography:{
        display: 'block',
        width: '100%'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: 'bold',
    },
    bottomReportBox:{
        marginTop:'1%',
        marginBottom:'1%',
        marginRight:'1%',
        height:'530px',
        width:'50%'
    },
}))

export const DailyReport = () => {
    const classes = useStyles();

    const url = 'report/daily'
    const [dateFilter, setDateFilter] = useState(new Date());
    const [records, setRecords] = useState({
        currentlyAtWork: [],
        currentlyNotAtWork: []
    });
    const [isExpanded, setIsExpanded] = useState(true);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchRecords(new Date());
    }, [])
    const fetchRecords = async (dateStart) => {
        if(!IsDateValid(dateStart)) return;
        const params = 
            "date=" +
            dateStart.getFullYear() 
            + "-" + 
            (dateStart.getMonth()+1) 
            + "-" +
            dateStart.getDate()
        const data = await ApiService.get(`${url}?${params}`)
        setRecords(data)
        setOpen(true)
    }
    const columns = [
        { field: 'fullName', headerName: 'Full Name', width: 220 },
        { field: 'department', headerName: 'Department', width: 220  },
        { field: 'title', headerName: 'Title', width: 220  },
    ];
    const handleFilterByDate = e =>{
        fetchRecords(e.target.value)
        setDateFilter(e.target.value);
    }
    const AccordionSummary = withStyles({
        root: {
          flexDirection: "column"
        },
        content: {
          marginBottom: 0
        },
        expandIcon: {
          marginRight: 0,
          paddingTop: 0
        }
      })(MuiAccordionSummary);

    return (
        <>
        <ReportHeader headerText="Daily Report" />
        <Paper>
        <div style={{textAlign:'center', width: '25%', marginLeft:'auto', marginRight:'auto', marginTop:'10px', padding:'4px'}}>
                <Controls.DatePicker
                    name="dateFilter"
                    label="Date"
                    value={dateFilter}
                    onChange={handleFilterByDate}
                />
        </div>
        <div style={{width:'100%',display:'flex', flexDirection:'row', overflow:'hidden'}}>
            <Paper className={classes.reportPapers} style={{marginLeft:'1%', width:'60%', minWidth:'450px'}}>
                <div className={classes.centeredReportHeaders}>
                    <span>Employees - Attendance Status</span>
                </div>
                <div style={{width:'100%'}}>
                <div style={{width:'94%', margin:'auto'}}>
                    <AttendanceStatusChart 
                    totalPersonnel = {records.totalPersonnel}
                    present = {records.present}
                    absent = {records.absent}
                    approvedLeave = {records.approvedLeave}
                    unapprovedLeave = {records.unapprovedLeave}
                    />
                </div>
                </div>
            </Paper>
            <Paper className={classes.reportPapers} style={{width:'37%',minWidth:'350px'}}>
                <div className={classes.centeredReportHeaders}>
                    <span>Current Day Status</span>
                </div>
                <div>
                    <DayStatusChart 
                    In = {records.checkedIn}
                    yetToCheckIn = {records.yetToCheckIn}
                    checkedOut = {records.checkedOut}
                    />
                </div>
            </Paper>
        </div>
        <div>
        <Accordion expanded={isExpanded} style={{marginBottom:'15px'}}>
                <AccordionSummary
                    onClick={() => setIsExpanded(!isExpanded)}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                <Typography className={classes.heading}>Employees In and Out</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography className={classes.myTypography} component={'div'} variant={'body2'}>
                    <div style={{width:'100%',display:'flex', flexDirection:'row', overflow:'hidden'}}>
                        <div className={classes.bottomReportBox} style={{marginLeft:'1%'}}>
                            <div style={{fontWeight:'bold', width:'20%', margin:'auto'}}>In</div>
                        <DataGrid rows={records.currentlyAtWork} columns={columns} pageSize={20} />
                        </div>
                        <div className={classes.bottomReportBox}>
                            <div style={{fontWeight:'bold', width:'20%', margin:'auto'}}>Out</div>
                        <DataGrid rows={records.currentlyNotAtWork} columns={columns} pageSize={20} />
                        </div>
                    </div>
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </div>
        </Paper>
        <GeneralSnackbar open={open} setOpen={setOpen} duration={2000}
            severity="success" message="Data Loaded"  />
        </>
    )
}
