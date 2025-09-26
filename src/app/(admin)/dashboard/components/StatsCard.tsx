"use client";

import { Card } from "@/components/ui/card";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import Link from "next/link";

interface StatsCardProps {
  title: string;
  value: string | number;
  change: number;
  changeText: string;
  icon: string;
  chartData?: Array<{ value: number }>;
  color?: string;
  href?: string;
}

export default function StatsCard({
  title,
  value,
  change,
  changeText,
  icon,
  chartData,
  color = "#3b82f6",
  href
}: StatsCardProps) {
  const isPositive = change >= 0;

  const cardContent = (
    <>
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>

      <div className="text-2xl font-bold text-gray-900 mb-1">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>

      <div className="flex items-center justify-between">
        <div className={`text-xs flex items-center ${
          isPositive ? 'text-green-600' : 'text-red-600'
        }`}>
          <span className="mr-1">
            {isPositive ? '↗️' : '↘️'}
          </span>
          {Math.abs(change)}% {changeText}
        </div>
      </div>

      {chartData && chartData.length > 0 && (
        <div className="h-[40px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        <Card className="p-6 shadow-none border-none bg-white hover:bg-gray-50 transition-colors cursor-pointer">
          {cardContent}
        </Card>
      </Link>
    );
  }

  return (
    <Card className="p-6 shadow-none border-none bg-white">
      {cardContent}
    </Card>
  );
}