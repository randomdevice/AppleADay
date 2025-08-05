import React from 'react';
import '../styles/SelectionDisease.css';

function DataTable({ data, diseaseType }) {
    return (
    <div style={{ padding: '20px', borderRadius: '8px', width: '100%' }}>
        <h2>Top 5 States for {diseaseType}</h2>
        <p>Percentage of cases in the top 5 states</p>
        <table>
            <thead>
            <tr>
                <th>States</th>
                <th>Percentage</th>
            </tr>
            </thead>
            <tbody>
            {data.map((item) => (
                <tr key={item.state}>
                <td>{item.state}</td>
                <td>{item.percentage}%</td>
                </tr>
            ))}
            </tbody>
        </table>
    </div>
    );
}

export default DataTable;
