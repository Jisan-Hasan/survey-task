import { FormFieldType } from "@/lib/types";
import { getFieldLabel, getFieldPlaceholder } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export default function PasswordField({
    form,
    data,
    classNames,
}: FormFieldType) {
    const [showPassword, setShowPassword] = useState(false);

    // const locale = useLocale()

    return (
        <FormField
            control={form.control}
            name={data.name}
            render={({ field }) => (
                <FormItem className={`space-y-1 ${classNames}`}>
                    <FormLabel>
                        {getFieldLabel(data)}{" "}
                        {data.required ? (
                            <sup className="text-red-500">*</sup>
                        ) : (
                            ""
                        )}
                    </FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder={getFieldPlaceholder(data)}
                                {...field}
                                readOnly={data.readonly || false}
                                disabled={data.disabled || false}
                            />
                            <button
                                type="button"
                                className={`absolute top-1/2 transform -translate-y-1/2 text-gray-500  right-2`}
                                onClick={() => setShowPassword((prev) => !prev)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </FormControl>
                    {data.description && (
                        <FormDescription>{data.description}</FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
