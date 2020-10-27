import React, { useEffect, useState } from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/useForm';
import {ApiService} from "../../services/ApiService";

const initialFValues = {
    id: 0,
    shiftTypeId: '',
    personnelId: '',
    startDate: new Date(),
    endDate: new Date(),
}

export default function ShiftMapperForm(props) {
    const { addOrEdit, recordForEdit } = props
    const [shiftTypes, setShiftTypes] = useState([]);
    const [employees, setEmployees] = useState([]);

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('shiftTypeId' in fieldValues)
        // eslint-disable-next-line
            temp.shiftTypeId = fieldValues.shiftTypeId.length != 0 ? "" : "This field is required."
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
            && firstDate.getDay() === lastDate.getDay()) return false;
        if(firstDate.getTime() > lastDate.getTime()) return false;
        return true;
    }
    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            //if(!isDateOk(values.startDate._d, values.endDate._d)){
            if(!isDateOk(values.startDate, values.endDate)){
                let temp = { ...errors }
                temp.endDate = 'End date must come after start date.'
                setErrors({ ...temp })
            }
            else{
                addOrEdit(values, resetForm);
            }
        }
    }

    useEffect(() => {
        getRequiredData();
    }, [])
    const getRequiredData = async () => {
        setEmployees(await ApiService.get('personnel/simple'));
        setShiftTypes(await ApiService.get('shift-type'));
    }

    useEffect(() => {
        if (recordForEdit != null){
            let copy = {
                id: recordForEdit.id,
                shiftTypeId: recordForEdit.shiftTypeId,
                personnelId: recordForEdit.personnelId,
                startDate: new Date(),
                endDate: new Date(),
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
                        name="shiftTypeId"
                        label="Shift Identifier"
                        value={values.shiftTypeId}
                        onChange={handleInputChange}
                        options={shiftTypes}
                        valueItem = "name"
                        myWidth='130px'
                        error={errors.shiftTypeId}
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
