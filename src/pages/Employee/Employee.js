import React, { useState, useEffect } from 'react'
import { Paper, makeStyles, TableBody, TableRow, TableCell, Toolbar, InputAdornment } from '@material-ui/core';
import PageHeader from "../../components/PageHeader";
import PersonIcon from '@material-ui/icons/Person';
import useTable from "../../components/useTable";
import Controls from "../../components/controls/Controls";
import { Search } from "@material-ui/icons";
import Popup from "../../components/Popup";
import EmployeeForm from "./EmployeeForm";
import AddIcon from '@material-ui/icons/Add';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import ErrorIcon from '@material-ui/icons/Error';
import EmployeeImageForm from "./EmployeeImageForm";
import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import {ApiService} from "../../services/ApiService";
import { BASE_PATH } from '../../config/ApiConfig';

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
    },
}))

const headCells = [
    { id: 'image', label: 'Photo' },
    { id: 'fullName', label: 'Full Name' },
    { id: 'firstName', label: 'First Name' },
    { id: 'lastName', label: 'Last Name' },
    { id: 'email', label: 'Email' },
    { id: 'department', label: 'Department' },
    { id: 'title', label: 'Title' },
    { id: 'dateTimeJoinedAsString', label: 'Date Added' },
    { id: 'address', label: 'Address' },
    { id: 'birthDate', label: 'Birth Date' },
    { id: 'workPhone', label: 'WorkPhone' },
    { id: 'privatePhone', label: 'Private Phone' },
    { id: 'gender', label: 'Gender' },
    { id: 'activeStatusAsString', label: 'Status' },
    { id: 'action', label: '', disableSorting: true },
]

