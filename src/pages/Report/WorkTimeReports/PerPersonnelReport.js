import React from 'react'
import MUIDataTable from "mui-datatables";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export const PerPersonnelReport = (props) => {
    const {data} = props;

    const columns = [
        {name: "fullDate", label: "Date", options: { filter: false, sort: true, } },
        {name: "totalTimeWorked",label: "Hours Worked",options: {filter: false,sort: true,}},
        {name: "totalTimeBreaks",label: "Break Time (Minutes)",options: {filter: false,sort: true,}},
        {name: "totalTimeOfficial",label: "Official Absence (Hours)", options: {filter: false,sort: true,}},
        {name: "totalRegularTimeWorked",label: "Regular Hours",options: {filter: false,sort: true,}},
        {name: "totalWeekendTimeWorked", label: "Weekend Hours",options: {filter: false,sort: true,}},
        {name: "totalHolidayTimeWorked",label: "Holiday Hours",options: {filter: false,sort: true,}},
        // {name: "isWeekend",label: "Weekend",options: {filter: false,sort: false,}},
        // {name: "isHoliday",label: "Holiday",options: {filter: false,sort: false,}},
       ];

    const options = {
        selectableRows: 'none',
        filterType: "dropdown",
        responsive: "standard",
        rowsPerPage: 15,
        downloadOptions: {
            filename:`employee_${data.personnelFullName}_report.csv`,
            seperator:','
        }
    };
    return (
        <>
        <MUIDataTable
        title={`Employee Report - ${data.personnelFullName}`}
        data={data.timeReportPerPersonnelForDateResponseList}
        columns={columns}
        options={options}
        />

        <TableContainer component={Paper} style={{marginTop: '15px'}}>
        <Table>
            <TableHead>
            <TableRow>
                <TableCell>Totals</TableCell>
                <TableCell>Hours Worked</TableCell>
                <TableCell>Break Time</TableCell>
                <TableCell>Official Absence</TableCell>
                <TableCell>Regular Hours</TableCell>
                <TableCell>Weekend Hours</TableCell>
                <TableCell>Holiday Hours</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                    <TableCell>Totals</TableCell>
                    <TableCell>{data.totalTimeWorked}</TableCell>
                    <TableCell>{data.totalTimeBreaks}</TableCell>
                    <TableCell>{data.totalTimeOfficial}</TableCell>
                    <TableCell>{data.totalRegularTimeWorked}</TableCell>
                    <TableCell>{data.totalWeekendTimeWorked}</TableCell>
                    <TableCell>{data.totalHolidayTimeWorked}</TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableBody>
        </Table>
        </TableContainer>
    </>
    )
}
