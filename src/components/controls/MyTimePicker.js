import React from 'react'
import { MuiPickersUtilsProvider, KeyboardTimePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";

export default function MyTimePicker(props) {

    const { name, label, value, onChange, error=null } = props


    const convertToDefEventPara = (name, value) => ({
        target: {
            name, value
        }
    })

    return (
        <MuiPickersUtilsProvider utils={MomentUtils}>
            <KeyboardTimePicker  variant="inline" inputVariant="outlined"
                ampm={false}
                label={label}
                name={name}
                value={value}
                onChange={date =>onChange(convertToDefEventPara(name,date))}
                {...(error && {error:true,helperText:error})}
            />
        </MuiPickersUtilsProvider>
    )
}
