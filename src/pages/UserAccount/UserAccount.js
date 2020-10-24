import React, { useState, useEffect } from 'react'
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import PageHeader from "../../components/PageHeader";
import AccountBoxIcon from '@material-ui/icons/AccountBox';
import useTable from "../../components/useTable";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import Popup from "../../components/Popup";
import UserAccountForm from "./UserAccountForm";
import AddIcon from '@material-ui/icons/Add';
import ErrorIcon from '@material-ui/icons/Error';
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
    { id: 'username', label: 'Username' },
    { id: 'fullName', label: 'Full Name' },
    { id: 'email', label: 'Email' },
    { id: 'isAcountActiveAsString', label: 'Active' },
    { id: 'action', label: '', disableSorting: true },
]

export default function UserAccount() {
    const classes = useStyles();
    const url = 'user';

    useEffect(() => {
        fetchItems();
    }, []);

    const [records, setRecords] = useState([]);
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [openPopup, setOpenPopup] = useState(false)
    
    const fetchItems = async () => {
        setRecords(await ApiService.get(url));
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
                    return items.filter(x => x.username.toLowerCase().includes(target.value.toLowerCase()))
            }
        })
    }

    const addOrEdit = async (data, resetForm) => {
        let response = null
        if (data.id === 0){
            response = await ApiService.createUpdate(url, 0, data);
        }
        resetForm()
        setRecordForEdit(null)
        setOpenPopup(false)
        if(response != null){
            let myRecords = records.filter(record => record.id!==data.id)
            myRecords.push(response)
            setRecords(myRecords)
        }
    }

    const onDelete = async (id) => {
        await ApiService.deactivate(`${url}/toggleActive`,id);
        let updatedRecord = null;
        let updatedRecords = [];
        records.forEach(record => {
            if(record.id === id){
                updatedRecord = record;
                updatedRecord.isAccountActiveAsString = (updatedRecord.isAccountActiveAsString === 'Active' ? 'Inactive' : 'Active');
                updatedRecords.push(updatedRecord);
            }
            else{
                updatedRecords.push(record);
            }
        });
        setRecords(updatedRecords);
    }

    return (
        <>
            <PageHeader
                title="User Accounts View"
                subTitle="Accounts with System Access"
                icon={<AccountBoxIcon fontSize="large" />}
            />
            <Paper className={classes.pageContent}>
                <Toolbar>
                    <Controls.Input
                        label="Search By Username"
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
                                    <TableCell>{item.username}</TableCell>
                                    <TableCell>{item.fullName}</TableCell>
                                    <TableCell>{item.email}</TableCell>
                                    <TableCell>{item.isAccountActiveAsString}</TableCell>
                                    <TableCell>
                                        <Controls.ActionButton
                                            color="secondary"
                                            onClick={() => {
                                                onDelete(item.id);
                                        }}>
                                            <ErrorIcon fontSize="small" />
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
                title="User Account Details"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
            <UserAccountForm
                recordForEdit={recordForEdit}
                addOrEdit={addOrEdit} />
            </Popup>
        </>
    );
}