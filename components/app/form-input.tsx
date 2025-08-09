"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

interface FormInputComponentProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  description?: string;
  placeholder?: string;
  type?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  addon?: React.ReactNode;
  autoComplete?: string;
  onBlur?: () => void;
  checked?: boolean;
}

export const Params = [
  {
    name: "control",
    type: "Control<T>",
  },
  {
    name: "name",
    type: "FieldPath<T>",
  },
  {
    name: "label?",
    type: "string",
  },
  {
    name: "description?",
    type: "string",
  },
  {
    name: "placeholder?",
    type: "string",
  },
  {
    name: "type?",
    type: "string",
  },
  {
    name: "className?",
    type: "string",
  },
  {
    name: "id?",
    type: "string",
  },
  {
    name: "addon?",
    type: "React.ReactNode",
  },
  {
    name: "autoComplete?",
    type: "string",
  },
  {
    name: "onBlur?",
    type: "() => void",
  },
  {
    name: "checked?",
    type: "boolean",
  },
  {
    name: "value?",
    type: "string",
  },
];

const FormInputComponent = <T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  type = "text",
  className = "",
  disabled = false,
  id = name as string,
  addon,
  autoComplete = "off",
  onBlur,
  checked,
}: FormInputComponentProps<T>) => {
  const [show, setShow] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel htmlFor={id}>{label}</FormLabel>}
          <FormControl>
            <div className="relative">
              {type === "textarea" ? (
                <Textarea
                  {...field}
                  placeholder={placeholder}
                  className={cn(
                    "border-white-bg",
                    addon ? "pr-16" : "pr-10",
                    className
                  )}
                  disabled={disabled}
                  id={id}
                  autoComplete={autoComplete}
                  onBlur={onBlur}
                />
              ) : (
                <Input
                  {...field}
                  type={
                    type === "password" ? (show ? "text" : "password") : type
                  }
                  checked={checked}
                  placeholder={placeholder}
                  className={cn(
                    "border-white-bg",
                    addon ? "pr-16" : "pr-10",
                    className
                  )}
                  disabled={disabled}
                  id={id}
                  autoComplete={autoComplete}
                  onBlur={onBlur}
                />
              )}

              {/* Password toggle or custom addon */}
              {type === "password" ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShow(!show)}
                  className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer"
                >
                  {!show ? <EyeOff size={18} /> : <Eye size={18} />}
                  <span className="sr-only">Toggle password visibility</span>
                </Button>
              ) : addon ? (
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                  {addon}
                </div>
              ) : null}
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage className="text-error text-left" />
        </FormItem>
      )}
    />
  );
};

FormInputComponent.Params = Params;

export default FormInputComponent;
