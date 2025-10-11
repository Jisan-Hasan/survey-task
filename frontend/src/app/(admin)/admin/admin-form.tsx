/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import FormComponent from "@/components/common/form-component";
import LoadingSpinner from "@/components/common/loading-spinner";
import { GetQuery } from "@/lib/queries";
import { patchRequest, postRequest } from "@/lib/requests";
import { AnyType, FieldType } from "@/lib/types";
import { handleResponse } from "@/lib/utils";
import { activationOptions } from "@/lib/variable";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import z from "zod";

export default function AdminUserForm({ id }: { id?: string }) {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState<AnyType>(null);

    const { data, isLoading: isQueryLoading } = GetQuery(
        "users",
        { pathname: id },
        id ? true : false
    );

    const values = data?.data || {};

    const fields: FieldType[][] = [
        [
            { name: "full_name", label: "Name", required: true },
            { name: "email", label: "Email", required: true },
            ...(id
                ? [
                      {
                          name: "is_active",
                          label: "Active Status",
                          type: "select",
                          options: activationOptions,
                          required: true,
                      },
                  ]
                : []),
        ],
        [
            ...(id
                ? []
                : [
                      { name: "password", label: "Password", required: true },
                      {
                          name: "is_active",
                          label: "Active Status",
                          type: "select",
                          options: activationOptions,
                          required: true,
                      },
                  ]),
        ],
    ];

    const schema = z.object({
        full_name: z?.string().nonempty({ message: "Name is required" }),
        email: z?.string().email().nonempty({ message: "Email is required" }),
        password: id
            ? z.any().optional()
            : z?.string().nonempty({ message: "Password is required" }),
        is_active: z
            ?.string()
            .nonempty({ message: "Active status is required" }),
    });

    const defaultValues = {
        full_name: "",
        email: "",
        password: "",
        is_active: "",
    };

    useEffect(() => {
        if (!isQueryLoading) {
            if (id && values) {
                setFormData({
                    ...values,
                    is_active: values?.is_active ? "true" : "false",
                });
            } else {
                setFormData(defaultValues);
            }
            setIsLoading(false);
        }
    }, [id, values, isQueryLoading]);

    const handleSubmit = async (values: z.infer<typeof schema>) => {
        let response = null;

        const payload = {
            full_name: values?.full_name,
            email: values?.email,
            role: "admin",
        };

        if (id) {
            response = await patchRequest("users", payload, { pathname: id });
        } else {
            response = await postRequest("users", {
                ...payload,
                password: values?.password,
            });
        }

        const status = handleResponse(response);

        if (status) {
            queryClient?.refetchQueries({ queryKey: ["users"] });
            router.back();
        }
    };

    const handleCancel = () => {
        router.back();
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <FormComponent
            data={{
                fields,
                schema,
                defaultValues: formData,
                values: formData,
            }}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
        />
    );
}
