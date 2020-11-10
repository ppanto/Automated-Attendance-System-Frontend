import React, { useState, useEffect } from 'react'
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import PageHeader from "../../components/PageHeader";
import AirplanemodeActiveIcon from '@material-ui/icons/AirplanemodeActive';
import useTable from "../../components/useTable";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import Popup from "../../components/Popup";
import HolidayForm from "./HolidayForm";
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import ConfirmDialog from "../../components/ConfirmDialog";
import {ApiService} from "../../services/ApiService";

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(3),
        padding: theme.spacing(2)
    },
    searchInput: {
        width: '55%'
    },
    newButton: {
        position: 'absolute',
        right: '10px'
    }
}))

const headCells = [
    { id: 'fullDate', label: 'Holiday Date' },
    { id: 'description', label: 'Holiday Description' },
    { id: 'action', label: '', disableSorting: true },
]

export default function LeaveType() {
    const classes = useStyles();
    const url = 'calendar/holiday';

    useEffect(() => {
        fetchItems();
    }, []);

    const [records, setRecords] = useState([]);
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [openPopup, setOpenPopup] = useState(false)
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const [includeHolidaysInPast, setIncludeHolidaysInPast] = useState(false);
    const [visibleRecords, setVisibleRecords] = useState([]);

    useEffect(() => {
        setVisibleRecords(records);
    }, [records]);

    const fetchItems = async () => {
        let data = await ApiService.get(url);
        for(let i = 0; i<data.length;i++){
            data[i].aDate = new Date(data[i].fullDate);
        }
        setRecords(data);
        let today = new Date()
        let vr = data.filter(x => x.aDate>=today)
        setVisibleRecords(vr)
    };

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(visibleRecords, headCells, filterFn);

    const handleFilterChange = e => {
        setIncludeHolidaysInPast(!includeHolidaysInPast);
        if(e.target.value === true){
            setVisibleRecords(records)
        }
        else{
            let today = new Date()
            let vr = records.filter(x => x.aDate>=today)
            setVisibleRecords(vr);
        }
    }

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: items => {
                if (target.value === "")
                    return items;
                else
                    return items.filter(x => x.fullDate.toLowerCase().includes(target.value.toLowerCase())
                    || x.description.toLowerCase().includes(target.value.toLowerCase()))
            }
        })
    }

    const addOrEdit = async (data, resetForm) => {
        let response = null
        if (data.id === 0){
            response = await ApiService.createUpdate(url, 0, {fullDate: data.fullDate, description: data.description})
        }
        resetForm()
        setRecordForEdit(null)
        setOpenPopup(false)
        if(response != null){
            let myRecords = records.filter(record => record.fullDate!==data.fullDate)
            myRecords.push(response)
            setRecords(myRecords)
        }
    }

    const onDelete = async (fullDate) => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        const response = await ApiService.createUpdate(url, 0, {fullDate: fullDate, description: ''});
        if(response != null){
            setRecords(records.filter(record => record.fullDate!==fullDate));
        }
    }

    return (
        <>
            <PageHeader
                title="Holiday View"
                subTitle="New Year, National Holidays ..."
                icon={<AirplanemodeActiveIcon fontSize="large" />}
            />
            <Paper className={classes.pageContent}>
                <Toolbar>
                    <Controls.Input
                        label="Search"
                        className={classes.searchInput}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start">
                                <Search />
                            </InputAdornment>)
                        }}
                        onChange={handleSearch}
                    />
                    <div style={{display:'inline-block', marginLeft:'10px', position:'relative', top:'3px'}}>
                    <Controls.Checkbox
                        name="includePast"
                        label="Include Holidays in Past "
                        value={includeHolidaysInPast}
                        onChange={handleFilterChange}
                    />
                    </div>
                    <Controls.Button
                        text="Add New"
                        variant="outlined"
                        startIcon={<AddIcon />}
                        className={classes.newButton}
                        onClick={() => { setOpenPopup(true); setRecordForEdit(null); }}
                    />
                </Toolbar>
                <TblContainer>
                <TblHead />
                    <TableBody>
                        {
                            recordsAfterPagingAndSorting().map(item =>
                                (<TableRow key={item.fullDate}>
                                    <TableCell>{item.fullDate}</TableCell>
                                    <TableCell>{item.description}</TableCell>
                                    <TableCell>
                                        <Controls.ActionButton
                                            color="secondary"
                                            onClick={() => {
                                                setConfirmDialog({
                                                    isOpen: true,
                                                    title: 'Are you sure to delete this record?',
                                                    subTitle: "You can't undo this operation",
                                                    onConfirm: () => { onDelete(item.fullDate) }
                                                })
                                            }}>
                                            <CloseIcon fontSize="small" />
                                        </Controls.ActionButton>
                                    </TableCell>
                                </TableRow>)
                            )
                        }
                    </TableBody>
                </TblContainer>
                <TblPagination />
            </Paper>
            <Popup
                title="Holiday Details"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
            <HolidayForm
                recordForEdit={recordForEdit}
                addOrEdit={addOrEdit} />
            </Popup>
            <ConfirmDialog
                confirmDialog={confirmDialog}
                setConfirmDialog={setConfirmDialog}
            />
        </>
    );
}