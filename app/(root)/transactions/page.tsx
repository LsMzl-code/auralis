import { getAccount, getAccounts } from "@/actions/bank.actions";
import { getLoggedInUser } from "@/actions/user.actions";
import HeaderBox from "@/components/header-box";
import { Pagination } from "@/components/pagination";
import TransactionsTable from "@/components/transactions-table";
import { formatAmount } from "@/lib/utils";
import React from "react";

const TransactionsPage = async ({
   searchParams: { id, page },
}: SearchParamProps) => {
   //*** CURRENT USER ***//
   const loggedIn = await getLoggedInUser();

   //*** ACCOUNTS DATA ***//
   const accounts = await getAccounts({
      userId: loggedIn.$id,
   });
   if (!accounts) return;

   const accountsData = accounts?.data;
   const appwriteItemId = (id as string) || accountsData[0]?.appwriteItemId;

   const account = await getAccount({ appwriteItemId });

   //*** PAGINATION ***//
   const currentPage = Number(page as string) || 1;
   const rowsPerPage = 10;
   const totalPage = Math.ceil(account?.transactions.length / rowsPerPage);
   const lastIndex = currentPage * rowsPerPage;
   const firstIndex = lastIndex - rowsPerPage;
   const currentTransactions = account?.transactions.slice(
      firstIndex,
      lastIndex
   );

   return (
      <section className="transactions">
         {/* Header */}
         <div className="transactions-header">
            <HeaderBox
               title="Historique de vos transactions"
               subtext="Consultez vos détails bancaires et transactions "
            />
         </div>

         <div className="space-y-6">
            <div className="transactions-account">
               {/* Account details */}
               <div className="flex flex-col gap-2">
                  <h2 className="text16 font-bols text-white">
                     {account?.data.name}
                  </h2>
                  <p className="text-14 text-blue-25">
                     {account?.data.officialName}
                  </p>
                  <p className="text-14 font-semibold tracking-[1.1px] text-white">
                     ●●●● ●●●● ●●●●{" "}
                     <span className="text-16">{account?.data.mask}</span>
                  </p>
               </div>

               <div className="transactions-account-balance">
                  <p className="text-14">Solde</p>
                  <p className="text-24 text-center font-bold">
                     {formatAmount(account?.data.currentBalance)}
                  </p>
               </div>
            </div>

            <section className="flex w-full flex-col gap-6">
               <TransactionsTable transactions={currentTransactions} />

               {/* Pagination */}
               {totalPage > 1 && (
                  <div className="my-4 w-full">
                     <Pagination totalPages={totalPage} page={currentPage} />
                  </div>
               )}
            </section>
         </div>
      </section>
   );
};

export default TransactionsPage;
