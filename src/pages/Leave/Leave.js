import React, { useState, useEffect } from 'react'
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import PageHeader from "../../components/PageHeader";
import useTable from "../../components/useTable";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import Popup from "../../components/Popup";
import LeaveForm from "./LeaveForm";
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CloseIcon from '@material-ui/icons/Close';
import ConfirmDialog from "../../components/ConfirmDialog";
import {ApiService} from "../../services/ApiService";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(3),
        padding: theme.spacing(2)
    },
    searchInput: {
        width: '35%'
    },
    newButton: {
        position: 'absolute',
        right: '10px'
    }
}))

const headCells = [
    { id: 'date', label: 'Date' },
    { id: 'personnelFullName', label: 'Employee' },
    { id: 'leaveTypeName', label: 'Leave Identifier' },
    { id: 'leaveIsApproved', label: 'Approved' },
    { id: 'action', label: '', disableSorting: true },
]

export default function Leave() {
    const classes = useStyles();
    const url = 'leave';

    useEffect(() => {
        fetchItems();
    }, []);

    const [records, setRecords] = useState([]);
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [openPopup, setOpenPopup] = useState(false)
    const [dateFilter, setDateFilter] = useState(new Date())
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    
    const fetchItems = async (aDate = new Date()) => {
        let dateAsString = aDate.getFullYear() + '-' + (aDate.getMonth()+1) + '-' + aDate.getDate();
        const response = await ApiService.get(`${url}?date=${dateAsString}`);
        for(let i = 0;i<response.length;i++){
            let responseApproved = response[i]['approved'];
            // eslint-disable-next-line
            if(responseApproved == "True" || responseApproved == true){
                response[i].leaveIsApproved = "Yes"
            }
            else{
                response[i].leaveIsApproved = "No"
            }
        }
        setRecords(response);
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
                    return items.filter(x => x.personnelFullName.toLowerCase().includes(target.value.toLowerCase()))
            }
        })
    }

    const handleFilterByDate = e => {
        let target = e.target;
        setDateFilter(target.value);
        fetchItems(target.value);
    }

    const addOrEdit = async (data, resetForm) => {
        let response = await ApiService.createUpdate(url, data.id, data)
        resetForm()
        setRecordForEdit(null)
        setOpenPopup(false)
        let myRecords = records.filter(record => record.id!==data.id)
        if(response != null){
            let responseApproved = response['approved'];
            // eslint-disable-next-line
            if(responseApproved == "True" || responseApproved == true){
                response.leaveIsApproved = "Yes"
            }
            else{
                response.leaveIsApproved = "No"
            }
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
        await ApiService.deleteObj(url, id)
        setRecords(records.filter(record => record.id!==id));
    }

    return (
        <>
            <PageHeader
                title="Leave View"
                subTitle="Sick days, vacation time ..."
                icon={<ExitToAppIcon fontSize="large" />}
            />
            <Paper className={classes.pageContent}>
                <Toolbar>
                    <Controls.Input
                        label="Search By Employee"
                        className={classes.searchInput}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start">
                                <Search />
                            </InputAdornment>)
                        }}
                        onChange={handleSearch}
                    />
                    <Controls.DatePicker
                        name="filterDate"
                        label="Date"
                        value={dateFilter}
                        onChange={handleFilterByDate}
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
                                    <TableCell>{item.date}</TableCell>
                                    <TableCell>{item.personnelFullName}</TableCell>
                                    <TableCell>{item.leaveTypeName}</TableCell>
                                    <TableCell>{item.leaveIsApproved}</TableCell>
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
                title="Leave Details"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
            <LeaveForm
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