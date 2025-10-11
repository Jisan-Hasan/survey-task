import { clsx, type ClassValue } from "clsx";
import { isArray, isString, replace, startCase, upperFirst } from "lodash";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { AnyType, FieldType } from "./types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getFieldLabel(data: FieldType) {
    if (data?.label) {
        return data?.label;
    }

    return startCase(replace(data?.name, "_", " "));
}

export function getFieldPlaceholder(data: FieldType) {
    if (data?.placeholder) {
        return data?.placeholder;
    }

    return getFieldLabel(data);
}

export function handleResponse(response: AnyType) {
    console.log("form response", response);
    if (response?.success) {
        if (response?.message) {
            toast?.success(response?.message);
        }

        return true;
    } else {
        if (
            response?.errors &&
            typeof response?.errors === "object" &&
            Object.keys(response?.errors).length > 0
        ) {
            Object.keys(response?.errors).forEach((key: string) => {
                if (isArray(response?.errors[key])) {
                    response?.errors[key]?.forEach((error: string) => {
                        toast?.error(upperFirst(error));
                    });
                }
                if (isString(response?.errors[key])) {
                    toast?.error(upperFirst(response?.errors[key]));
                }
            });

            return false;
        }

        if (response?.message) {
            toast?.error(upperFirst(response?.message));
        }

        return false;
    }
}

export function isPathActive(currentPath: string, menuUrl: string): boolean {
    // For the root path
    if (menuUrl === "/") {
        return currentPath === "/";
    }

    // Default case - check if path starts with menu URL
    return currentPath?.startsWith(menuUrl);
}
