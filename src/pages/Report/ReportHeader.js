import React from 'react'
import { Paper } from "@material-ui/core";

export const ReportHeader = (props) => {
    const {headerText} = props;
    return (
        <Paper style={{marginTop: '20px'}}>
        <div style={{height:'55px'}}>
        <span style={{fontWeight:'bold', marginLeft:'20px', lineHeight:'55px', fontSize:'25px'}}>{headerText}</span>
        </div>
        </Paper>
    )
}
