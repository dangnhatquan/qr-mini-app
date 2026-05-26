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
  inputMode?: "search" | "text" | "none" | "tel" | "url" | "email" | "numeric" | "decimal";
  formatter?: (value: any) => string;
  parser?: (value: string) => any;
}

export const InputFormField = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = "text",
  required,
  helperText,
  inputMode,
  formatter,
  parser,
}: InputFormFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange, ...fieldProps }, formState: { errors } }) => {
        const fieldError = get(errors, name) as FieldError | undefined;

        const displayValue = formatter ? formatter(value) : value;

        const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const rawVal = e.target.value;
          const parsedVal = parser ? parser(rawVal, displayValue) : rawVal;
          onChange(parsedVal);
        };

        const inputProps = {
          ...fieldProps,
          value: displayValue ?? "",
          onChange: handleValueChange,
          label: (
            <span className="text-sm font-medium">
              {label} {required && <span className="text-red-500">*</span>}
            </span>
          ),
          placeholder: placeholder,
          helperText: helperText,
          errorText: fieldError?.message,
          status: (fieldError ? "error" : undefined) as any,
          inputMode: inputMode,
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
