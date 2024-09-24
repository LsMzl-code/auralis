import {
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "./input";
import { z } from "zod";

import { Control, FieldPath } from "react-hook-form";
import { authFormSchema } from "@/schemas/auth";

const formSchema  = authFormSchema('sign-up')

interface CustomInput {
   control: Control<z.infer<typeof formSchema>>;
   name: FieldPath<z.infer<typeof formSchema>>;
   type: string;
   label: string;
   placeholder: string;
   description?: string;
}

export const CustomInput: React.FC<CustomInput> = ({
   control,
   name,
   type = "text",
   label,
   placeholder,
   description,
}) => {
   return (
      <FormField
         control={control}
         name={name}
         render={({ field }) => (
            <div className="form-item">
               <FormLabel className="form-label" htmlFor={name}>{label}</FormLabel>
               <FormDescription>{description}</FormDescription>
               <div className="flex w-full flex-col">
                  <FormControl>
                     <Input
                        placeholder={placeholder}
                        {...field}
                        // className="input-class"
                        type={type}
                        id={name}
                        name={name}
                     />
                  </FormControl>
                  <FormMessage className="form-message mt-2" />
               </div>
            </div>
         )}
      />
   );
};
