import React, {useState, useEffect} from 'react'
import { makeStyles, Paper, InputAdornment } from "@material-ui/core";
import { ApiService } from "../../services/ApiService";
import { DataGrid } from '@material-ui/data-grid';
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import IconButton from '@material-ui/core/IconButton';
import SearchIcon from '@material-ui/icons/Search';
import IsDateValid from '../../helpers/IsDateValid';
import {GeneralSnackbar} from '../../components/GeneralSnackbar'

const useStyles = makeStyles(theme => ({
    controlsStyle:{
        paddingLeft: '6px',
        paddingRight: '6px',
    }
}))

export const Tabular2 = (props) => {
    
    const {
        searchByEmployeeFilter,
        setSearchByEmployeeFilter,
        startDate,
        setStartDate,
        trackChange
    } = props;
    const url = 'attendance-action/by-action'
    const classes = useStyles();
    const [records, setRecords] = useState([]);
    const [visibleRecords, setVisibleRecords] = useState([]);
    const [endDate, setEndDate] = useState(() => {
        var aDate = new Date(startDate);
        aDate.setDate(aDate.getDate() + 7); // for next 7 days
        return aDate;
    });
    const [open, setOpen] = useState(false)

    useEffect(() => {
        fetchRecords(startDate, endDate);
        // eslint-disable-next-line
    }, [])
    useEffect(() => {
        fetchRecords(startDate, endDate);
        // eslint-disable-next-line
    }, [trackChange])
    useEffect(() => {
        setVisibleRecords(records);
    }, [records])

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
        data.forEach(item => {
            item.dateAsString = item.dateTime.slice(0,10)
            item.timeAsString = item.dateTime.slice(11,19)

            // eslint-disable-next-line
            if(item.personnelId == null){
                item.personnelName = "Unknown";
            }
        })
        setRecords(data)
    }

    const handleFilterByDate = e => {
        setSearchByEmployeeFilter('');
        let target = e.target;
        if(target.name === 'startDate'){
            setStartDate(target.value)
        }
        else if(target.name === 'endDate'){
            setEndDate(target.value)
        }
    }
    const handleSearch = e => {
        let target = e.target;
        setSearchByEmployeeFilter(e.target.value);
        setVisibleRecords(records.filter(x => 
            x.personnelName.toLowerCase().includes(target.value.toLowerCase())
        ))
    }

    const columns = [
        { field: 'personnelName', headerName: 'Full Name', width: 250 },
        { field: 'dateAsString', headerName: 'Date', width: 250 },
        { field: 'timeAsString', headerName: 'Time', width: 250 },
        { field: 'event', headerName: 'Event', width: 250 },
    ];

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
                        value={searchByEmployeeFilter}
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
                <IconButton onClick={() => {
                    if(!IsDateValid(startDate, endDate)) return;
                    setSearchByEmployeeFilter("")
                    setOpen(true);
                    fetchRecords(startDate, endDate)
                    }}>
                    <SearchIcon fontSize="large"  />
                </IconButton> 
            </div>
            <div style={{ height: 650, width: '95%', marginTop:'15', marginLeft:'auto', marginRight:'auto' }}>
                <DataGrid rows={visibleRecords} columns={columns} pageSize={10} />
            </div>
            <GeneralSnackbar open={open} setOpen={setOpen} duration={2000}
            severity="success" message="Data Loaded"  />
        </Paper>
    )
}
