import React from 'react'
//import { AppBar, Toolbar, Grid, InputBase, IconButton, Badge, makeStyles } from '@material-ui/core'
import { AppBar, Toolbar, Grid, IconButton, makeStyles } from '@material-ui/core'
//import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';
//import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
//import SearchIcon from '@material-ui/icons/Search';
import AlarmOnIcon from '@material-ui/icons/AlarmOn';
import { AuthService } from '../services/AuthService';


const useStyles = makeStyles(theme => ({
    root: {
        backgroundColor: '#fff',
        
    },
    // searchInput: {
    //     opacity: '0.6',
    //     padding: `0px ${theme.spacing(1)}px`,
    //     fontSize: '0.8rem',
    //     '&:hover': {
    //         backgroundColor: '#f2f2f2'
    //     },
    //     '& .MuiSvgIcon-root': {
    //         marginRight: theme.spacing(1)
    //     }
    // }
}))

export default function Header() {

    const classes = useStyles();
    const username = AuthService.getLoggedInUserObject().username;
    return (
        <AppBar position="sticky" className={classes.root}>
            <Toolbar>
                <Grid container
                    alignItems="center">
                    <Grid item>
                        <AlarmOnIcon style={{color:"#a81c85", marginRight: 15}} fontSize='large' />
                    </Grid>
                    <Grid item>
                        
                       <span style={{color:"black", fontSize: 19, fontWeight: 'bold'}}>
                           Automated Attendance System
                       </span>
                    </Grid>
                    <Grid item sm></Grid>
                    <Grid item>
                        <span style={{color:"black", fontSize: 17}}>
                            <span style={{color: "rgb(172,192,189)", fontFamily:'Segoe UI'}}>Signed in as: </span> {username}
                        </span>
                        <IconButton onClick={ () => {
                            AuthService.logout();
                            }}>
                            <PowerSettingsNewIcon fontSize="small" />
                        </IconButton>
                    </Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    )
}
