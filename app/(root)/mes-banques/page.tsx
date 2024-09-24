import { getAccounts } from "@/actions/bank.actions";
import { getLoggedInUser } from "@/actions/user.actions";
import BankCard from "@/components/bank-card";
import HeaderBox from "@/components/header-box";

const BanksPage = async () => {
   //*** CURRENT USER ***//
   const loggedIn = await getLoggedInUser();

   //*** ACCOUNTS DATA ***//
   const accounts = await getAccounts({
      userId: loggedIn.$id,
   });
   if (!accounts) return;

   console.log('accounts', accounts)

   return (
      <section className="flex">
         <div className="my-banks">
            <HeaderBox
               title="Mes comptes"
               subtext="Gérez vos différents comptes bancaires"
            />

            <div className="space-y-4">
               <h2 className="header-2">Vos cartes</h2>
               <div className="flex flex-wrap gap-6">
                  {accounts &&
                     accounts.data.map((account: Account) => (
                        <BankCard
                           key={accounts.id}
                           account={account}
                           userName={`${loggedIn?.firstName} ${loggedIn?.lastName}`}
                        />
                     ))}
               </div>
            </div>
         </div>
      </section>
   );
};

export default BanksPage;
