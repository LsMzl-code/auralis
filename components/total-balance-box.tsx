"use client";
import AnimatedCounter from "./animated-counter";
import DonutChart from "./donut-chart";

export const TotalBalanceBox = ({
   accounts = [],
   totalBanks,
   totalCurrentBalance,
}: TotalBalanceBoxProps) => {
   return (
      <section className="total-balance">
         {/* Chart */}
         <div className="total-balance-chart">
            <DonutChart accounts={accounts}/>
         </div>
         {/* Accounts */}
         <div className="flex flex-col gap-6">
            <h2 className="header-2">Comptes: {totalBanks}</h2>
            <div className="flex flex-col gap-2">
               <p className="total-balance-label">Compte courant</p>
               <p className="total-balance-amount flex-center gap-2">
                  <AnimatedCounter amount={totalCurrentBalance} />
               </p>
            </div>
         </div>
      </section>
   );
};
