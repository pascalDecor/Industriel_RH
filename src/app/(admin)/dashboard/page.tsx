
"use client";

import { Card } from "@/components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";



const data = [
    { name: "Jan", value: 24780 },
    { name: "Feb", value: 17489 },
    { name: "Mar", value: 9962 },
    { name: "Apr", value: 22345 },
    { name: "May", value: 19483 },
    { name: "Jun", value: 25830 },
];

export default function Dashboard() {

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="p-7 shadow-none border-none">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-bold">Total Revenue</h3>
                    </div>
                    <div className="text-2xl font-bold">$24,780</div>
                    <div className="text-xs text-muted-foreground">+49% from last month</div>
                    <div className="h-[50px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-7 shadow-none border-none">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-bold">Total Revenue</h3>
                    </div>
                    <div className="text-2xl font-bold">$24,780</div>
                    <div className="text-xs text-muted-foreground">+49% from last month</div>
                    <div className="h-[50px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card className="p-7 shadow-none border-none">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="text-sm font-bold">Total Revenue</h3>
                    </div>
                    <div className="text-2xl font-bold">$24,780</div>
                    <div className="text-xs text-muted-foreground">+49% from last month</div>
                    <div className="h-[50px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data}>
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#8884d8"
                                    strokeWidth={2}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>


            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 p-7 shadow-none border-none">
                    <div className="">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium">Overview</h3>
                        </div>
                        <div className="h-[300px] mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#8884d8"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </Card>
                <Card className="col-span-3 p-7 shadow-none border-none">
                    <div className="p-6">
                        <h3 className="text-lg font-medium">Recent Activity</h3>
                        <div className="mt-4 space-y-4">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="flex items-center">
                                    <div className="w-2 h-2 rounded-full bg-primary mr-2" />
                                    <div className="flex-1">
                                        <div className="text-sm font-medium">New subscription</div>
                                        <div className="text-xs text-muted-foreground">2 minutes ago</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}