/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { Blog } from "../models";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type BlogUpdateFormInputValues = {
    name?: string;
};
export declare type BlogUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
};
export declare type FormProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type BlogUpdateFormOverridesProps = {
    BlogUpdateFormGrid?: FormProps<GridProps>;
    name?: FormProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type BlogUpdateFormProps = React.PropsWithChildren<{
    overrides?: BlogUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    blog?: Blog;
    onSubmit?: (fields: BlogUpdateFormInputValues) => BlogUpdateFormInputValues;
    onSuccess?: (fields: BlogUpdateFormInputValues) => void;
    onError?: (fields: BlogUpdateFormInputValues, errorMessage: string) => void;
    onCancel?: () => void;
    onChange?: (fields: BlogUpdateFormInputValues) => BlogUpdateFormInputValues;
    onValidate?: BlogUpdateFormValidationValues;
}>;
export default function BlogUpdateForm(props: BlogUpdateFormProps): React.ReactElement;
