import React, { useState, useEffect } from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/useForm';
import {EmployeeService} from "../../services/EmployeeService";

const initialFValues = {
    id: 0,
    username: '',
    personnelId: '',
    password: ''
}

export default function DepartmentForm(props) {
    const [personnel, setPersonnel] = useState([]);

    useEffect(() => {
        getRequiredData();
    }, [])
    const getRequiredData = async () => {
        setPersonnel(await EmployeeService.getSimpleFilteredNoAccount());
    }

    const { addOrEdit, recordForEdit } = props

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('username' in fieldValues)
            temp.username = fieldValues.username ? "" : "This field is required."
        if ('password' in fieldValues)
            temp.password = fieldValues.password ? "" : "This field is required."
        if ('personnelId' in fieldValues){
            // eslint-disable-next-line
            temp.personnelId = fieldValues.personnelId.length != 0 ? "" : "This field is required."
        }
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
        if (recordForEdit != null)
            setValues({
                ...recordForEdit
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps    
    }, [recordForEdit])

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid item xs={2}></Grid>
                <Grid item xs={8}>
                    <Controls.Input
                        name="username"
                        label="Username"
                        value={values.username}
                        onChange={handleInputChange}
                        error={errors.username}
                    />
                    <Controls.Input
                        name="password"
                        label="Password"
                        value={values.password}
                        onChange={handleInputChange}
                        error={errors.password}
                        type="password"
                    />
                    <Controls.Select
                        name="personnelId"
                        label="Employee"
                        value={values.personnelId}
                        onChange={handleInputChange}
                        options={personnel}
                        valueItem = "fullName"
                        myWidth='130px'
                        error={errors.personnelId}
                    />
                    <div>
                        <Controls.Button
                                type="submit"
                                text="Submit" />
                        <Controls.Button
                            text="Reset"
                            color="default"
                            onClick={resetForm} />
                    </div>
                </Grid>
            </Grid>
        </Form>
    )
}
