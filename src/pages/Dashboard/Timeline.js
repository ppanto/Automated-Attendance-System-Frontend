import React, {useState, useEffect} from 'react'
import { Paper, makeStyles, Grid, InputAdornment } from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { BASE_PATH } from '../../config/ApiConfig';
import { ApiService } from "../../services/ApiService";
import Controls from "../../components/controls/Controls";
import SpecificLeaveForm from "./SpecificLeaveForm";
import Popup from "../../components/Popup";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import TablePagination from '@material-ui/core/TablePagination';
import {TimelineComponent} from '../../components/TimelineComponent';
import {Timescale} from '../../components/Timescale';
import IsDateValid from '../../helpers/IsDateValid';
import {GeneralSnackbar} from '../../components/GeneralSnackbar'

const useStyles = makeStyles(theme => ({
    centeredHeader: {
        textAlign: 'center',
        marginTop: '10px',
        padding: '5px'
    },
    centeredText:{
        textAlign: 'center',
    },
    boldText:{
        fontWeight: 'bold'
    },
    columnHeads:{
        fontSize:'17px'
    },
    vcenter:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerImage:{
        margin: 'auto',
        marginLeft:'auto',
        marginRight:'auto'
    },
    seperatedGrid:{
        marginTop: '15px',
        marginBottom:'15px',
    }
}))
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const Timeline = (props) => {
    const {conn} = props;
    const classes = useStyles();

    const url = 'attendance-action'
    const [isHoliday, setIsHoliday] = useState(false);
    const [isWeekend, setIsWeekend] = useState(false);
    const [dateFilter, setDateFilter] = useState(new Date());
    const [records, setRecords] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [openPopup, setOpenPopup] = useState(false)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [specialId, setSpecialId] = useState(0);
    const [open, setOpen] = useState(false);
    const [searchByEmployeeFilter, setSearchByEmployeeFilter] = useState('');
    const [visibleRecords, setVisibleRecords] = useState([]);

    useEffect(() => {
        setupSignalR();
        // eslint-disable-next-line
    },[conn])
    useEffect(() => {
        fetchRecords(dateFilter);
        // eslint-disable-next-line
    }, [])
    useEffect(() => {
        if(searchByEmployeeFilter === ''){
            setVisibleRecords(records);
        }
        else{
            setVisibleRecords(records.filter(x => 
                x.personnelFullName.toLowerCase().includes(searchByEmployeeFilter.toLowerCase())
            ))
        }
        // eslint-disable-next-line
    }, [records])
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
        setIsHoliday(data.holiday)
        setIsWeekend(data.weekend)
        setRecords(data.attendanceActionDatePersonnelResponses)
    }
    const setupSignalR = async () =>{
        if((typeof conn !== "undefined") && (typeof conn.on === 'function')){
            conn.on('newMessage', function(message) {
                // eslint-disable-next-line
                if(!message.hasOwnProperty('personnelName') || message.personnelName == null){
                    setSnackbarMessage("Latest: Unknown User used action -> " + message.event);
                }
                else{
                    fetchRecords(dateFilter)
                    setSnackbarMessage("Latest: " + message.personnelName + " -> " + message.event);
                    setSpecialId(message.id)
                }
                
                setOpenSnackbar(true)
                //setSpecialId(message.id)
                setTimeout(function () {
                    setSpecialId(0)
                }, 6000)
            })
        }
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenSnackbar(false);
    };
    const handleFilterByDate = e =>{
        setDateFilter(e.target.value);
        if(!IsDateValid(e.target.value)) return;
        fetchRecords(e.target.value)
        setOpen(true)
    }
    const addOrEdit = async (data, resetForm) => {
        await ApiService.createUpdate('leave', data.id, data)
        resetForm()
        setRecordForEdit(null)
        setOpenPopup(false)
        fetchRecords(dateFilter);
    }
    const openInPopup = item => {
        setRecordForEdit(item)
        setOpenPopup(true)
    }
    const onDelete = async (id, resetForm) => {
        await ApiService.deleteObj(`leave`, id)
        resetForm()
        setRecordForEdit(null)
        setOpenPopup(false)
        fetchRecords(dateFilter);
    }
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const handleSearch = e => {
        let target = e.target;
        setSearchByEmployeeFilter(e.target.value);
        setVisibleRecords(records.filter(x => 
            x.personnelFullName.toLowerCase().includes(target.value.toLowerCase())
        ))
    }

    return (
        <Paper>
            <div style={{textAlign:'center', marginTop: '20px', width: '70%', marginLeft:'auto', marginRight:'auto', marginBottom: '5px'}}>
                <Controls.Input
                        label="Search By Employee"
                        InputProps={{
                            startAdornment: (<InputAdornment position="start">
                                <Search />
                            </InputAdornment>)
                        }}
                        onChange={handleSearch}
                        value={searchByEmployeeFilter}
                        style={{paddingRight:'4px'}}
                />
                <Controls.DatePicker
                    name="dateFilter"
                    label="Date"
                    value={dateFilter}
                    onChange={handleFilterByDate}
                />
            </div>
            <div className={classes.centeredHeader}>
                {isHoliday ? 
                (<h3 >Holiday</h3>)
                :
                ("")  
                }
                {isWeekend ? 
                (<h3 >Weekend</h3>)
                :
                ("")  
                }
            </div>

            <div>
                <Grid container>
                    <Grid item xs={1} >
                        <div className={classes.centeredText}>
                        <span className={`${classes.boldText} ${classes.columnHeads}`}>Photo</span>
                        </div>
                    </Grid>
                    <Grid item xs={1}>
                        <div className={classes.centeredText}>
                        <span className={`${classes.boldText} ${classes.columnHeads}`}>Employee</span>
                        </div>
                    </Grid>
                    <Grid item xs={1}>
                        <div className={classes.centeredText}>
                        <span className={`${classes.boldText} ${classes.columnHeads}`}>Check-in</span>
                        </div>
                    </Grid>
                    <Grid item xs={7}>
                    </Grid>
                    <Grid item xs={1}>
                        <div className={classes.centeredText}>
                        <span className={`${classes.boldText} ${classes.columnHeads}`}>Check-out</span>
                        </div>
                    </Grid>
                    <Grid item xs={1}>
                        <div className={classes.centeredText}>
                        <span className={`${classes.boldText} ${classes.columnHeads}`}>Absence</span>
                        </div>
                    </Grid>
                </Grid>

                {visibleRecords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .filter(row => row.personnelId != null)
                .map((row, index) => {
                // eslint-disable-next-line
                //if(row.personnelId == null) continue;

                let item = {};
                if(row.attendanceActionLeavePartialResponse == null){
                    item.id = 0;
                    item.leaveTypeId = '';
                    item.personnelId = parseInt(row.personnelId);
                    item.startDate = dateFilter;
                    item.approved = true;
                    item.description = '';
                }
                else{
                    item.id = row.attendanceActionLeavePartialResponse.id;
                    item.leaveTypeId = parseInt(row.attendanceActionLeavePartialResponse.leaveTypeId);
                    item.personnelId = parseInt(row.personnelId);
                    item.startDate = dateFilter;
                    item.approved = row.attendanceActionLeavePartialResponse.leaveApproved;
                    item.description = row.attendanceActionLeavePartialResponse.description;
                }
                let startTimeSetAlready = false
                let startTime = "--:--"
                let endTime = "--:--"
                if(row.attendanceActionSingularResponseList != null){
                    row.attendanceActionSingularResponseList.forEach((singular) => {
                        if(singular.event === "Work Start" && !startTimeSetAlready){
                            startTime = singular.dateTime.slice(11,16);
                            startTimeSetAlready = true;
                        }
                        else if(singular.event === "Work End"){
                            endTime = singular.dateTime.slice(11,16);
                        }
                    })
                }
                
                return (
                <Grid container key={index} className={classes.seperatedGrid}>
                    <Grid item xs={1}>
                        <div className={classes.vcenter}>
                        <img
                        className={classes.centerImage}
                        style = {{width: '75px', height:'75px', objectFit: 'cover', borderRadius:'50%'}}
                        src = {`${BASE_PATH}/personnel/image/get/${row.personnelId}`}
                        alt = ''
                        >
                        </img>
                        </div>
                    </Grid>
                    <Grid item xs={1} style={{height:'80px'}}>
                        <div className={classes.centeredText}>
                        <span style={{lineHeight:'80px'}} className={classes.boldText}>{row.personnelFullName}</span>
                        </div>
                    </Grid>
                    <Grid item xs={1} style={{height:'80px'}}>
                        <div className={classes.centeredText}>
                        <span style={{lineHeight:'80px'}} className={classes.boldText}>{startTime}</span>
                        </div>
                    </Grid>
                    <Grid item xs={7} style={{height:'80px'}}>
                        <TimelineComponent actions={row.attendanceActionSingularResponseList} leave={row.attendanceActionLeavePartialResponse} specialId={specialId} />
                    </Grid>
                    <Grid item xs={1} style={{height:'80px'}}>
                        <div className={classes.centeredText}>
                        <span style={{lineHeight:'80px'}} className={classes.boldText}>{endTime}</span>
                        </div>
                    </Grid>
                    <Grid item xs={1} style={{height:'80px'}}>
                        <div className={classes.centeredText} style={{marginTop:'15px'}}>
                        <Controls.ActionButton 
                            color="primary"
                            onClick={() => { openInPopup(item) }}>
                            {row.attendanceActionLeavePartialResponse == null ? (
                                <span>Add Absence</span>
                            ) : (
                                <span>Absent</span>
                            )}
                        </Controls.ActionButton>
                        </div>
                    </Grid>
                </Grid>
                )
                })}
                <Timescale />
            </div>

            <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={records.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
            />
            <Popup
                title="Leave Details"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
            <SpecificLeaveForm
                recordForEdit={recordForEdit}
                addOrEdit={addOrEdit}
                deleteItem={onDelete} />
            </Popup>
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

            <GeneralSnackbar open={open} setOpen={setOpen} duration={2000}
            severity="success" message="Data Loaded"  />
        </Paper>
    )
}
