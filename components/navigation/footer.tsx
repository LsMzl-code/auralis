"use client";
import { logOut } from "@/actions/user.actions";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Footer = ({ user, type }: FooterProps) => {
   //*** HOOKS ***//
   const router = useRouter();
   //*** DECONNEXION ***//
   const handleLogOut = async () => {
      const loggedOut = await logOut();

      if (loggedOut) router.push("/connexion");
   };

   return (
      <footer className="footer">
         <div
            className={type === "mobile" ? "footer_name-mobile" : "footer_name"}
         >
            <p className="text-xl font-bold text-gray-700">{user?.firstName[0]}</p>
         </div>
         <div className={type === "mobile" ? "footer_email-mobile" : "email"}>
            <h1 className="text-14 truncate font-semibold text-gray-700">
               {user?.firstName}
            </h1>
            <p className="text-14 truncate font-normal text-gray-600">
               {user.email}
            </p>
         </div>
         <div className="footer_image" onClick={handleLogOut}>
            <Image
               src={"/icons/logout.svg"}
               alt="Icone de déconnexion"
               width={20}
               height={20}
            />
         </div>
      </footer>
   );
};

export default Footer;
