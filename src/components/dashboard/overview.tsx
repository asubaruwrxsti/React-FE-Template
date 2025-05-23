"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
    {
        name: "Jan",
        total: 18000,
    },
    {
        name: "Feb",
        total: 18500,
    },
    {
        name: "Mar",
        total: 19200,
    },
    {
        name: "Apr",
        total: 19800,
    },
    {
        name: "May",
        total: 20100,
    },
    {
        name: "Jun",
        total: 21000,
    },
    {
        name: "Jul",
        total: 21500,
    },
    {
        name: "Aug",
        total: 21800,
    },
    {
        name: "Sep",
        total: 22000,
    },
    {
        name: "Oct",
        total: 22100,
    },
    {
        name: "Nov",
        total: 22300,
    },
    {
        name: "Dec",
        total: 22500,
    },
]

export function Overview() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `$${value}`}
                />
                <Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
            </BarChart>
        </ResponsiveContainer>
    )
}

