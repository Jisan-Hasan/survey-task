"use server";

import { logout, setCookies } from "@/app/(public)/(auth)/actions";
import axios from "axios";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getEndpoint } from "./endpoints";
import { AnyType, EndpointType, QueryParamType } from "./types";

const api = axios.create();

api.interceptors.request.use(
    async (request) => {
        const access = await (cookies() as AnyType)?.get("access")?.value;
        if (access) {
            request.headers["Authorization"] = `Bearer ${access}`;
        }

        return request;
    },
    (error) => {
        return Promise.reject(error);
    }
);

createAuthRefreshInterceptor(api, async (failedRequest) => {
    const refresh = await (cookies() as AnyType)?.get("refresh")?.value;
    const endpoint = await getEndpoint("refresh");

    return axios
        .post(endpoint, { refresh })
        .then(async (response) => {
            await setCookies(response);
            failedRequest.response.config.headers[
                "Authorization"
            ] = `Bearer ${response?.data?.data?.access}`;

            return Promise.resolve();
        })
        .catch(async () => {
            await logout();
        });
});

const queryParamDefaultValue = {
    pathname: "",
    params: {},
};

export async function getRequest(
    url: keyof EndpointType,
    query: QueryParamType = queryParamDefaultValue
) {
    const endpoint = await getEndpoint(url, query.pathname);
    const time = new Date().getTime();

    // console the api endpoint being called
    console.log(
        "API Request:",
        endpoint,
        "Pathname:",
        query?.pathname,
        "Params:",
        query?.params,
        "Time:",
        time
    );

    return await api
        .get(endpoint, {
            params: {
                time,
                limit: 10000000,
                offset: 0,
                ...query?.params,
            },
        })
        .then((response) => response?.data)
        .catch(async (error) => {
            if (error?.status === 401) {
                redirect("/login");
            }
            Promise.reject(error?.response?.data);
        });
}

export async function postRequest(
    url: keyof EndpointType,
    values: unknown,
    query: QueryParamType = queryParamDefaultValue
) {
    const endpoint = await getEndpoint(url, query.pathname);

    // console the api endpoint being called
    console.log(
        "POST Request:",
        endpoint,
        "Pathname:",
        query?.pathname,
        "Params:",
        query?.params,
        "Body:",
        values
    );

    return await api
        .post(endpoint, values, {
            params: { ...query?.params },
        })
        .then((res) => {
            // console.log('postRequest response', res)
            return handleSuccess(res);
        })
        .catch(async (error) => {
            // console.log('postRequest error', error?.response)
            return await handleError(error);
        });
}

export async function patchRequest(
    url: keyof EndpointType,
    values: unknown,
    query: QueryParamType = queryParamDefaultValue
) {
    const endpoint = await getEndpoint(url, query.pathname);

    // console the api endpoint being called
    console.log(
        "PATCH Request:",
        endpoint,
        "Pathname:",
        query?.pathname,
        "Params:",
        query?.params,
        "Body:",
        values
    );

    return await api
        .patch(endpoint, values)
        .then((res) => {
            return handleSuccess(res);
        })
        .catch(async (error) => {
            return await handleError(error);
        });
}

export async function putRequest(
    url: keyof EndpointType,
    values: unknown,
    query: QueryParamType = queryParamDefaultValue
) {
    const endpoint = await getEndpoint(url, query.pathname);

    // console the api endpoint being called
    console.log(
        "PUT Request:",
        endpoint,
        "Pathname:",
        query?.pathname,
        "Params:",
        query?.params,
        "Body:",
        values
    );

    return await api
        .put(endpoint, values)
        .then((res) => {
            return handleSuccess(res);
        })
        .catch(async (error) => {
            return await handleError(error);
        });
}

export async function handleSuccess(response: AnyType) {
    return {
        success: true,
        message: response?.data?.message,
        data: response?.data?.data || response?.data,
        errors: null,
    };
}

export async function handleError(error: AnyType) {
    if (
        error?.response?.data?.errors?.detail ===
        "No active account found with the given credentials"
    ) {
        return {
            success: false,
            message:
                error?.response?.data?.errors?.detail ||
                "Invalid Email or Password",
            data: null,
            errors: null,
        };
    }
    if (error?.status === 401) {
        redirect("/login");
    }
    return {
        success: false,
        message:
            error?.response?.data?.message ||
            "Something went wrong. Please try again",
        data: null,
        errors: error?.response?.data?.errors,
    };
}
