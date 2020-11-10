import React from "react";
import TableFooter from "@material-ui/core/TableFooter";
import TableRow from "@material-ui/core/TableRow";
import TablePagination from "@material-ui/core/TablePagination";
import TableCell from "@material-ui/core/TableCell";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    cellMain:{
        fontWeight: 'bold'
    },
    cellNotVisible:{
        visibility:'hidden'
    }
}))

export const CustomFooter = (props) => {
    const classes = useStyles();
    const {rowCount, page, rowsPerPage, changeRowsPerPage, changePage,
        totalAbsences,
        totalTimeWorked,
        totalTimeBreaks,
        totalTimeOfficial,
        totalRegularTimeWorked,
        totalWeekendTimeWorked,
        //totalDaysWorked,
        totalHolidayTimeWorked,
    } = props;
    return (
    <TableFooter>
        <TableRow>
            <TableCell style={{width:'9.277600443%'}}>Totals</TableCell>
            <TableCell style={{width:'11.40167124%'}}></TableCell>
            <TableCell style={{width:'9.297415114%'}}></TableCell>
            <TableCell style={{width:'8.013176756%'}}>{totalTimeWorked}</TableCell>
            <TableCell style={{width:'7.534528612%'}}></TableCell>
            <TableCell style={{width:'11.12822879%'}}>{totalTimeBreaks}</TableCell>
            <TableCell style={{width:'12.41296251%'}}>{totalTimeOfficial}</TableCell>
            <TableCell style={{width:'8.053425306%'}}>{totalRegularTimeWorked}</TableCell>
            <TableCell style={{width:'8.672014564%'}}>{totalWeekendTimeWorked}</TableCell>
            <TableCell style={{width:'8.003888629%'}}>{totalHolidayTimeWorked}</TableCell>
            <TableCell style={{width:'6.205088036%'}}>{totalAbsences}</TableCell>
        </TableRow>
        <TableRow>
        <TablePagination
          count={rowCount}
          page={page}
          rowsPerPage={rowsPerPage}
          onChangePage={(_, page) => changePage(page)}
          onChangeRowsPerPage={event => changeRowsPerPage(event.target.value)}
          rowsPerPageOptions={[10,25,50,100]}
        />
        </TableRow>
      </TableFooter>
    );
}