export default function Employee() {
    const classes = useStyles();
    const url = 'personnel';

    useEffect(() => {
        fetchItems();
    }, []);

    const [records, setRecords] = useState([]);
    const [titles, setTitles] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [filterFn, setFilterFn] = useState({ fn: items => { return items; } });
    const [recordForEdit, setRecordForEdit] = useState(null)
    const [recordForEditImage, setRecordForEditImage] = useState(null)
    const [openPopup, setOpenPopup] = useState(false)
    const [openPopupPhoto, setOpenPopupPhoto] = useState(false)
    const [filteredSelectForTitle, setFilteredSelectForTitle] = useState('');
    const [filteredSelectForDepartment, setFilteredSelectForDepartment] = useState('');
    const [filteredInputForSearch, setFilteredInputForSearch] = useState('');

    const fetchItems = async () => {
        setTitles(await ApiService.get(`title`));
        setDepartments(await ApiService.get(`department`));
        setRecords(await ApiService.get(url));
    };

    const {
        TblContainer,
        TblHead,
        TblPagination,
        recordsAfterPagingAndSorting
    } = useTable(records, headCells, filterFn);

    useEffect(() => {
        setFilterFn({
            fn: items => {
                if(filteredInputForSearch !== ''){
                    items = items.filter(x => x.fullName.toLowerCase().includes(filteredInputForSearch.toLowerCase()));
                }
                if(filteredSelectForTitle !== ''){
                    items = items.filter(x => x.titleId === filteredSelectForTitle);
                }
                if(filteredSelectForDepartment !== ''){
                    items = items.filter(x => x.departmentId === filteredSelectForDepartment);
                }
                return items;
            }
        })
    }, [filteredInputForSearch, filteredSelectForTitle, filteredSelectForDepartment])

    const handleSearch = e => {
        let target = e.target;
        if(target.name === 'mySearchByFullName'){
            setFilteredInputForSearch(e.target.value);
        }
        else if(target.name === 'titleId'){
            setFilteredSelectForTitle(e.target.value);
        }
        else if(target.name === 'departmentId'){
            setFilteredSelectForDepartment(e.target.value);
        }
    }

    const addOrEdit = async (data, resetForm) => {
        let response = await ApiService.createUpdate(url, data.id, data);
        resetForm()
        setRecordForEdit(null)
        setOpenPopup(false)
        if(response != null){
            let myRecords = records.filter(record => record.id!==data.id)
            myRecords.push(response)
            setRecords(myRecords)
        }
    }
    const doneWithImagePopup = () => {
        setOpenPopupPhoto(false);
    }

    const openInPopupImage = item => {
        setRecordForEditImage(item);
        setOpenPopupPhoto(true)
    }
    const openInPopup = item => {
        setRecordForEdit(item)
        setOpenPopup(true)
    }

    const onDelete = async (id) => {
        await ApiService.deactivate(`${url}/toggleActive`, id);
        let updatedRecord = null;
        let updatedRecords = [];
        records.forEach(record => {
            if(record.id === id){
                updatedRecord = record;
                updatedRecord.activeStatusAsString = (updatedRecord.activeStatusAsString === 'Active' ? 'Inactive' : 'Active');
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
                title="Employee View"
                subTitle="Employees in Organization"
                icon={<PersonIcon fontSize="large" />}
            />
             <Paper className={classes.pageContent} style={{overflowX:'scroll'}}>
                <Toolbar>
                    <Controls.Input
                        name="mySearchByFullName"
                        value={filteredInputForSearch}
                        label="Search Employees"
                        className={classes.searchInput}
                        InputProps={{
                            startAdornment: (<InputAdornment position="start">
                                <Search />
                            </InputAdornment>)
                        }}
                        onChange={handleSearch}
                    />
                    <Controls.Select
                        name="titleId"
                        label="Title"
                        value={filteredSelectForTitle}
                        onChange={handleSearch}
                        options={titles}
                        valueItem = "name"
                        myWidth='130px'
                    />
                    <Controls.Select
                        name="departmentId"
                        label="Department"
                        value={filteredSelectForDepartment}
                        onChange={handleSearch}
                        options={departments}
                        valueItem = "name"
                        myWidth='130px'
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
                                <TableCell>
                                    <img 
                                    style = {{width: '50px', height:'50px', objectFit: 'cover', borderRadius:'50%'}}
                                    src = {`${BASE_PATH}/personnel/image/get/${item.id}`}
                                    alt = ''
                                    >
                                    </img>
                                </TableCell>
                                <TableCell>{item.fullName}</TableCell>
                                <TableCell>{item.firstName}</TableCell>
                                <TableCell>{item.lastName}</TableCell>
                                <TableCell>{item.email}</TableCell>
                                <TableCell>{item.departmentName}</TableCell>
                                <TableCell>{item.titleName}</TableCell>
                                <TableCell>{item.dateTimeJoinedAsString}</TableCell>
                                <TableCell>{item.address}</TableCell>
                                <TableCell>{item.dateOfBirth}</TableCell>
                                <TableCell>{item.workPhone}</TableCell>
                                <TableCell>{item.privatePhone}</TableCell>
                                <TableCell>{item.gender}</TableCell>
                                <TableCell>{item.activeStatusAsString}</TableCell>
                                <TableCell>
                                    <Controls.ActionButton
                                        color="primary"
                                        onClick={() => { openInPopup(item) }}>
                                        <EditOutlinedIcon fontSize="small" />
                                    </Controls.ActionButton>
                                    <Controls.ActionButton
                                        color="secondary"
                                        onClick={() => {
                                            onDelete(item.id);
                                        }}>
                                        <ErrorIcon fontSize="small" />
                                    </Controls.ActionButton>
                                    <Controls.ActionButton
                                        color=""
                                        onClick={() => { openInPopupImage(item) }}>
                                        <ImageSearchIcon fontSize="small" />
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
                title="Employee Details"
                openPopup={openPopup}
                setOpenPopup={setOpenPopup}
            >
                <EmployeeForm
                    recordForEdit={recordForEdit}
                    addOrEdit={addOrEdit} />
            </Popup>
            <Popup
                title="Employee Photo"
                openPopup={openPopupPhoto}
                setOpenPopup={setOpenPopupPhoto}
            >
                <EmployeeImageForm
                recordForEdit={recordForEditImage}
                doneWithPopup={doneWithImagePopup}
                />
            </Popup>
        </>
    );
}