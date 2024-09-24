"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
   PlaidLinkOnSuccess,
   PlaidLinkOptions,
   usePlaidLink,
} from "react-plaid-link";
import { useRouter } from "next/navigation";
import { createLinkToken, exchangePublicToken } from "@/actions/user.actions";
import Image from "next/image";

const PlaidLink = ({ user, variant }: PlaidLinkProps) => {
   //*** STATES ***//
   const [token, setToken] = useState("");

   // Création d'un token
   useEffect(() => {
      const getLinkToken = async () => {
         const data = await createLinkToken(user);
         setToken(data?.linkToken);
      };
      getLinkToken();
   }, [user]);

   //*** HOOKS ***//
   const router = useRouter();

   //*** CONFIGURATION ***//
   const onSuccess = useCallback<PlaidLinkOnSuccess>(
      async (public_token: string) => {
         await exchangePublicToken({
            publicToken: public_token,
            user,
         });

         router.push("/");
      },
      [user]
   );

   const config: PlaidLinkOptions = {
      token,
      onSuccess,
   };

   const { open, ready } = usePlaidLink(config);

   return (
      <>
         {variant === "primary" ? (
            <Button
               className="plaidlink-primary"
               onClick={() => open()}
               disabled={!ready}
            >
               Connecter une banque
            </Button>
         ) : variant === "ghost" ? (
            <Button
               className="plaidlink-ghost"
               onClick={() => open()}
               variant="ghost"
            >
               <Image
                  src={"/icons/connect-bank.svg"}
                  alt="Connecter une banque"
                  width={24}
                  height={24}
               />
               <p className="hidden xl:block text-[16px] font-semibold text-black-2">
                  Ajouter une banque
               </p>
            </Button>
         ) : (
            <Button className="plaidlink-default" onClick={() => open()}>
               <Image
                  src={"/icons/connect-bank.svg"}
                  alt="Connecter une banque"
                  width={24}
                  height={24}
               />
               <p className="text-[16px] font-semibold text-black-2">
                  Ajouter une banque
               </p>
            </Button>
         )}
      </>
   );
};

export default PlaidLink;
