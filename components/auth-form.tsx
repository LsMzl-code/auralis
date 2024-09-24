"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { authFormSchema } from "@/schemas/auth";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { CustomInput } from "./ui/custom-input";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn, signUp } from "@/actions/user.actions";
import PlaidLink from "./plaid-link";

const AuthForm = ({ type }: { type: string }) => {
   //*** STATES ***//
   const [user, setUser] = useState(null);
   const [isLoading, setIsLoading] = useState<boolean>(false);

   //*** HOOKS ***//
   const router = useRouter();

   const formSchema = authFormSchema(type);

   const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   const onSubmit = async (data: z.infer<typeof formSchema>) => {
      setIsLoading(true);
      try {
         const userData = {
            firstName: data.firstName!,
            lastName: data.lastName!,
            address1: data.address1!,
            city: data.city!,
            state: data.state!,
            postalCode: data.postalCode!,
            dateOfBirth: data.dateOfBirth!,
            ssn: data.ssn!,
            email: data.email,
            password: data.password,
         };
         if (type === "sign-up") {
            //
            const newUser = await signUp(userData);

            setUser(newUser);
         }
         if (type === "sign-in") {
            const response = await signIn({
               email: data.email,
               password: data.password,
            });

            if (response) router.push("/");
         }
      } catch (error) {
         console.error("error", error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <section className="auth-form">
         <header className="flex flex-col gap-5 md:gap-8">
            {/* Logo */}
            <Link href={"/"} className="cursor-pointer flex items-center gap-1">
               <Image
                  src={"/img/logo-bank.png"}
                  alt="Logo de l'entreprise"
                  width={34}
                  height={34}
               />
               <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">
                  Auralis
               </h1>
            </Link>
            <div className="flex flex-col gap-1 md:gap-3">
               <h1 className="text-24 lg:text-36 font-semibold text-gray-900">
                  {user
                     ? "Lier un compte"
                     : type === "sign-in"
                     ? "Connexion"
                     : "Inscription"}
               </h1>
               <p className="text-16 font-normal text-gray-600">
                  {user
                     ? "Lier un compte pour démarrer"
                     : "Veuillez saisir vos informations"}
               </p>
            </div>
         </header>

         {user ? (
            <div className="flex flex-col gap-4">
               <PlaidLink user={user} variant="primary" />
            </div>
         ) : (
            <>
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-5"
                  >
                     {type === "sign-up" && (
                        <>
                           <div className="flex gap-4">
                              {/* Firstname */}
                              <CustomInput
                                 control={form.control}
                                 name="firstName"
                                 type="text"
                                 label="Prénom"
                                 placeholder="Entrez votre prénom"
                              />
                              {/* Lastname */}
                              <CustomInput
                                 control={form.control}
                                 name="lastName"
                                 type="text"
                                 label="Nom"
                                 placeholder="Entrez votre nom"
                              />
                           </div>
                           <div className="flex gap-4">
                              {/* Address */}
                              <CustomInput
                                 control={form.control}
                                 name="address1"
                                 type="text"
                                 label="Adresse"
                                 placeholder="Entrez votre adresse"
                              />
                              {/* City */}
                              <CustomInput
                                 control={form.control}
                                 name="city"
                                 type="text"
                                 label="Ville"
                                 placeholder="Nom de votre ville"
                              />
                           </div>

                           <div className="flex gap-4">
                              {/* State */}
                              <CustomInput
                                 control={form.control}
                                 name="state"
                                 type="text"
                                 label="Département"
                                 placeholder="ex: 92"
                              />
                              {/* Postal */}
                              <CustomInput
                                 control={form.control}
                                 name="postalCode"
                                 type="text"
                                 label="Code postal"
                                 placeholder="ex: 29000"
                              />
                           </div>
                           <div className="flex gap-4">
                              {/* Birth */}
                              <CustomInput
                                 control={form.control}
                                 name="dateOfBirth"
                                 type="text"
                                 label="Date de naissance"
                                 placeholder="yyyy-mm-dd"
                              />
                              {/* SSN */}
                              <CustomInput
                                 control={form.control}
                                 name="ssn"
                                 type="text"
                                 label="SSN"
                                 placeholder="ex: 1234"
                              />
                           </div>
                        </>
                     )}
                     {/* Email */}
                     <CustomInput
                        control={form.control}
                        name="email"
                        type="email"
                        label="Email"
                        placeholder="Entrer votre email"
                     />
                     {/* Password */}
                     <CustomInput
                        control={form.control}
                        name="password"
                        type="password"
                        label="Mot de passe"
                        placeholder="Mot de passe"
                     />

                     <div className="flex flex-col gap-4">
                        <Button
                           type="submit"
                           className="form-btn"
                           disabled={isLoading}
                        >
                           {isLoading ? (
                              <>
                                 <Loader2 size={20} className="animate-spin" />
                              </>
                           ) : type === "sign-in" ? (
                              "Se connecter"
                           ) : (
                              "S'inscrire"
                           )}
                        </Button>
                     </div>
                  </form>
               </Form>
               <footer className="flex justify-center gap-1">
                  <p className="text-14 font-normal text-gray-600">
                     {type === "sign-in"
                        ? "Vous n'avez pas de compte ?"
                        : "Déjà inscrit ?"}
                  </p>
                  <Link
                     href={type === "sign-in" ? "/inscription" : "/connexion"}
                     className="form-link"
                  >
                     {type === "sign-in" ? "Inscription" : "Connexion"}
                  </Link>
               </footer>
            </>
         )}
      </section>
   );
};

export default AuthForm;
