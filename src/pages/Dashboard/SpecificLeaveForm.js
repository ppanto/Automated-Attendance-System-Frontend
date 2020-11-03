import React, { useEffect, useState } from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/useForm';
import {ApiService} from "../../services/ApiService";

const initialFValues = {
    id: 0,
    leaveTypeId: '',
    personnelId: '',
    startDate: new Date(),
    approved: true,
    description: ''
}

export default function SpecificLeaveForm(props) {
    const { addOrEdit, recordForEdit, deleteItem } = props
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [employees, setEmployees] = useState([]);

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('leaveTypeId' in fieldValues)
        // eslint-disable-next-line
            temp.leaveTypeId = fieldValues.leaveTypeId.length != 0 ? "" : "This field is required."
        if ('personnelId' in fieldValues)
        // eslint-disable-next-line
            temp.personnelId = fieldValues.personnelId.length != 0 ? "" : "This field is required."
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
    const deleteLeave = () => {
        deleteItem(values.id, resetForm);
    }

    useEffect(() => {
        getRequiredData();
    }, [])
    const getRequiredData = async () => {
        setEmployees(await ApiService.get('personnel/simple'));
        setLeaveTypes(await ApiService.get('leave-type'));
    }

    useEffect(() => {
        if (recordForEdit != null){
            setValues({
                ...recordForEdit
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps    
    }, [recordForEdit])

    return (
        <Form onSubmit={handleSubmit}>
            <Grid container>
                <Grid>
                    <Controls.Select
                        name="personnelId"
                        label="Employee"
                        value={values.personnelId}
                        onChange={handleInputChange}
                        options={employees}
                        valueItem = "fullName"
                        myWidth='130px'
                        error={errors.personnelId}
                    />
                    <Controls.Select
                        name="leaveTypeId"
                        label="Leave Identifier"
                        value={values.leaveTypeId}
                        onChange={handleInputChange}
                        options={leaveTypes}
                        valueItem = "name"
                        myWidth='130px'
                        error={errors.leaveTypeId}
                    />
                    <Controls.Checkbox
                        name="approved"
                        label="Approved"
                        value={values.approved}
                        onChange={handleInputChange}
                    />
                    <Controls.Input
                        name="description"
                        label="Description"
                        value={values.description}
                        multiline
                        onChange={handleInputChange}
                    />
                    <div>
                    <Controls.Button
                            type="submit"
                            text="Submit" />
                    <Controls.Button
                    text="Delete Absence"
                    color="default"
                    onClick={deleteLeave} />
                    </div>
                </Grid>
            </Grid>
        </Form>
    )
}
