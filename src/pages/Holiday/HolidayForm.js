import React, { useEffect } from 'react'
import { Grid, } from '@material-ui/core';
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/useForm';

const initialFValues = {
    id: 0,
    fullDate: new Date(),
    description: ''
}

export default function LeaveTypeForm(props) {
    const { addOrEdit, recordForEdit } = props

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('fullDate' in fieldValues)
            temp.fullDate = fieldValues.fullDate ? "" : "This field is required."
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
                <Grid>
                    <Controls.Input
                        name="description"
                        label="Holiday Description"
                        value={values.description}
                        onChange={handleInputChange}
                    />
                    <Controls.DatePicker
                        name="fullDate"
                        label="Holiday Date"
                        value={values.fullDate}
                        onChange={handleInputChange}
                        error={errors.fullDate}
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
