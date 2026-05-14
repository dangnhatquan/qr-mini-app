import { Select, Text } from "zmp-ui";
import { Controller, Control, FieldValues, Path, FieldError } from "react-hook-form";
import { get } from "radash";

const { Option } = Select;

interface SelectFormFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
  options: { value: string | number; label: string; description: string; image?: string }[];
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
              closeOnSelect={true}
            >
              {options.map((opt) => (
                <Option value={opt.value} key={opt.value} title={`${opt.label}`}>
                  <div className="flex gap-x-2 w-full">
                    {opt.image && <img className="h-8" src={opt.image} alt={opt.label} />}
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{opt.label}</span>
                      {opt.description && (
                        <Text className="text-xs max-w-[200px] text-gray-500 truncate">
                          {opt.description}
                        </Text>
                      )}
                    </div>
                  </div>
                </Option>
              ))}
            </Select>
          </div>
        );
      }}
    />
  );
};
