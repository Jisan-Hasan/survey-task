"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AnyType, FormType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import RenderField from "../fields/render-field";

export default function FormComponent({
    data,
    handleSubmit,
    handleCancel,
    submitButtonText,
    disableSubmit = false,
}: FormType) {
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);

    const form = useForm<AnyType>({
        resolver: zodResolver(data?.schema as AnyType),
        defaultValues: data?.defaultValues,
    });

    const onSubmit = async (values: z.infer<typeof data.schema>) => {
        // Simple guard to prevent multiple submissions
        if (isSubmittingForm) {
            return;
        }
        setIsSubmittingForm(true);
        try {
            await handleSubmit(values);
        } finally {
            setIsSubmittingForm(false);
        }
    };

    useEffect(() => {
        if (data?.values) {
            Object.keys(data?.values)?.forEach((key) => {
                if (data?.defaultValues?.hasOwnProperty(key)) {
                    form?.setValue(key, data?.values[key]);
                }
            });
        }
    }, [data, form]);

    return (
        <Form {...form}>
            <form
                className="flex flex-col flex-1 gap-6"
                onSubmit={form?.handleSubmit(onSubmit)}
            >
                <div className="flex flex-col gap-4">
                    {data?.fields?.map((group, index) => {
                        if (group?.length) {
                            return (
                                <div
                                    className="flex flex-col md:flex-row gap-4"
                                    key={index}
                                >
                                    {group?.map((field) => (
                                        <RenderField
                                            key={field?.name}
                                            form={form}
                                            data={field}
                                            classNames={`w-full`}
                                        />
                                    ))}
                                </div>
                            );
                        }
                    })}
                </div>
                <div className="flex justify-end gap-2">
                    {handleCancel && (
                        <Button
                            type="button"
                            variant="destructive"
                            className="w-[150px]"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    )}
                    <span
                        className={`${
                            disableSubmit ||
                            isSubmittingForm ||
                            form?.formState?.isSubmitting
                                ? "cursor-not-allowed"
                                : ""
                        }`}
                    >
                        <Button
                            type="submit"
                            className={`w-[150px]`}
                            disabled={
                                disableSubmit ||
                                isSubmittingForm ||
                                form?.formState?.isSubmitting
                            }
                        >
                            {isSubmittingForm ||
                            form?.formState?.isSubmitting ? (
                                <>
                                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                    Please Wait
                                </>
                            ) : (
                                <span>{submitButtonText || "Submit"}</span>
                            )}
                        </Button>
                    </span>
                </div>
            </form>
        </Form>
    );
}
