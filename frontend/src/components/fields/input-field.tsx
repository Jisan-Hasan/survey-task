import { FormFieldType } from "@/lib/types";
import { getFieldLabel, getFieldPlaceholder } from "@/lib/utils";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

export default function InputField({ form, data, classNames }: FormFieldType) {
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
                        <Input
                            type={data.type || "text"}
                            placeholder={getFieldPlaceholder(data)}
                            {...field}
                            readOnly={data.readonly || false}
                            disabled={data.disabled || false}
                        />
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
