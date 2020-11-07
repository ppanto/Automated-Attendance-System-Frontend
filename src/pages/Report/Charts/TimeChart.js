import React from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {CustomizedXAxisForChart} from './CustomizedXAxisForChart'

export const TimeChart = (props) => {
    const {data, lineName, dataKey, lineStroke, lineDataKey} = props;

    return (
        <LineChart
          width={750}
          height={430}
          data={data}
          margin={{
            top: 40, right: 30, left: 15, bottom: 15,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={dataKey} tick={<CustomizedXAxisForChart />} />
          <YAxis />
          <Tooltip />
          <Legend 
          wrapperStyle={{
            paddingTop: "40px"
          }}
          />
          <Line name={lineName} type="monotone" dataKey={lineDataKey} stroke={lineStroke} />
        </LineChart>
      );
}


