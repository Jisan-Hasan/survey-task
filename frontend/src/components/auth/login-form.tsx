"use client";

import { login } from "@/app/(public)/(auth)/actions";
import FormComponent from "@/components/common/form-component";
import { handleResponse } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";

import { useRouter } from "next/navigation";
import { z } from "zod";

export default function LoginForm() {
    const router = useRouter();
    const { getProfile } = useAuth();

    const fields = [
        [{ name: "email", label: "Email", required: true }],
        [
            {
                name: "password",
                type: "password",
                label: "Password",
                required: true,
            },
        ],
    ];

    const schema = z.object({
        email: z
            .string()
            .min(1, { message: "Email is required" })
            .email({ message: "Invalid email address" }),
        password: z.string().min(1, { message: "Password is required" }),
    });

    const defaultValues = {
        email: "",
        password: "",
    };

    const handleSubmit = async (values: z.infer<typeof schema>) => {
        const response = await login(values);

        const status = handleResponse(response);
        if (status) {
            router.push("/dashboard");

            await getProfile();
        }
    };

    return (
        <FormComponent
            data={{ fields, schema, defaultValues }}
            handleSubmit={handleSubmit}
            handleCancel={() => router.push("/")}
        />
    );
}
