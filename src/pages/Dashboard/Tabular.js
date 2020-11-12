import React, {useState, useEffect} from 'react'
import { Paper, makeStyles } from "@material-ui/core";
import { ApiService } from "../../services/ApiService";
import Controls from "../../components/controls/Controls";
import { HubConnectionBuilder } from '@microsoft/signalr';
import TableContainer from '@material-ui/core/TableContainer';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import SpecificLeaveForm from "./SpecificLeaveForm";
import Popup from "../../components/Popup";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import TablePagination from '@material-ui/core/TablePagination';
import IsDateValid from '../../helpers/IsDateValid';
import {GeneralSnackbar} from '../../components/GeneralSnackbar'

const useStyles = makeStyles(theme => ({
    centeredHeader: {
        textAlign: 'center',
        marginTop: '10px',
        padding: '5px'
    },
    redFont:{
        color: 'red',
    },
    redBordered:{
        border: '1px solid red'
    }
}))
function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const Tabular = () => {
    const classes = useStyles();

    const url = 'attendance-action'
    const [isHoliday, setIsHoliday] = useState(false);
    const [isWeekend, setIsWeekend] = useState(false);
    const [dateFilter, setDateFilter] = useState(new Date());
    const [records, setRecords] = useState([]);
    const [visibleRecords, setVisibleRecords] = useState([]);
    const [irregularOnly, setIrregularOnly] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [openPopup, setOpenPopup] = useState(false)
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [show, setShow] = useState(false);
    const [showRowId, setShowRowId] = useState(0);
    const [open, setOpen] = useState(false)

    useEffect(() => {
        fetchRecords(new Date());
        setupSignalR();
        // eslint-disable-next-line
    }, [])
    useEffect(() => {
        setVisibleRecords(records);
        setIrregularOnly(false);
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
        let properUrl = await ApiService.get('signalr/negotiate')
        const connection = new HubConnectionBuilder()
            .withUrl(properUrl.url, {accessTokenFactory: () => properUrl.accessToken})
            .withAutomaticReconnect()
            .build();
        connection.on('newMessage', function(message) {
            fetchRecords(dateFilter)
            setSnackbarMessage("Latest: " + message.personnelName + " -> " + message.event);
            setOpenSnackbar(true)
            setShowRowId(message.id)
            setShow(true)
            setTimeout(function () {
                setShow(false)
            }, 6000)
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
    const handleFilterByDate = e =>{
        setDateFilter(e.target.value);
        if(!IsDateValid(e.target.value)) return;
        fetchRecords(e.target.value)
        setOpen(true);
    }
    const handleIrregularOnly = e =>{
        setIrregularOnly(e.target.value);
        let filteredResults;
        if(e.target.value === true){
            filteredResults = records.filter(record => record.startTimeRegular === false || record.endTimeRegular === false);
        }
        else{
            filteredResults = records;
        }
        setVisibleRecords(filteredResults);
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

    return (
        <Paper>
            <div style={{textAlign:'center', marginTop: '20px', width: '25%', marginLeft:'auto', marginRight:'auto', marginBottom: '5px'}}>
                <Controls.DatePicker
                    name="dateFilter"
                    label="Date"
                    value={dateFilter}
                    onChange={handleFilterByDate}
                />
                <Controls.Checkbox
                        name="irregularOnly"
                        label="Only Irregularities"
                        value={irregularOnly}
                        onChange={handleIrregularOnly}
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

            <div style={{ height: 750, width: '95%', marginTop:'15', marginLeft:'auto', marginRight:'auto' }}>
                <TableContainer component={Paper}>
                <Table aria-label="customized table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Full Name</TableCell>
                        <TableCell align="right">Shift Start Time</TableCell>
                        <TableCell align="right">Start Time</TableCell>
                        <TableCell align="right">Break Start</TableCell>
                        <TableCell align="right">Break End</TableCell>
                        <TableCell align="right">Official A. Start</TableCell>
                        <TableCell align="right">Official A. End</TableCell>
                        <TableCell align="right">End Time</TableCell>
                        <TableCell align="right">Shift End Time</TableCell>
                        <TableCell align="center">Absence</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {visibleRecords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                            let shiftStartTime = '';
                            let shiftEndTime = '';
                            if(row.attendanceActionShiftPartialResponse != null){
                                shiftStartTime = row.attendanceActionShiftPartialResponse.shiftStartTime.slice(0,5)
                                shiftEndTime = row.attendanceActionShiftPartialResponse.shiftEndTime.slice(0,5)
                            }
                            let workStartTime = '';
                            let workEndTime = '';
                            let breakStartTime = '';
                            let breakEndTime = '';
                            let officialStartTime = '';
                            let officialEndTime = '';

                            let workStartTimeId = -1;
                            let workEndTimeId = -1;
                            let breakStartTimeId = -1;
                            let breakEndTimeId = -1;
                            let officialStartTimeId = -1;
                            let officialEndTimeId = -1;
                            if(row.attendanceActionSingularResponseList != null){
                                row.attendanceActionSingularResponseList.forEach((singular) => {
                                    if(singular.event === "Work Start"){
                                        workStartTime = singular.dateTime.slice(11,19);
                                        workStartTimeId = singular.attendanceActionId;
                                    }
                                    else if(singular.event === "Break Start"){
                                        breakStartTime = singular.dateTime.slice(11,19);
                                        breakStartTimeId = singular.attendanceActionId;
                                    }
                                    else if(singular.event === "Official Absence Start"){
                                        officialStartTime = singular.dateTime.slice(11,19);
                                        officialStartTimeId = singular.attendanceActionId;
                                    }
                                    else if(singular.event === "Work End"){
                                        workEndTime = singular.dateTime.slice(11,19);
                                        workEndTimeId = singular.attendanceActionId;
                                    }
                                    else if(singular.event === "Break End"){
                                        breakEndTime = singular.dateTime.slice(11,19);
                                        breakEndTimeId = singular.attendanceActionId;
                                    }
                                    else if(singular.event === "Official Absence End"){
                                        officialEndTime = singular.dateTime.slice(11,19);
                                        officialEndTimeId = singular.attendanceActionId;
                                    }
                                })
                            }
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
                            return (
                                <TableRow
                                    hover
                                    key={index}
                                >
                                    <TableCell>{row.personnelFullName}</TableCell>
                                    <TableCell align="right">{shiftStartTime}</TableCell>
                                    <TableCell align="right"
                                        //className={(row.startTimeRegular ? "" : classes.redFont)}
                                       className={`${row.startTimeRegular ? "" : `${classes.redFont}`} ${(workStartTimeId === showRowId && show) ? classes.redBordered : ""}`}
                                    >{workStartTime}</TableCell>
                                    <TableCell align="right" className={(breakStartTimeId === showRowId && show) ? classes.redBordered : ""}>{breakStartTime}</TableCell>
                                    <TableCell align="right" className={(breakEndTimeId === showRowId && show) ? classes.redBordered : ""}>{breakEndTime}</TableCell>
                                    <TableCell align="right" className={(officialStartTimeId === showRowId && show) ? classes.redBordered : ""}>{officialStartTime}</TableCell>
                                    <TableCell align="right" className={(officialEndTimeId === showRowId && show) ? classes.redBordered : ""}>{officialEndTime}</TableCell>
                                    <TableCell align="right"
                                        className={`${row.endTimeRegular ? "" : `${classes.redFont}`} ${(workEndTimeId === showRowId && show) ? classes.redBordered : ""}`}
                                    >{workEndTime}</TableCell>
                                    <TableCell align="right">{shiftEndTime}</TableCell>
                                    <TableCell align="right">
                                            <Controls.ActionButton
                                            color="primary"
                                            onClick={() => { openInPopup(item) }}>
                                            {row.attendanceActionLeavePartialResponse == null ? (
                                                <span>Add Absence</span>
                                            ) : (
                                                <span>Absent</span>
                                            )}
                                            </Controls.ActionButton>
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={visibleRecords.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </div>


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
