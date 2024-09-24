import { getAccount, getAccounts } from "@/actions/bank.actions";
import { getLoggedInUser } from "@/actions/user.actions";
import HeaderBox from "@/components/header-box";
import RecentTransactions from "@/components/recent-transactions";
import RightSideBar from "@/components/right-side-bar";
import { TotalBalanceBox } from "@/components/total-balance-box";

const HomePage = async ({ searchParams: { id, page } }: SearchParamProps) => {
   //*** PAGINATION ***//
   const currentPage = Number(page as string) || 1;

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

   return (
      <section className="home">
         <div className="home-content">
            {/* Header */}
            <header className="home-header">
               {/* User Infos */}
               <HeaderBox
                  type="greeting"
                  title="Bonjour"
                  user={loggedIn?.firstName || "Visiteur"}
                  subtext="Accédez à vos comptes et gérez vos transactions facilement."
               />
               {/* Summary Card */}
               <TotalBalanceBox
                  accounts={accountsData}
                  totalBanks={accounts?.totalBanks}
                  totalCurrentBalance={accounts?.totalCurrentBalance}
               />
            </header>

            {/* Transactions */}
            <RecentTransactions
               accounts={accountsData}
               transactions={account?.transactions}
               appwriteItemId={appwriteItemId}
               page={currentPage}
            />
         </div>
         <RightSideBar
            user={loggedIn}
            transactions={account?.transactions}
            banks={accountsData?.slice(0, 2)}
         />
      </section>
   );
};

export default HomePage;
