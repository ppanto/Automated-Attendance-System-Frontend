import React, { useState, useEffect, useCallback } from 'react'
import { Paper, makeStyles } from '@material-ui/core';
import {ApiService} from '../../services/ApiService';
import {AuthService} from '../../services/AuthService';
import { BASE_PATH } from '../../config/ApiConfig';
import {useDropzone} from 'react-dropzone';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withStyles } from "@material-ui/core/styles";
import MuiAccordionSummary from "@material-ui/core/AccordionSummary";
import Controls from "../../components/controls/Controls";
import { useForm, Form } from '../../components/useForm';

const initialFValues = {
    oldPassword : '',
    newPassword: '',
    newPasswordRepeat: ''
}

const useStyles = makeStyles(theme => ({
    pageContent: {
        margin: theme.spacing(3),
        padding: theme.spacing(2)
    },
    centeredContent:{
        textAlign: 'center'
    },
    employeeImage:{
        textAlign: 'center',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    imageDiv:{
        marginTop: '20px',
        paddingTop: '20px',
        paddingBottom: '20px',
        width: '70%',
        marginLeft: 'auto',
        marginRight: 'auto'
    },
    passwordSettingsDiv:{
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',
        padding: '20px',
        textAlign: 'center'
    },
    dropZone:{
        textAlign: 'center',
        marginTop: '5px'
    },
    root: {
        width: '100%',
      },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        fontWeight: theme.typography.fontWeightRegular,
    },
    myTypography:{
        display: 'block',
        width: '100%'
    }
}))

export const Profile = () => {
    const classes = useStyles();

    const validate = (fieldValues = values) => {
        let temp = { ...errors }
        if ('oldPassword' in fieldValues){
            temp.oldPassword = fieldValues.oldPassword ? "" : "This field is required."
        }
        if ('newPassword' in fieldValues)
            temp.newPassword = fieldValues.newPassword ? "" : "This field is required."
        if ('newPasswordRepeat' in fieldValues){
            temp.newPasswordRepeat = fieldValues.newPasswordRepeat ? "" : "This field is required."
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
    } = useForm(initialFValues, true, validate);

    const handleSubmit = e => {
        e.preventDefault()
        if (validate()) {
            let isValid = true;
            let temp = { ...errors }
            if(values.oldPassword !== user.password){
                temp.oldPassword = "Incorrect old password."
                isValid = false;
            }
            else temp.oldPassword = ""
            if(values.newPassword !== values.newPasswordRepeat){
                temp.newPasswordRepeat = "Passwords are not the same.";
                isValid = false;
            }
            else temp.newPasswordRepeat = ""
            
            if(isValid){
                setValues({oldPassword: '', newPassword: '', newPasswordRepeat: ''});
                updatePassword(values.newPassword)
                AuthService.logout()
            }
            setErrors({
                ...temp
            })
        }
    }
    const updatePassword = async (newPw) => {
        await ApiService.send(`account/update-password` ,'PUT', newPw)
    }

    const AccordionSummary = withStyles({
        root: {
          flexDirection: "column"
        },
        content: {
          marginBottom: 0
        },
        expandIcon: {
          marginRight: 0,
          paddingTop: 0
        }
      })(MuiAccordionSummary);

    const [employee, setEmployee] = useState({fullName: '', id: 0});
    const [user] = useState(AuthService.getLoggedInUserObject());
    const [image, setImage] = useState('')
    const [isExpanded, setIsExpanded] = useState(true);

    useEffect(() => {
        fetchItems();
        // eslint-disable-next-line
    }, []);

    const fetchItems = async () => {
        const response = await ApiService.get(`personnel/filtered?username=${user.username}`)
        setEmployee(response);
        setImage(`${BASE_PATH}/personnel/image/get/${response.id}?${Date.now()}`);
    };

    const postImage = async (imageData, employeeId, hash) => {
        await ApiService.postXData('personnel/image' ,imageData, employeeId)
        setImage(`${BASE_PATH}/personnel/image/get/${employee.id}?${hash}`);
    }
    const onDrop = useCallback(acceptedFiles => {
        const formData = new FormData();
        formData.append("file", acceptedFiles[0]);
        postImage(formData, employee.id, new Date());
        // eslint-disable-next-line
      }, [employee])

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <Paper className={classes.pageContent}>
            <h2 className={classes.centeredContent}>{employee.fullName}</h2>
            <div className={classes.root}>
            <Accordion expanded={isExpanded}>
                <AccordionSummary
                    onClick={() => setIsExpanded(!isExpanded)}
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                <Typography className={classes.heading}>Photo Settings</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography className={classes.myTypography} component={'div'} variant={'body2'}>
                    <div className={classes.imageDiv}>
                        <img
                            key={Date.now()}
                            style = {{width: '250px', height:'250px', objectFit: 'cover', borderRadius:'50%'}}
                            src = {`${image}`}
                            alt = 'No avatar found'
                            className={classes.employeeImage}
                            >
                        </img>
                            <div {...getRootProps()} className={classes.dropZone}>
                                <input {...getInputProps()} />
                                {
                                    isDragActive ?
                                    <p>Drop the new image here ...</p> :
                                    <p>Drag 'n' drop new image here, or click to select new image</p>
                                }
                            </div>
                        </div>
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                <Typography className={classes.heading}>Password Settings</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography className={classes.myTypography} component={'div'} variant={'body2'}>
                    <div className={classes.passwordSettingsDiv}>
                    <Form onSubmit={handleSubmit}>
                        <Controls.Input
                            name="oldPassword"
                            label="Old Password"
                            value={values.oldPassword}
                            onChange={handleInputChange}
                            error={errors.oldPassword}
                            type="password"
                        />
                        <Controls.Input
                            name="newPassword"
                            label="New Password"
                            value={values.newPassword}
                            onChange={handleInputChange}
                            error={errors.newPassword}
                            type="password"
                        />
                        <Controls.Input
                            name="newPasswordRepeat"
                            label="New Password Repeat"
                            value={values.newPasswordRepeat}
                            onChange={handleInputChange}
                            error={errors.newPasswordRepeat}
                            type="password"
                        />
                        <div>
                        <Controls.Button
                            type="submit"
                            text="Submit" />
                        </div>
                    </Form>
                    </div>
                    </Typography>
                </AccordionDetails>
            </Accordion>
            </div>
        </Paper>
    )
}
