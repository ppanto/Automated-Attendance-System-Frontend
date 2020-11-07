import React from 'react'
import { Grid, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    wrapper:{
        width:"95%",
        height:"95px",
        overflow:"hidden",
        padding:"22px 0",
        margin:"auto"
    },
    line:{
        width:"100%",
        height:"2px",
        position:'relative',
    },
    timeScaleRow:{
        position:'absolute',
        paddingTop:'16px',
        paddingLeft:'0.2%'
    },
    verticalLineLong:{
        position:'absolute',
        width: '1px',
        height: '34px',
        background: 'grey'
    },
    verticalLineShort:{
        position:'absolute',
        width: '1px',
        height: '20px',
        background: 'grey'
    }
}))

export const Timescale = () => {
    const classes = useStyles();
    return (
        <Grid container>
                    <Grid item xs={3} >
                    </Grid>
                    <Grid item xs={7}>
                        <div className={classes.wrapper}>
                        <div className={classes.line} style={{background: 'grey'}}>
                            <div>
                                <div width='100%' style={{position:'relative'}}>
                                    <div className={classes.timeScaleRow} style={{left:'0%'}}>00H</div>
                                    <div className={classes.timeScaleRow} style={{left:'12.5%'}}>03H</div>
                                    <div className={classes.timeScaleRow} style={{left:'25%'}}>06H</div>
                                    <div className={classes.timeScaleRow} style={{left:'37.5%'}}>09H</div>
                                    <div className={classes.timeScaleRow} style={{left:'50%'}}>12H</div>
                                    <div className={classes.timeScaleRow} style={{left:'62.5%'}}>15H</div>
                                    <div className={classes.timeScaleRow} style={{left:'75%'}}>18H</div>
                                    <div className={classes.timeScaleRow} style={{left:'87.5%'}}>21H</div>
                                    <div className={classes.timeScaleRow} style={{left:'100%', transform:'translateX(-100%)'}}></div>
                                </div>
                            </div>
                            <div>
                                <div width='100%' style={{position:'relative'}}>
                                    <div className={classes.verticalLineLong} style={{left:'0%'}}></div>
                                    <div className={classes.verticalLineShort} style={{left:'4.1666%'}}></div>
                                    <div className={classes.verticalLineShort} style={{left:'8.3333%'}}></div>
                                    <div className={classes.verticalLineLong} style={{left:'12.5%'}}></div>
                                    <div className={classes.verticalLineShort} style={{left:'16.6666%'}}></div>
                                    <div className={classes.verticalLineShort} style={{left:'20.8333%'}}></div>
                                    <div className={classes.verticalLineLong} style={{left:'25%'}}></div>
                                    <div className={classes.verticalLineShort} style={{left:'29.1666%'}}></div>
                                    <div className={classes.verticalLineShort} style={{left:'33.3333%'}}></div>
                                    <div className={classes.verticalLineLong} style={{left:'37.5%'}}></div>
                                    <div className={classes.verticalLineShort} style={{left:'41.6666%'}}></div>
                                    <div className={classes.verticalLineShort} style={{left:'45.8333%'}}></div>
                                    <div className={classes.verticalLineLong} style={{left:'50%'}}></div>
                                    <div className={classes.verticalLineShort} style={{left:'54.1666%'}}></div>
                                    <div className={classes.verticalLineShort} style={{left:'58.3333%'}}></div>
                                    <div className={classes.verticalLineLong} style={{left:'62.5%'}}></div>
                                    <div className={classes.verticalLineShort} style={{left:'66.6666%'}}></div>
                                    <div className={classes.verticalLineShort} style={{left:'70.8333%'}}></div>
                                    <div className={classes.verticalLineLong} style={{left:'75%'}}></div>
                                    <div className={classes.verticalLineShort} style={{left:'79.1666%'}}></div>
                                    <div className={classes.verticalLineShort} style={{left:'83.3333%'}}></div>
                                    <div className={classes.verticalLineLong} style={{left:'87.5%'}}></div>
                                    <div className={classes.verticalLineShort} style={{left:'91.6666%'}}></div>
                                    <div className={classes.verticalLineShort} style={{left:'95.8333%'}}></div>
                                    <div className={classes.verticalLineLong} style={{left:'100%', transform:'translateX(-100%)'}}></div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </Grid>
                    <Grid item xs={2}>
                    </Grid>
        </Grid>
    )
}
