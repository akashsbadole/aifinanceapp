import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BaseCalculatorProps {
  title: string;
  children: React.ReactNode;
}

const BaseCalculator: React.FC<BaseCalculatorProps> = ({ title, children }) => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {children}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BaseCalculator;