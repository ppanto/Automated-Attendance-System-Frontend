import React, { useState, useEffect } from 'react'
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import PageHeader from "../../components/PageHeader";
import useTable from "../../components/useTable";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import Popup from "../../components/Popup";
import ShiftMapperForm from "./ShiftMapperForm";
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import {ApiService} from "../../services/ApiService";
import DateRangeIcon from '@material-ui/icons/DateRange';
import CloseIcon from '@material-ui/icons/Close';
import ConfirmDialog from "../../components/ConfirmDialog";

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(3),
        padding: theme.spacing(2)
    },
    searchInput: {
        width: '75%'
    },
    newButton: {
        position: 'absolute',
        right: '10px'
    }
}))

const headCells = [
    { id: 'personnelFullName', label: 'Full Name' },
    { id: 'shiftTypeName', label: 'Shift' },
    { id: 'startDate', label: 'Start Date' },
    { id: 'endDate', label: 'End Date' },
    { id: 'workTime', label: 'Work Time' },
    { id: 'action', label: '', disableSorting: true },
]

export default function ShiftMapper() {
    const classes = useStyles();
    const url = 'personnel-shift';

    useEffect(() => {
        fetchItems();
    }, []);

    const [records, setRecords] = useState([]);
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [openPopup, setOpenPopup] = useState(false)
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const [ongoingOnly, setOngoingOnly] = useState(true);
    const [visibleRecords, setVisibleRecords] = useState([]);

    useEffect(() => {
        setVisibleRecords(records);
    }, [records]);

    const fetchItems = async () => {
        const data = await ApiService.get(`${url}/ongoing`)
        data.forEach(shift => {
            shift.startTimeAsString = `${shift.startTime.slice(0,5)}`;
            shift.endTimeAsString = `${shift.endTime.slice(0,5)}`;
            shift.aDate = new Date(shift.endDate);
        })
        console.log(data)
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
        setOngoingOnly(!ongoingOnly);
        if(e.target.value === true){
            let today = new Date()
            let vr = records.filter(x => x.aDate>=today)
            setVisibleRecords(vr);
        }
        else{
            setVisibleRecords(records)
        }
    }

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: items => {
                if (target.value === "")
                    return items;
                else
                    return items.filter(x => x.personnelFullName.toLowerCase().includes(target.value.toLowerCase()))
            }
        })
    }

    const addOrEdit = async (data, resetForm) => {
        const response = await ApiService.createUpdate(url, data.id, data);
        resetForm()
        setRecordForEdit(null)
        setOpenPopup(false)
        if(response != null){
            let myRecords = records.filter(record => record.id!==data.id)
            myRecords.push(response)
            setRecords(myRecords)
        }
    }

    const openInPopup = item => {
        setRecordForEdit(item)
        setOpenPopup(true)
    }

    const onDelete = async (id) => {
        setConfirmDialog({
            ...confirmDialog,
            isOpen: false
        })
        await ApiService.deleteObj(url, id);
        setRecords(records.filter(record => record.id!==id));
    }

    return (
        <>
            <PageHeader
                title="Shift Mapper View"
                subTitle="Add employees to shifts"
                icon={<DateRangeIcon fontSize="large" />}
            />
             <Paper className={classes.pageContent} style={{overflowX:'scroll'}}>
                <Toolbar>
                <Controls.Input
                        label="Search By Employee Name"
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
                        name="includeAll"
                        label="Ongoing Shifts Only"
                        value={ongoingOnly}
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
                            (<TableRow key={item.id}>
                                <TableCell>{item.personnelFullName}</TableCell>
                                <TableCell>{item.shiftTypeName}</TableCell>
                                <TableCell>{item.startDate}</TableCell>
                                <TableCell>{item.endDate}</TableCell>
                                <TableCell>{item.startTimeAsString} - {item.endTimeAsString}</TableCell>
                                <TableCell>
                                <Controls.ActionButton
                                            color="primary"
                                            onClick={() => { openInPopup(item) }}>
                                            <EditOutlinedIcon fontSize="small" />
                                        </Controls.ActionButton>
                                        <Controls.ActionButton
                                            color="secondary"
                                            onClick={() => {
                                                setConfirmDialog({
                                                    isOpen: true,
                                                    title: 'Are you sure to delete this record?',
                                                    subTitle: "You can't undo this operation",
                                                    onConfirm: () => { onDelete(item.id) }
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
                title="Employee in Shift Details"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <ShiftMapperForm
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