import { Select } from "zmp-ui";
import { Controller, Control, FieldValues, Path, FieldError } from "react-hook-form";
import { get } from "radash";

const { Option } = Select;

interface SelectFormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  options: { value: string | number; label: string }[];
  required?: boolean;
  helperText?: string;
  defaultValue?: string | number;
}

export const SelectFormField = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  options,
  required,
  helperText,
  defaultValue,
}: SelectFormFieldProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, formState: { errors } }) => {
        const fieldError = get(errors, name) as FieldError | undefined;

        return (
          <div className="mb-4">
            <Select
              {...field}
              label={
                <span className="text-sm font-medium">
                  {label} {required && <span className="text-red-500">*</span>}
                </span>
              }
              placeholder={placeholder}
              helperText={helperText}
              errorText={fieldError?.message}
              status={fieldError ? "error" : undefined}
              onChange={(value) => field.onChange(value)}
              value={field.value || defaultValue}
            >
              {options.map((opt) => (
                <Option key={opt.value} value={opt.value} title={opt.label} />
              ))}
            </Select>
          </div>
        );
      }}
    />
  );
};
