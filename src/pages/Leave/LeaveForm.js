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
    endDate: new Date(),
    approved: true,
    description: ''
}

export default function LeaveForm(props) {
    const { addOrEdit, recordForEdit } = props
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


    const isDateOk = (firstDate, lastDate) => {
        if(firstDate.getFullYear() === lastDate.getFullYear()
            && firstDate.getMonth() === lastDate.getMonth()
            && firstDate.getDate() === lastDate.getDate()) return true;
        if(firstDate.getFullYear() === lastDate.getFullYear()
            && firstDate.getMonth() > lastDate.getMonth()) return false;
        if(firstDate.getFullYear() === lastDate.getFullYear()
            && firstDate.getMonth() === lastDate.getMonth()
            && firstDate.getDate() > lastDate.getDate()) return false;
        return true;
    }
    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            if(!isDateOk(values.startDate, values.endDate)){
                let temp = { ...errors }
                temp.endDate = 'End date must come after start date.'
                setErrors({ ...temp })
            }
            else{
                if(values.startDate.getFullYear() === values.endDate.getFullYear()
                && values.startDate.getMonth() === values.endDate.getMonth()
                && values.startDate.getDate() === values.endDate.getDate()){
                    addOrEdit({
                        id: values.id,
                        leaveTypeId: values.leaveTypeId,
                        personnelId: values.personnelId,
                        startDate: values.startDate,
                        endDate: null,
                        approved: values.approved,
                        description: values.description
                    },resetForm)
                }
                else{
                    addOrEdit(values, resetForm);
                }
            }
        }
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
            let app = true
            if(recordForEdit['approved'] != null && recordForEdit['approved'] === false){
                app = false
            }
            let copy = {
                id: recordForEdit.id,
                leaveTypeId: recordForEdit.leaveTypeId,
                personnelId: recordForEdit.personnelId,
                startDate: new Date(),
                endDate: new Date(),
                description: recordForEdit.description,
                approved: app
            }
            setValues({
                ...copy
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
                    <Controls.DatePicker
                        name="startDate"
                        label="Start Date"
                        value={values.startDate}
                        onChange={handleInputChange}
                        error={errors.startDate}
                    />
                    <Controls.DatePicker
                        name="endDate"
                        label="End Date"
                        value={values.endDate}
                        onChange={handleInputChange}
                        error={errors.endDate}
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
                        text="Reset"
                        color="default"
                        onClick={resetForm} />
                    </div>
                </Grid>
            </Grid>
        </Form>
    )
}
