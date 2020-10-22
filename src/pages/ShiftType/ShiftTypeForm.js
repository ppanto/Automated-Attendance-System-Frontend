import React, { useEffect } from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/useForm';

const initialFValues = {
    id: 0,
    name: '',
    startTime : null,
    endTime: null
}

export default function ShiftTypeForm(props) {
    const { addOrEdit, recordForEdit } = props
    const isDateValid = (dateObject) => {
        if (dateObject === null) return false
        if(dateObject._d === null) return false
        if (dateObject._d.getTime && typeof dateObject._d.getTime === "function") return true
        return false
    }
    const isFirstDateBeforeLastDate = (firstDate, lastDate) => {
        if(firstDate.getHours() < lastDate.getHours()) return true;
        if((firstDate.getHours() === lastDate.getHours()) && (firstDate.getMinutes() < lastDate.getMinutes())) return true;
        return false;
    }

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('name' in fieldValues)
            temp.name = fieldValues.name ? "" : "This field is required."
        if ('startTime' in fieldValues){
            if(isDateValid(fieldValues.startTime)){
                temp.startTime = "";
            }
            else{
                temp.startTime = "This field is required. Please use picker."
            }
        }
        if ('endTime' in fieldValues){
            if(isDateValid(fieldValues.endTime)){
                temp.endTime = "";
            }
            else{
                temp.endTime = "This field is required. Please use picker."
            }
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
            if(!isFirstDateBeforeLastDate(values.startTime._d, values.endTime._d)){
                let temp = { ...errors }
                temp.endTime = 'End time must come after start time.'
                setErrors({ ...temp })
            }
            else{
                addOrEdit(values, resetForm);
            }
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
                <Grid>
                    <Controls.Input
                        name="name"
                        label="Shift Identifier"
                        value={values.name}
                        onChange={handleInputChange}
                        error={errors.name}
                    />
                    <Controls.MyTimePicker
                        name="startTime"
                        label="Shift Start Time"
                        value={values.startTime}
                        onChange={handleInputChange}
                        error={errors.startTime}
                    />
                    <Controls.MyTimePicker
                        name="endTime"
                        label="Shift End Time"
                        value={values.endTime}
                        onChange={handleInputChange}
                        error={errors.endTime}
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
