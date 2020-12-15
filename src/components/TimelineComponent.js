import React, {useState} from 'react'
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    wrapper:{
        width:"95%",
        height:"125px",
        overflow:"hidden",
        padding:"22px 0",
        margin:"auto"
    },
    line:{
        width:"100%",
        height:"2px",
        position:'relative',
    },
    dot:{
        float:"left",
        width:"10px",
        height:"10px",
        background:"#4a423f", //<- color of dot
        borderRadius:"50%",
        position:"absolute",
        top:"-4px",
        '&:hover': {
            cursor: 'pointer',
        }
    },
    specialDot:{
        float:"left",
        width:"10px",
        height:"10px",
        background:"red", //<- color of dot
        borderRadius:"50%",
        position:"absolute",
        top:"-4px",
        '&:hover': {
            cursor: 'pointer',
        }
    },
    belowDot:{
        float:"left",
        position:"absolute",
        transform: "translateX(-50%)",
        border: 'solid 2px',
        borderColor: 'rgb(246,247,248)',
        top: '22px',
        padding: '3px',
        color: '#85130b',  //'rgb(240,152,154)'
        fontWeight: 800,
    },
    belowDotHidden:{
        display:'none',
    },
}))

const AbsentHeader = () => {
    return (
        <div style={{textAlign:'center', fontWeight:'bold'}}>
            <span>Absent</span>
        </div>
    )
}

const Dot = (props) => {
    // const convertTimeToPercent = (hours,minutes) =>{
    //     return ((((hours + (minutes/60)) / 24) * 100) + "%");
    // }

    const classes = useStyles();
    const {action, isSpecial} = props;
    const dateTime = new Date(action.dateTime);
    let formatedTime;
    if(dateTime.getHours()<10){
        formatedTime = "0" + dateTime.getHours() + ":";
    }
    else{
        formatedTime = dateTime.getHours() + ":";
    }
    if(dateTime.getMinutes()<10){
        formatedTime = formatedTime + "0" + dateTime.getMinutes();
    }else{
        formatedTime = formatedTime + dateTime.getMinutes();
    }
    const [isVisible, setIsVisible] = useState(false);
    //let leftPosition = convertTimeToPercent(dateTime.getHours(), dateTime.getMinutes());
    return (
        <div>
        <div onMouseEnter={() => setIsVisible(true)} 
            onMouseLeave={() => setIsVisible(false)} 
            className={`${(isSpecial ? classes.specialDot : classes.dot)}`} 
            style={{left:`${action.leftPosition}%`}}>
        </div>
        <div
            className={`${classes.belowDot} ${!isVisible ? (classes.belowDotHidden) : (null)}`} 
            //style={{left:leftPosition}}
            style={{left:`${action.leftPosition}%`}}>
            <span>{action.event}, {formatedTime}</span>
        </div>
        </div>
    )
}

export const TimelineComponent = (props) => {
    const convertTimeToPercent = (hours,minutes) =>{
        return ((((hours + (minutes/60)) / 24) * 100));
    }

    const classes = useStyles();
    const {actions, leave, specialId} = props;

    let lineColor = 'rgb(72, 133, 97)';
    if((actions == null || actions.length === 0)){
        if(leave == null){
            lineColor = 'rgb(240,152,154)'
        }
        else{
            lineColor = 'rgb(255,229,163)'
        }
    }
    for(let i=0;i<actions.length;i++){
        const dateTime = new Date(actions[i].dateTime);
        actions[i].leftPosition = convertTimeToPercent(dateTime.getHours(), dateTime.getMinutes());
        if(i>0){
            if(actions[i].leftPosition - actions[i-1].leftPosition < 0.55){
                actions[i].leftPosition+=0.65
            }
        }
    }


    return (
        <>
            <div className={classes.wrapper}>
            {(actions === undefined || actions.length === 0) ? (
                    <AbsentHeader />
                ) : (
                    <span style={{visibility:'hidden'}}>Not absent</span>
            )}
            <div className={classes.line} style={{background: lineColor}}>
                {(actions !== undefined) ? 
                (
                    actions.map((action, index) => {
                        return(
                        <Dot key={index} action={action} isSpecial={(action.attendanceActionId === specialId) ? true : false} />
                        )
                    })
                ) : (null)
                }
            </div>
            </div>
        </>
    )
}
