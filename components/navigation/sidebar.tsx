"use client";
import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import Footer from "./footer";
import PlaidLink from "../plaid-link";

const Sidebar = ({ user }: SiderbarProps) => {
   //*** HOOKS ***//
   const pathname = usePathname();

   return (
      <section className="sidebar">
         <nav className="flex flex-col gap-4">
            {/* Logo */}
            <Link
               href={"/"}
               className="mb-12 cursor-pointer items-center gap-2 flex"
            >
               <Image
                  src={"/img/logo-bank.png"}
                  alt="Logo de l'entreprise"
                  width={34}
                  height={34}
                  className="size-[30px] max-xl:size-16"
               />
               <h1 className="sidebar-logo">Auralis</h1>
            </Link>

            {/* Links */}
            {sidebarLinks.map((item) => {
               const isActive =
                  pathname === item.route ||
                  pathname.startsWith(`${item.route}/`);

               return (
                  <Link
                     href={item.route}
                     key={item.label}
                     className={cn("sidebar-link", {
                        "bg-bank-gradient": isActive,
                     })}
                  >
                     <div className="relative size-6">
                        <Image
                           src={item.imgURL}
                           alt={item.label}
                           fill
                           className={cn({
                              "brightness-[3] invert-0": isActive,
                           })}
                        />
                     </div>
                     <p className={cn('sidebar-label', {'!text-white': isActive})}>{item.label}</p>
                  </Link>
               );
            })}

            <PlaidLink user={user} />
         </nav>

         <Footer user={user} type='desktop'/>
      </section>
   );
};

export default Sidebar;
