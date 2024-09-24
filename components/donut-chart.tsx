"use client";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJs, ArcElement, Tooltip, Legend } from "chart.js";

ChartJs.register(ArcElement, Tooltip, Legend);

const DonutChart = ({ accounts }: DoughnutChartProps) => {
   //*** ACCOUNTS DETAILS ***//
   const accountNames = accounts.map((account) => account.name);
   const balances = accounts.map((account) => account.currentBalance);

   const data = {
      datasets: [
         {
            label: "Banque",
            data: balances,
            backgroundColor: ["#63C2DE", "#FFBB86", "#FC427B"],
            hoverBackgroundColor: ["#76D7EA", "#FFC857", "#FF6384"],
         },
      ],
      labels: accountNames,
   };
   return (
      <Doughnut
         data={data}
         options={{
            cutout: "60%",
            plugins: {
               legend: {
                  display: false,
               },
            },
         }}
      />
   );
};

export default DonutChart;
