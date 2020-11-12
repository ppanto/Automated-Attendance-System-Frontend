import React from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import {CustomizedXAxisForChart} from './CustomizedXAxisForChart'

export const TimeChart = (props) => {
    const {data, lineName, dataKey, lineStroke, lineDataKey,
      lineName2, lineStroke2, lineDataKey2} = props;

    return (
        <LineChart
          width={590}
          height={430}
          data={data}
          margin={{
            top: 40, right: 5, bottom: 15,
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
          <Line strokeWidth={2} name={lineName} type="monotone" dataKey={lineDataKey} stroke={lineStroke} />
          {(lineName2 !== undefined) ? (
            <Line strokeWidth={2} name={lineName2} type="monotone" dataKey={lineDataKey2} stroke={lineStroke2} />
          ) : (null)} 
        </LineChart>
      );
}


