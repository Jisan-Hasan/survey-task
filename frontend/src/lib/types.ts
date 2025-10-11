import { z } from "zod";

export type EndpointType = {
    // auth
    login: string;
    refresh: string;
    profile: string;

    // users
    users: string;

    // surveys
    surveys: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyType = any;

export type QueryParamType = {
    pathname?: string;
    params?: AnyType;
};

export type OptionType = { name: AnyType; id: string };

export type FieldType = {
    name: string;
    label?: string;
    type?: string;
    placeholder?: string;
    description?: string;
    required?: boolean;
    readonly?: boolean;
    disabled?: boolean;
    options?: OptionType[];
    rows?: number;
    maxShow?: number;
    onChange?: (e: AnyType) => void;
    disablePrevious?: boolean;
    fromDate?: Date;
};

export type FormType = {
    data: {
        fields: FieldType[][];
        schema: z.ZodSchema;
        defaultValues: unknown;
        values?: AnyType;
    };
    handleSubmit?: AnyType;
    handleCancel?: AnyType;
    submitButtonText?: string;
    disableSubmit?: boolean;
};

export type FormFieldType = {
    form: AnyType;
    data: FieldType;
    classNames?: string;
};
