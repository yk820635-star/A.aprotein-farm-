
import React from 'react';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';

interface ChartProps {
    data: any[];
    type: 'bar' | 'line';
    title: string;
    dataKeys: { key: string; color: string }[];
    xAxisKey: string;
}

const DataChart: React.FC<ChartProps> = ({ data, type, title, dataKeys, xAxisKey }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md h-96">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">{title}</h3>
            <ResponsiveContainer width="100%" height="100%">
                {type === 'bar' ? (
                    <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        {dataKeys.map(dk => <Bar key={dk.key} dataKey={dk.key} fill={dk.color} />)}
                    </BarChart>
                ) : (
                    <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey={xAxisKey} tick={{ fontSize: 12 }}/>
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        {dataKeys.map(dk => <Line key={dk.key} type="monotone" dataKey={dk.key} stroke={dk.color} strokeWidth={2} activeDot={{ r: 8 }} />)}
                    </LineChart>
                )}
            </ResponsiveContainer>
        </div>
    );
};

export default DataChart;
