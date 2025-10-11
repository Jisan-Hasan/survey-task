"use client";

import { Button } from "@/components/ui/button";
import type { FormFieldType } from "@/lib/types";
import { getFieldLabel } from "@/lib/utils";
import { XCircle } from "lucide-react";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

export default function SelectField({ form, data, classNames }: FormFieldType) {
    const handleClear = () => {
        form?.setValue(data?.name, "");
    };

    const hasValue = !!form?.watch(data?.name);

    return (
        <FormField
            control={form?.control}
            name={data?.name}
            render={({ field }) => (
                <FormItem className={`space-y-1 ${classNames} max-w-full`}>
                    <FormLabel>
                        {getFieldLabel(data)}{" "}
                        {data?.required ? (
                            <sup className="text-red-500">*</sup>
                        ) : (
                            ""
                        )}
                    </FormLabel>
                    <div className="relative ">
                        <Select
                            onValueChange={(value) => {
                                field?.onChange(value);
                                if (data?.onChange) data?.onChange(value);
                            }}
                            value={field?.value ? String(field?.value) : ""}
                            disabled={data?.disabled || false}
                        >
                            <FormControl>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                {data?.options?.map((option) => (
                                    <SelectItem
                                        key={option?.id}
                                        value={String(option?.id)}
                                    >
                                        {option?.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {hasValue && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-2 h-auto hover:bg-transparent"
                                onClick={handleClear}
                                aria-label="Clear selection"
                            >
                                <XCircle className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        )}
                    </div>
                    {data?.description && (
                        <FormDescription>{data?.description}</FormDescription>
                    )}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
