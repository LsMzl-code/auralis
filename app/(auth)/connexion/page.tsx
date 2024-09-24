import { getLoggedInUser } from "@/actions/user.actions";
import AuthForm from "@/components/auth-form";
import { redirect } from "next/navigation";

const ConnexionPage = async () => {
   //*** CURRENT USER DATA ***//
   const currentUser = await getLoggedInUser();
   
   return (
      <section className="flex-center size-full max-sm:px-6">
         <AuthForm type="sign-in" />
      </section>
   );
};

export default ConnexionPage;
