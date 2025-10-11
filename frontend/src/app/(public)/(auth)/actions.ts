"use server";

import { getEndpoint } from "@/lib/endpoints";
import { handleError, handleSuccess } from "@/lib/requests";
import { AnyType } from "@/lib/types";
import axios, { AxiosResponse } from "axios";
import { cookies } from "next/headers";

export async function login(values: { email: string; password: string }) {
    const endpoint = await getEndpoint("login");
    return await axios
        .post(endpoint, {
            ...values,
        })
        .then(async (response) => {
            console.log(response);
            return await setCookies(response);
        })
        .catch(async (error) => {
            console.log(error?.response?.data?.errors?.detail);
            return await handleError(error);
        });
}

export async function refresh() {
    const refresh = await (cookies() as AnyType)?.get("refresh")?.value;

    if (!refresh) {
        await logout();
    }

    const endpoint = await getEndpoint("refresh");
    return await axios
        .post(endpoint, { refresh })
        .then(async (response) => {
            const result = await setCookies(response);
            if (result?.success) {
                return result;
            }

            await logout();
        })
        .catch(async () => {
            await logout();
        });
}

export async function logout() {
    await (cookies() as AnyType)?.delete("access");
    await (cookies() as AnyType)?.delete("refresh");
}

// export async function resetPassword(
//     values: { password: string },
//     token: string
// ) {
//     const endpoint = await getEndpoint("resetPassword");
//     return await axios
//         .put(endpoint, values, {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         })
//         .then(async (response) => {
//             console.log("response", response);
//             return await handleSuccess(response);
//         })
//         .catch(async (error) => {
//             console.log("error", JSON.stringify(error?.response?.data));

//             if (error?.response?.data) {
//                 return {
//                     success: false,
//                     message:
//                         error?.response?.data?.message ||
//                         "Something went wrong",
//                     data: null,
//                     errors: error?.response?.data?.errors,
//                 };
//             }
//         });
// }

export async function setCookies(response: AxiosResponse) {
    if (response?.data?.data?.refresh) {
        await setCookie("refresh", response?.data?.data?.refresh);
    }
    if (response?.data?.data?.access) {
        await setCookie("access", response?.data?.data?.access);

        return await handleSuccess(response);
    }

    return await handleError({ response });
}

export async function setCookie(key: string, value: string) {
    (cookies() as AnyType)?.set(key, value, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        sameSite: "lax",
        path: "/",
    });
}
