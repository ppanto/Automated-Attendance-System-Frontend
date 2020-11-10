import React from 'react'
import MUIDataTable from "mui-datatables";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export const PersonnelTotalsReport = (props) => {
    const {data} = props;

    const columns = [
        {name: "personnelFullName", label: "Employee", options: { filter: false, sort: true, } },
        {name: "title",label: "Title",options: {filter: true,sort: true,}},
        {name: "department",label: "Department",options: {filter: true,sort: true,}},
        {name: "totalTimeWorked",label: "Hours Worked",options: {filter: false,sort: true,}},
        {name: "totalDaysWorked",label: "Days Worked",options: { filter: false,sort: true,}},
        {name: "totalTimeBreaks",label: "Break Time (Minutes)",options: {filter: false,sort: true,}},
        {name: "totalTimeOfficial",label: "Official Absence (Hours)", options: {filter: false,sort: true,}},
        {name: "totalRegularTimeWorked",label: "Regular Hours",options: {filter: false,sort: true,}},
        {name: "totalWeekendTimeWorked", label: "Weekend Hours",options: {filter: false,sort: true,}},
        {name: "totalHolidayTimeWorked",label: "Holiday Hours",options: {filter: false,sort: true,}},
        {name: "totalLeaves",label: "Absences",options: {filter: false,sort: true,}},
       ];

    const options = {
        selectableRows: 'none',
        filterType: "dropdown",
        responsive: "standard",
        rowsPerPage: 10,
        downloadOptions: {
            filename:'personnel_totals_report.csv',
            seperator:','
        }
    };

    return (
        <>
        <MUIDataTable
        title={"Full Report"}
        data={data.personnelTimesList}
        columns={columns}
        options={options}
        />

        <TableContainer component={Paper} style={{marginTop: '15px'}}>
        <Table>
            <TableHead>
            <TableRow>
                <TableCell>Totals</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>Hours Worked</TableCell>
                <TableCell></TableCell>
                <TableCell>Break Time</TableCell>
                <TableCell>Official Absence</TableCell>
                <TableCell>Regular Hours</TableCell>
                <TableCell>Weekend Hours</TableCell>
                <TableCell>Holiday Hours</TableCell>
                <TableCell>Absences</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>Totals</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>{data.totalTimeWorked}</TableCell>
                    <TableCell></TableCell>
                    <TableCell>{data.totalTimeBreaks}</TableCell>
                    <TableCell>{data.totalTimeOfficial}</TableCell>
                    <TableCell>{data.totalRegularTimeWorked}</TableCell>
                    <TableCell>{data.totalWeekendTimeWorked}</TableCell>
                    <TableCell>{data.totalHolidayTimeWorked}</TableCell>
                    <TableCell>{data.totalAbsences}</TableCell>
                </TableRow>
            </TableBody>
        </Table>
        </TableContainer>
    </>
    )
}
