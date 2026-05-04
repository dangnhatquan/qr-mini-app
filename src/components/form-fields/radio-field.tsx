import React from "react";
import { Radio } from "zmp-ui";
import { Controller, Control, FieldValues, Path } from "react-hook-form";

interface RadioFormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: { value: string | number; label: string }[];
  helperText?: string;
  required?: boolean;
}

export const RadioFormField = <T extends FieldValues>({
  name,
  control,
  label,
  options,
  helperText,
  required,
}: RadioFormFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error: fieldError } }) => (
        <div className="mb-4">
          <div className="text-sm font-medium mb-2">
            {label} {required && <span className="text-red-500">*</span>}
          </div>
          <Radio.Group {...field} onChange={(value) => field.onChange(value)} value={field.value}>
            {options.map((opt) => (
              <Radio key={opt.value} value={opt.value} label={opt.label} />
            ))}
          </Radio.Group>
          {(fieldError?.message || helperText) && (
            <div className={`text-xs mt-1 ${fieldError ? "text-red-500" : "text-gray-500"}`}>
              {fieldError?.message || helperText}
            </div>
          )}
        </div>
      )}
    />
  );
};
