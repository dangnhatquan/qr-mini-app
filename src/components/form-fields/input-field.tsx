import React from "react";
import { Input } from "zmp-ui";
import { Controller, Control, FieldValues, Path, FieldError } from "react-hook-form";
import { get } from "radash";

interface InputFormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "password" | "number";
  required?: boolean;
  helperText?: string;
}

export const InputFormField = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
  required,
  helperText,
}: InputFormFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState: { errors } }) => {
        const fieldError = get(errors, name) as FieldError | undefined;

        const inputProps = {
          ...field,
          label: (
            <span className="text-sm font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </span>
          ),
          placeholder: placeholder,
          helperText: helperText,
          errorText: fieldError?.message,
          status: (fieldError ? "error" : undefined) as any,
        };

        return (
          <div className="mb-4">
            {type === "password" ? (
              <Input.Password {...inputProps} visibilityToggle />
            ) : (
              <Input {...inputProps} type={type} />
            )}
          </div>
        );
      }}
    />
  );
};
