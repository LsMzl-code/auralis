import { getLoggedInUser } from "@/actions/user.actions";
import MobileNav from "@/components/navigation/mobile-nav";
import Sidebar from "@/components/navigation/sidebar";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   //*** CURRENT USER ***//
   const loggedIn = await getLoggedInUser();

   if (!loggedIn) redirect("/connexion");

   return (
      <main className="flex h-screen w-full font-inter">
         <Sidebar user={loggedIn} />
         <div className="flex size-full flex-col">
            <div className="root-layout">
               <Image
                  src="/img/logo-bank.png"
                  width={30}
                  height={30}
                  alt="logo"
               />
               <div>
                  <MobileNav user={loggedIn} />
               </div>
            </div>
            {children}
         </div>
      </main>
   );
}
