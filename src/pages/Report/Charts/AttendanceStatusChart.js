import React from 'react'
import {
    BarChart, Bar, XAxis, YAxis, Legend, CartesianGrid, Tooltip,
  } from 'recharts';

export const AttendanceStatusChart = (props) => {
    const {totalPersonnel, present, absent, approvedLeave, unapprovedLeave} = props;

    const data = [
        {
          name: 'Total Personnel', Value: totalPersonnel, 
        },
        {
          name: 'Present', Value: present,
        },
        {
          name: 'Absent', Value: absent,
        },
        {
          name: 'Approved Leave', Value: approvedLeave,
        },
        {
          name: 'Unapproved Leave', Value: unapprovedLeave,
        },
      ];

    return (
        <BarChart
          width={975}
          height={450}
          data={data}
          margin={{
            top: 40, right: 30, left: 20, bottom: 25,
          }}
          barSize={50}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          {/* <Legend layout="vertical" verticalAlign="middle" align="right" /> */}
          <Legend />
          <Bar name="Number of Employees" dataKey="Value" fill="#8884d8" />
        </BarChart>
      );
}
