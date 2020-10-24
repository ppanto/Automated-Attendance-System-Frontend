import React, { useState, useEffect } from 'react'
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import PageHeader from "../../components/PageHeader";
import TimerIcon from '@material-ui/icons/Timer';
import useTable from "../../components/useTable";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import Popup from "../../components/Popup";
import ShiftTypeForm from "./ShiftTypeForm";
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
        width: '75%'
    },
    newButton: {
        position: 'absolute',
        right: '10px'
    }
}))

const headCells = [
    { id: 'name', label: 'Shift Type' },
    { id: 'startTimeAsString', label: 'Start Time' },
    { id: 'endTimeAsString', label: 'End Time' },
    { id: 'action', label: '', disableSorting: true },
]

export default function LeaveType() {
    const classes = useStyles();
    const url = 'shift-type'

    useEffect(() => {
        fetchItems();
    }, []);

    const [records, setRecords] = useState([]);
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [openPopup, setOpenPopup] = useState(false)
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    
    const fetchItems = async () => {
        const data = await ApiService.get(url)
        data.forEach(shift => {
            shift.startTimeAsString = `${shift.startTime.slice(0,5)}`;
            shift.endTimeAsString = `${shift.endTime.slice(0,5)}`;
        })
        setRecords(data);
      };

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(records, headCells, filterFn);

    const handleSearch = e => {
        let target = e.target;
        setFilterFn({
            fn: items => {
                if (target.value === "")
                    return items;
                else
                    return items.filter(x => x.name.toLowerCase().includes(target.value.toLowerCase()))
            }
        })
    }

    const addOrEdit = async (data, resetForm) => {
        let response = null
        if (data.id === 0){
            response = await ApiService.createUpdate(url, 0, data);
        }
        resetForm()
        setOpenPopup(false)
        if(response != null){
            let myRecords = records.filter(record => record.id!==data.id)
            response.startTimeAsString = `${response.startTime.slice(0,5)}`;
            response.endTimeAsString = `${response.endTime.slice(0,5)}`;
            myRecords.push(response)
            setRecords(myRecords)
        }
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
                title="Shift Type View"
                subTitle="Daily schedule, night schedule ..."
                icon={<TimerIcon fontSize="large" />}
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
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.startTimeAsString}</TableCell>
                                    <TableCell>{item.endTimeAsString}</TableCell>
                                    <TableCell>
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
                title="Shift Type Details"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
            <ShiftTypeForm
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