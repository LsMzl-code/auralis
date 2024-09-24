"use client";
import {
   Sheet,
   SheetClose,
   SheetContent,
   SheetTrigger,
} from "@/components/ui/sheet";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "./footer";

const MobileNav = ({ user }: MobileNavProps) => {
   //*** HOOKS ***//
   const pathname = usePathname();
   return (
      <section className="w-full">
         <Sheet>
            <SheetTrigger>
               <Image
                  src={"/icons/hamburger.svg"}
                  width={30}
                  height={30}
                  alt="Menu"
                  className="cursor-pointer"
               />
            </SheetTrigger>
            <SheetContent
               side="left"
               className="border-none bg-white max-w-[300px]"
            >
               <nav className="flex flex-col gap-1">
                  {/* Logo */}
                  <Link
                     href={"/"}
                     className="cursor-pointer items-center gap-1 flex"
                  >
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

                  {/* Links */}
                  <div className="mobilenav-sheet">
                     <SheetClose asChild>
                        <nav className="flex h-full flex-col gap-6 pt-16 text-white mr-10">
                           {sidebarLinks.map((item) => {
                              const isActive =
                                 pathname === item.route ||
                                 pathname.startsWith(`${item.route}/`);

                              return (
                                 <SheetClose asChild key={item.label}>
                                    <Link
                                       href={item.route}
                                       className={cn(
                                          "mobilenav-sheet_close w-full",
                                          {
                                             "bg-bank-gradient": isActive,
                                          }
                                       )}
                                    >
                                       <Image
                                          src={item.imgURL}
                                          alt={item.label}
                                          width={20}
                                          height={20}
                                          className={cn({
                                             "brightness-[3] invert-0":
                                                isActive,
                                          })}
                                       />
                                       <p
                                          className={cn(
                                             "text-16 font-semibold text-black-2",
                                             {
                                                "!text-white": isActive,
                                             }
                                          )}
                                       >
                                          {item.label}
                                       </p>
                                    </Link>
                                 </SheetClose>
                              );
                           })}
                        </nav>
                     </SheetClose>
                     <Footer user={user} type='mobile'/>
                  </div>
               </nav>
            </SheetContent>
         </Sheet>
      </section>
   );
};

export default MobileNav;
