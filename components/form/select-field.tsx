"use client";

import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NONE_VALUE = "__none__";

interface SelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  options: readonly { value: string; label: string }[];
  placeholder?: string;
  /** Se informado, adiciona uma opção com esse texto que limpa o campo. */
  clearLabel?: string;
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  options,
  placeholder,
  clearLabel,
}: SelectFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Select
          value={field.value ? String(field.value) : ""}
          onValueChange={(value) => field.onChange(value === NONE_VALUE ? undefined : value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent>
            {clearLabel && <SelectItem value={NONE_VALUE}>{clearLabel}</SelectItem>}
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    />
  );
}
