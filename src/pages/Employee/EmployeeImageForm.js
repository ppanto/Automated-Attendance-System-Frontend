import React, { useEffect, useCallback } from 'react'
import {useDropzone} from 'react-dropzone';
import { Grid, } from '@material-ui/core';
import { useForm, Form } from '../../components/useForm';
import {ApiService} from "../../services/ApiService";

const initialFValues = {
    id: 0,
}

export default function EmployeeForm(props) {
    const postImage = async (imageData, employeeId) => {
        await ApiService.postXData('personnel/image' ,imageData, employeeId)
    }

    const { recordForEdit, doneWithPopup } = props

    const onDrop = useCallback(acceptedFiles => {
        const formData = new FormData();
        formData.append("file", acceptedFiles[0]);
        postImage(formData, recordForEdit.id);
        doneWithPopup();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
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
        setErrors
    } = useForm(initialFValues, true, validate);

    useEffect(() => {
        if (recordForEdit != null)
            setValues({
                ...recordForEdit
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps    
    }, [recordForEdit])

    return (
        <Form>
            <Grid container>
                <Grid>
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        {
                            isDragActive ?
                            <p>Drop the image here ...</p> :
                            <p>Drag 'n' drop image here, or click to select image</p>
                        }
                    </div>
                </Grid>
            </Grid>
        </Form>
    )
}
