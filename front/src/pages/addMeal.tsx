import { AddMeal } from '@/components/AddMeal/AddMeal';
import React from 'react';


export default function Auth() {
  return (
    <div>
      <AddMeal onCancel={function (): void {
        throw new Error('Function not implemented.');
      }} onSave={function (data: any): void {
        throw new Error('Function not implemented.');
      }} />
    </div>
  );
}
