import React from 'react'
import { Paper, makeStyles, Grid } from "@material-ui/core";
import { BASE_PATH } from '../../config/ApiConfig';

const useStyles = makeStyles(theme => ({
    centeredHeader: {
        textAlign: 'center',
        marginTop: '10px',
        padding: '5px'
    },
    centeredText:{
        textAlign: 'center',
    },
    boldText:{
        fontWeight: 'bold'
    },
    vcenter:{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerImage:{
        margin: 'auto',
        marginLeft:'auto',
        marginRight:'auto'
    },
    seperatedGrid:{
        marginTop: '15px',
        marginBottom:'15px',
    }
}))

export const Timeline = () => {
    const classes = useStyles();
    const isHoliday = false;
    const isWeekend = false;
    const todaysDate = new Date();
    const list = [1,2,3]
    const mappedList = list.map((num) =>
        <Grid container key={num.toString()} className={classes.seperatedGrid}>
            <Grid item xs={1}>
                <div className={classes.vcenter}>
                <img
                className={classes.centerImage}
                style = {{width: '75px', height:'75px', objectFit: 'cover', borderRadius:'50%'}}
                src = {`${BASE_PATH}/personnel/image/get/1`}
                alt = ''
                >
                </img>
                </div>
            </Grid>
            <Grid item xs={1} style={{height:'80px'}}>
                <div className={classes.centeredText}>
                <span style={{lineHeight:'80px'}}>John Doe</span>
                </div>
            </Grid>
            <Grid item xs={1} style={{height:'80px'}}>
                <div className={classes.centeredText}>
                <span style={{lineHeight:'80px'}}>08:00</span>
                </div>
            </Grid>
            <Grid item xs={8} style={{height:'80px'}}>
                {/* Timeline */}
            </Grid>
            <Grid item xs={1} style={{height:'80px'}}>
                <div className={classes.centeredText}>
                <span style={{lineHeight:'80px'}}>17:00</span>
                </div>
            </Grid>
        </Grid>
    )
    return (
        <Paper>
            <div className={classes.centeredHeader}>
                {isHoliday ? 
                (<h3 >Holiday</h3>)
                :
                ("")  
                }
                {isWeekend ? 
                (<h3 >Weekend</h3>)
                :
                ("")  
                }
                <h3>{todaysDate.getFullYear() + "-" + (todaysDate.getMonth()+1) + "-" + todaysDate.getDate()}</h3>
            </div>
            <div>
                <Grid container>
                    <Grid item xs={1} >
                        <div className={classes.centeredText}>
                        <span className={classes.boldText}>Photo</span>
                        </div>
                    </Grid>
                    <Grid item xs={1}>
                        <div className={classes.centeredText}>
                        <span className={classes.boldText}>Employee</span>
                        </div>
                    </Grid>
                    <Grid item xs={1}>
                        <div className={classes.centeredText}>
                        <span className={classes.boldText}>Check-in</span>
                        </div>
                    </Grid>
                    <Grid item xs={8}>
                        {/* Timeline */}
                    </Grid>
                    <Grid item xs={1}>
                        <div className={classes.centeredText}>
                        <span className={classes.boldText}>Check-out</span>
                        </div>
                    </Grid>
                </Grid>
                {mappedList}
            </div>
        </Paper>
    )
}
