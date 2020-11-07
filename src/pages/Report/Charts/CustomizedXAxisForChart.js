import React from 'react'

export const CustomizedXAxisForChart = (props) => {
    const {
        //x, y, stroke, payload,
        x, y, payload,
      } = props;

      return (
        <g transform={`translate(${x},${y})`}>
          <text x={0} y={0} dy={16} textAnchor="end" fill="#666" transform="rotate(-35)">{payload.value}</text>
        </g>
      );
}
