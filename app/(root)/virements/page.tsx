import { getAccounts } from "@/actions/bank.actions";
import { getLoggedInUser } from "@/actions/user.actions";
import HeaderBox from "@/components/header-box";
import PaymentTransfertForm from "@/components/payment-transfert-form";
import React from "react";

const TransfertPage = async () => {
   //*** CURRENT USER ***//
   const loggedIn = await getLoggedInUser();

   //*** ACCOUNTS DATA ***//
   const accounts = await getAccounts({
      userId: loggedIn.$id,
   });
   if (!accounts) return;

   const accountsData = accounts?.data;


   return (
      <section className="payment-transfer">
         <HeaderBox
            title="Virements"
            subtext="Effectue instantanement des virements vers d'autres comptes"
         />

         <section className="size-full pt-5">
            <PaymentTransfertForm accounts={accountsData} />
         </section>
      </section>
   );
};

export default TransfertPage;
