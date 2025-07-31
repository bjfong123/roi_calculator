"use client";

import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from "recharts";

export default function SavingsChart({ data }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 lg:p-10">
      <h3 className="text-center font-bold text-xl mb-4">Savings Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis
            tickFormatter={(value) =>
              `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
            }
          />
          <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          <Legend />

          {/* Old Cost Line */}
          <Area type="monotone" dataKey="oldCost" name="Old Monthly Cost" stroke="#FF0000" fill="#FF0000" fillOpacity={0.1} />

          {/* New Cost Line */}
          <Area type="monotone" dataKey="newCost" name="New Monthly Cost" stroke="#28a745" fill="#28a745" fillOpacity={0.1} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
