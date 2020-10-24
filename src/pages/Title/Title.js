import React, { useState, useEffect } from 'react'
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import PageHeader from "../../components/PageHeader";
import TitleIcon from '@material-ui/icons/Title';
import useTable from "../../components/useTable";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import Popup from "../../components/Popup";
import TitleForm from "./TitleForm";
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
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
    { id: 'name', label: 'Title Name' },
    { id: 'addedTime', label: 'Added Time' },
    { id: 'modifiedTime', label: 'Modified Time' },
    { id: 'action', label: '', disableSorting: true },
]

export default function Title() {
    const url = 'title';
    const classes = useStyles();

    useEffect(() => {
        fetchItems();
        // eslint-disable-next-line
    }, []);

    const [records, setRecords] = useState([]);
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [openPopup, setOpenPopup] = useState(false)
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    
    const fetchItems = async () => {
        const response = await ApiService.get(url);
        for(let i = 0;i<response.length;i++){
            if(response[i]['addedTime'] != null){
                response[i]['addedTime'] = (new Date(response[i]['addedTime'])).toLocaleString('en-GB', { timeZone: 'Europe/Berlin' });
            }
            if(response[i]['modifiedTime'] != null){
                response[i]['modifiedTime'] = (new Date(response[i]['modifiedTime'])).toLocaleString('en-GB', { timeZone: 'Europe/Berlin' });
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
                    return items.filter(x => x.name.toLowerCase().includes(target.value.toLowerCase()))
            }
        })
    }
    
    const addOrEdit = async (title, resetForm) => {
        let response = null
        if(title.id === 0){
            response = await ApiService.createUpdate(url, title.id, title);
        }else{
            response = await ApiService.createUpdate(url, title.id, {'name':title.name});
        }
        resetForm()
        setRecordForEdit(null)
        setOpenPopup(false)
        if(response != null){
            let myRecords = records.filter(record => record.id!==title.id)
            if(response['addedTime'] != null){
                response['addedTime'] = (new Date(response['addedTime'])).toLocaleString('en-GB', { timeZone: 'Europe/Berlin' });
            }
            if(response['modifiedTime'] != null){
                response['modifiedTime'] = (new Date(response['modifiedTime'])).toLocaleString('en-GB', { timeZone: 'Europe/Berlin' });
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
        //await TitleService.deleteTitle(id)
        await ApiService.deleteObj(url, id)
        setRecords(records.filter(record => record.id!==id));
    }

    return (
        <>
            <PageHeader
                title="Title View"
                subTitle="Employee Titles"
                icon={<TitleIcon fontSize="large" />}
            />
            <Paper className={classes.pageContent}>
                <Toolbar>
                    <Controls.Input
                        label="Search Titles"
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
                                    <TableCell>{item.addedTime}</TableCell>
                                    <TableCell>{item.modifiedTime}</TableCell>
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
                title="Title Details"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
            <TitleForm
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