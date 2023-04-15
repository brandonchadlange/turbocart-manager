import { FormController, useFormController } from "@/components/form";
import axios from "axios";
import { useState } from "react";

type FormMode = "create" | "update";

export type CategoryFormController = {
  fc: FormController<CreateCategoryRequest>;
  isSubmitting: boolean;
};

type UseCategoryFormControllerProps = {
  afterSubmitted?: () => void;
};

const useCategoryFormController = (props: UseCategoryFormControllerProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<FormMode>("create");

  const fc = useFormController<CreateCategoryRequest>({
    initialValues: {
      name: "",
      description: "",
    },
    async handleSubmit(data) {
      setIsSubmitting(true);
      await axios.post<CategoryListItem>(
        "http://localhost:3000/api/category",
        data
      );
      setIsSubmitting(false);
      if (props.afterSubmitted) {
        props.afterSubmitted();
      }
    },
  });

  return {
    fc,
    isSubmitting,
    mode,
    setModeToCreate() {
      fc.reset();
      setMode("create");
    },
    setModeToUpdate(values: Partial<CreateCategoryRequest>) {
      fc.setValues(values);
      setMode("update");
    },
  };
};

export default useCategoryFormController;
