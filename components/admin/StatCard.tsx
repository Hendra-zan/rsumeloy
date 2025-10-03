
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ComponentType<{className?: string}>;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
            <Icon className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{value}</div>
        </CardContent>
    </Card>
);

export default StatCard;
