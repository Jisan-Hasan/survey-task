import { FormFieldType } from "@/lib/types";
import InputField from "./input-field";
import PasswordField from "./password-field";
import SelectField from "./select-field";

export default function RenderField({ form, data, classNames }: FormFieldType) {
    switch (data.type) {
        case "password":
            return (
                <PasswordField
                    form={form}
                    data={data}
                    classNames={classNames}
                />
            );
        case "select":
            return (
                <SelectField form={form} data={data} classNames={classNames} />
            );
        default:
            return (
                <InputField form={form} data={data} classNames={classNames} />
            );
    }
}
