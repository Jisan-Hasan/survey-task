"use server";

import { endsWith } from "lodash";
import { EndpointType } from "./types";

const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
const endpoints: EndpointType = {
    // auth
    login: "/auth/login/",
    refresh: "/auth/refresh/",
    profile: "/auth/profile/",

    // users
    users: "/users/",

    // surveys
    surveys: "/surveys/",
};

export async function getEndpoint(key: keyof EndpointType, pathname?: string) {
    const base = await getBaseUrl();

    let endpoint = `${base}${endpoints[key]}`;

    if (pathname) {
        endpoint += pathname;
        if (!endsWith(pathname, "/")) {
            endpoint += "/";
        }
    }

    return endpoint;
}

export async function getBaseUrl() {
    return `${baseUrl}`;
}
