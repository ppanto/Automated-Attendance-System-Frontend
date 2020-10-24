import React, { useState, useEffect } from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/useForm';
import {ApiService} from "../../services/ApiService";

const genderItems = [
    { id: 'Male', title: 'Male' },
    { id: 'Female', title: 'Female' },
    { id: 'Other', title: 'Other' },
]

const initialFValues = {
    id: 0,
    firstName: '',
    lastName: '',
    email: '',
    departmentId: '',
    image: '',
    titleId: '',
    dateTimeJoined: new Date(),
    workPhone: '',
    privatePhone: '',
    dateOfBirth: new Date(),
    address: '',
    activeStatus: true,
    gender: 'Male'
}

export default function EmployeeForm(props) {
    const [titles, setTitles] = useState([]);
    const [departments, setDepartments] = useState([]);

    const { addOrEdit, recordForEdit } = props

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('firstName' in fieldValues)
            temp.firstName = fieldValues.firstName ? "" : "This field is required."
        if ('lastName' in fieldValues)
            temp.lastName = fieldValues.lastName ? "" : "This field is required."
        if ('email' in fieldValues)
            temp.email = (/$^|.+@.+..+/).test(fieldValues.email) ? "" : "Email is not valid."
        setErrors({
            ...temp
        })

        if (fieldValues === values)
            return Object.values(temp).every(x => x === "")
    }

    const {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChange,
        resetForm
    } = useForm(initialFValues, true, validate);

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            addOrEdit(values, resetForm);
        }
    }

    useEffect(() => {
        getRequiredData();
    }, [])
    const getRequiredData = async () => {
        setTitles(await ApiService.get('title'));
        setDepartments(await ApiService.get('department'));
    }
    useEffect(() => {
        if (recordForEdit != null)
            setValues({
                ...recordForEdit
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps    
    }, [recordForEdit])

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid>
                    <Controls.Input
                        name="firstName"
                        label="First Name"
                        value={values.firstName}
                        onChange={handleInputChange}
                        error={errors.firstName}
                    />
                    <Controls.Input
                        name="lastName"
                        label="Last Name"
                        value={values.lastName}
                        onChange={handleInputChange}
                        error={errors.lastName}
                    />
                    <Controls.Input
                        name="email"
                        label="Email"
                        value={values.email}
                        onChange={handleInputChange}
                    />
                    <Controls.Input
                        name="workPhone"
                        label="Work phone"
                        value={values.workPhone}
                        onChange={handleInputChange}
                    />
                    <Controls.Input
                        name="privatePhone"
                        label="Private phone"
                        value={values.privatePhone}
                        onChange={handleInputChange}
                    />
                    <Controls.Select
                        name="titleId"
                        label="Title"
                        value={values.titleId}
                        onChange={handleInputChange}
                        options={titles}
                        valueItem = "name"
                        myWidth='130px'
                    />
                    <Controls.Select
                        name="departmentId"
                        label="Department"
                        value={values.departmentId}
                        onChange={handleInputChange}
                        options={departments}
                        valueItem = "name"
                        myWidth='130px'
                    />
                    <Controls.DatePicker
                        name="dateTimeJoined"
                        label="Joined on Date"
                        value={values.dateTimeJoined}
                        onChange={handleInputChange}
                    />
                    <Controls.DatePicker
                        name="dateOfBirth"
                        label="Date of Birth"
                        value={values.dateOfBirth}
                        onChange={handleInputChange}
                    />
                    <Controls.Input
                        name="address"
                        label="Address"
                        value={values.address}
                        onChange={handleInputChange}
                    />
                    <Controls.Checkbox
                        name="activeStatus"
                        label="Active"
                        value={values.activeStatus}
                        onChange={handleInputChange}
                    />
                    <Controls.RadioGroup
                        name="gender"
                        label="Gender"
                        value={values.gender}
                        onChange={handleInputChange}
                        items={genderItems}
                    />
                    <Controls.Button
                            type="submit"
                            text="Submit" />
                    <Controls.Button
                        text="Reset"
                        color="default"
                        onClick={resetForm} />
                </Grid>
            </Grid>
        </Form>
    )
}
