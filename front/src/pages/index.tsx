import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import { EstruturaRefeicoesForm } from "@/components/DietForms/DietForms";
import { AddMeal } from "@/components/AddMeal/AddMeal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div>
      <h2>Home</h2>
      <AddMeal onCancel={function (): void {
        throw new Error("Function not implemented.");
      }} onSave={function (data: any): void {
        throw new Error("Function not implemented.");
      }} />
    </div>
  );
}
