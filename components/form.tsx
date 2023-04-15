import { useForm, UseFormReturnType } from "@mantine/form";
import { ReactNode } from "react";

type LooseKeys<Values> = keyof Values | (string & {});

type FormProps<T = any> = {
  controller: FormController<T>;
  children: ReactNode;
};

export type FormController<T> = {
  onSubmit: any;
  getInputProps: <Field extends LooseKeys<T>>(field: Field) => InputProps;
  reset: () => void;
  form: UseFormReturnType<T, (values: T) => T>;
  setValues: (values: Partial<T>) => void;
};

type UseFormControllerProps<T> = {
  initialValues: T;
  handleSubmit: (data: T) => void;
};

type InputProps = {
  value: any;
  onChange: any;
  checked?: any;
  error?: any;
  onFocus?: any;
  onBlur?: any;
};

const Form = (props: FormProps) => {
  const controller = props.controller;

  return <form onSubmit={controller.onSubmit}>{props.children}</form>;
};

export default Form;

export function useFormController<T>(
  props: UseFormControllerProps<T>
): FormController<T> {
  const form = useForm<T>({
    initialValues: props.initialValues,
  });

  return {
    getInputProps(key: any) {
      return form.getInputProps(key);
    },
    reset() {
      form.reset();
    },
    form: form,
    onSubmit: form.onSubmit(props.handleSubmit),
    setValues(values) {
      form.setValues(values);
    },
  };
}
