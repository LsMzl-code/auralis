"use server";

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "@/lib/appwrite";
import { cookies } from "next/headers";
import {
   encryptId,
   extractCustomerIdFromUrl,
   parseStringify,
} from "@/lib/utils";
import { plaidClient } from "@/lib/plaid";
import { revalidatePath } from "next/cache";
import {
   CountryCode,
   ProcessorTokenCreateRequest,
   ProcessorTokenCreateRequestProcessorEnum,
   Products,
} from "plaid";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

const {
   APPWRITE_DATABASE_ID: DATABASE_ID,
   APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
   APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

/**
 * Récupération des informations utilisateur depuis la database.
 * -
 * - Connexion à la database
 * - Sélection d'un utilisateur grâce à son id
 */
export const getUserInfo = async ({ userId }: getUserInfoProps) => {
   try {
      // Connect to database
      const { database } = await createAdminClient();

      // Get a specific user by it's ID from the database
      const user = await database.listDocuments(
         DATABASE_ID!,
         USER_COLLECTION_ID!,
         [Query.equal("userId", [userId])]
      );

      return parseStringify(user.documents[0]);
   } catch (error) {
      console.error("Erreur dans getUserInfo", error);
   }
};

/**
 * Connexion utilisateur.
 * Créé une session utilisateur.
 * @param param0
 * @returns
 */
export const signIn = async ({ email, password }: signInProps) => {
   try {
      const { account } = await createAdminClient();

      //* Create user session
      const session = await account.createEmailPasswordSession(email, password);

      //* Store the session in the cookies
      cookies().set("appwrite-session", session.secret, {
         path: "/",
         httpOnly: true,
         sameSite: "strict",
         secure: true,
      });

      const user = await getUserInfo({ userId: session.userId });

      return parseStringify(user);
   } catch (error) {
      console.error(error);
   }
};

/**
 * Inscription utilisateur avec Appwrite.
 * -
 * - Création d'un client Dwolla.
 * - Inscrit l'utilisateur et créé une session
 * @param userData
 * @returns
 */
export const signUp = async ({ password, ...userData }: SignUpParams) => {
   let newUserAccount;

   try {
      const { account, database } = await createAdminClient();

      //* Create user account
      newUserAccount = await account.create(
         ID.unique(),
         userData.email,
         password,
         `${userData.firstName} ${userData.lastName}`
      );

      //! Empêche la suite du processus si la création utilisateur a échouée
      if (!newUserAccount)
         throw new Error("Erreur pendant la création de l'utilisateur");

      // Create a Dwolla customer account
      const dwollaCustomerUrl = await createDwollaCustomer({
         ...userData,
         type: "personal",
      });

      //! No dwollaCustomer created
      if (!dwollaCustomerUrl)
         throw new Error("Erreur pendant la création du dwollaCustomer");

      //* Get the customer Id
      const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

      //* Create the user in the database with the bank infos
      const newUser = await database.createDocument(
         DATABASE_ID!,
         USER_COLLECTION_ID!,
         ID.unique(),
         {
            ...userData,
            userId: newUserAccount.$id,
            dwollaCustomerId,
            dwollaCustomerUrl,
         }
      );

      //* Create user session
      const session = await account.createEmailPasswordSession(
         userData.email,
         password
      );

      //* Store the session in the cookies
      cookies().set("appwrite-session", session.secret, {
         path: "/",
         httpOnly: true,
         sameSite: "strict",
         secure: true,
      });

      //* Return user informations
      return parseStringify(newUser);
   } catch (error) {
      console.error(error);
   }
};

/**
 * Récupération des inormations de l'uitlisateur connecté.
 * -
 * @returns
 */
export async function getLoggedInUser() {
   try {
      const { account } = await createSessionClient();
      // Get the infos from the session
      const result = await account.get();

      // Get the user informations from the database with the id in the session
      const user = await getUserInfo({ userId: result.$id });

      return parseStringify(user);
   } catch (error) {
      return null;
   }
}

/**
 * Déconnexion utilisateur
 * -
 * @returns
 */
export const logOut = async () => {
   try {
      const { account } = await createSessionClient();
      cookies().delete("appwrite-session");

      await account.deleteSession("current");
   } catch (error) {
      return null;
   }
};

/**
 * Créé un link_token Plaid
 * -
 * @param user
 */
export const createLinkToken = async (user: User) => {
   try {
      const tokenParams = {
         user: {
            client_user_id: user.$id,
         },
         client_name: `${user.firstName} ${user.lastName}`,
         products: ["auth"] as Products[],
         language: "fr",
         country_codes: ["US"] as CountryCode[],
      };

      const response = await plaidClient.linkTokenCreate(tokenParams);

      return parseStringify({ linkToken: response.data.link_token });
   } catch (error) {
      console.error(error);
   }
};

/**
 *
 * @param param0
 * @returns
 */
export const createBankAccount = async ({
   userId,
   bankId,
   accountId,
   accessToken,
   fundingSourceUrl,
   shareableId,
}: createBankAccountProps) => {
   try {
      const { database } = await createAdminClient();

      const bankAccount = await database.createDocument(
         DATABASE_ID!,
         BANK_COLLECTION_ID!,
         ID.unique(),
         {
            userId,
            bankId,
            accountId,
            accessToken,
            fundingSourceUrl,
            shareableId,
         }
      );

      return parseStringify(bankAccount);
   } catch (error) {
      console.error(error);
   }
};

/**
 * - Echange du token publique vers un token d'accès
 * - Création d'un compte bancaire
 * - Récupération des informations du compte
 * - Liaison avec un processeur de paiement (Dwolla)
 * - Permission de tranférer des fonds entre plusieurs comptes
 * @param param0
 */
export const exchangePublicToken = async ({
   publicToken,
   user,
}: exchangePublicTokenProps) => {
   try {
      // Echange un token publique pour une token d'accès et item ID
      const response = await plaidClient.itemPublicTokenExchange({
         public_token: publicToken,
      });

      const accessToken = response.data.access_token;
      const itemId = response.data.item_id;

      // Récupération des information du compte depuis Plaid grâce au token d'accès
      const accountsResponse = await plaidClient.accountsGet({
         access_token: accessToken,
      });

      const accountData = accountsResponse.data.accounts[0];

      // Création d'un 'processor token' pour Dwolla, utilisant le token d'accès et les l'ID du compte
      const request: ProcessorTokenCreateRequest = {
         access_token: accessToken,
         account_id: accountData.account_id,
         processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
      };

      const processorTokenResponse = await plaidClient.processorTokenCreate(
         request
      );
      const processorToken = processorTokenResponse.data.processor_token;

      // Création d'un url 'funding source' pour le compte en utilisant L'id client Dwolla, processor token, et le nom de la banque
      const fundingSourceUrl = await addFundingSource({
         dwollaCustomerId: user.dwollaCustomerId,
         processorToken,
         bankName: accountData.name,
      });

      //! Funding source Url non créée
      if (!fundingSourceUrl) throw Error;

      // Création d'un compte bancaire avec le user ID, item ID, account ID, access token, fundingSourceUrl, et Id partageable
      await createBankAccount({
         userId: user.$id,
         bankId: itemId,
         accountId: accountData.account_id,
         accessToken,
         fundingSourceUrl,
         shareableId: encryptId(accountData.account_id),
      });

      // Mise à jour du cache
      revalidatePath("/");

      // Message de succès
      return parseStringify({
         publicTokenExchange: "terminé",
      });
   } catch (error) {
      console.error(
         "Une erreur est survenue pendant la création du token d'échange: ",
         error
      );
   }
};

/**
 * Récupération d'une banque selon son id
 * -
 * - Connexion à la database
 * - Sélection d'une banque selon l'id choisi
 * @param param0
 * @returns
 */
export const getBank = async ({ documentId }: getBankProps) => {
   try {
      // Connect to database
      const { database } = await createAdminClient();

      // Get a specific bank by it's ID for a user from the database
      const bank = await database.listDocuments(
         DATABASE_ID!,
         BANK_COLLECTION_ID!,
         [Query.equal("$id", [documentId])]
      );

      return parseStringify(bank.documents[0]);
   } catch (error) {
      console.error(error);
   }
};

/**
 * 
 * @param param0 
 * @returns 
 */
export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
   try {
      // Connect to database
      const { database } = await createAdminClient();

      // Get a specific bank by it's ID for a user from the database
      const bank = await database.listDocuments(
         DATABASE_ID!,
         BANK_COLLECTION_ID!,
         [Query.equal("accountId", [accountId])]
      );

      if(bank.total !== 1 ) return null;

      return parseStringify(bank.documents[0]);
   } catch (error) {
      console.error(error);
   }
};

/**
 * Récupération de toutes les banques d'un utilisateur
 * -
 * - Connexion à la database
 * - Récupération de toutes les banques de l'utilisateur connecté
 * @param param0
 * @returns
 */
export const getBanks = async ({ userId }: getBanksProps) => {
   try {
      // Connect to database
      const { database } = await createAdminClient();

      // Get the banks for a user from the database
      const banks = await database.listDocuments(
         DATABASE_ID!,
         BANK_COLLECTION_ID!,
         [Query.equal("userId", [userId])]
      );

      return parseStringify(banks.documents);
   } catch (error) {
      console.error(error);
   }
};
