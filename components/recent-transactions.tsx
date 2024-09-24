import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BankTabItem } from "./bank-tab-item";
import BankInfo from "./bank-info";
import TransactionsTable from "./transactions-table";
import { Pagination } from "./pagination";

const RecentTransactions = ({
   accounts,
   transactions = [],
   appwriteItemId,
   page = 1,
}: RecentTransactionsProps) => {
   //*** PAGINATION ***//
   const rowsPerPage = 10;
   const totalPage = Math.ceil(transactions.length / rowsPerPage);
   const lastIndex = page * rowsPerPage;
   const firstIndex = lastIndex - rowsPerPage;
   const currentTransactions = transactions.slice(firstIndex, lastIndex);

   return (
      <section className="recent-transactions">
         <header className="flex items-center justify-between">
            <h2 className="recent-transactions-label">Transactions récentes</h2>
            <Link
               href={`/transactions/?id=${appwriteItemId}`}
               className="view-all-btn"
            >
               Tout voir
            </Link>
         </header>
         {/* Content */}
         <Tabs defaultValue={appwriteItemId} className="w-full">
            {/* Head */}
            <TabsList className="recent-transactions-tablist">
               {accounts.map((account: Account) => (
                  <TabsTrigger value={account.appwriteItemId} key={account.id}>
                     <BankTabItem
                        key={account.id}
                        account={account}
                        appwriteItemId={account.appwriteItemId}
                     />
                  </TabsTrigger>
               ))}
            </TabsList>
            {accounts.map((account: Account) => (
               <TabsContent
                  value={account.appwriteItemId}
                  key={account.id}
                  className="space-y-4"
               >
                  {/* Account infos */}
                  <BankInfo
                     account={account}
                     appwriteItemId={appwriteItemId}
                     type="full"
                  />
                  {/* Transactions infos */}
                  <TransactionsTable transactions={currentTransactions} />

                  {/* Pagination */}
                  {totalPage > 1 && (
                     <div className="my-4 w-full">
                        <Pagination totalPages={totalPage} page={page} />
                     </div>
                  )}
               </TabsContent>
            ))}
         </Tabs>
      </section>
   );
};

export default RecentTransactions;
