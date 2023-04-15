import { FormController, useFormController } from "@/components/form";
import axios from "axios";
import { useState } from "react";

type FormMode = "create" | "update";

export type ListingFormController = {
  fc: FormController<CreateListingRequest>;
  isSubmitting: boolean;
};

type UseListingFormControllerProps = {
  afterSubmitted?: () => void;
};

const useListingFormController = (props: UseListingFormControllerProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mode, setMode] = useState<FormMode>("create");

  const fc = useFormController<CreateListingRequest>({
    initialValues: {
      name: "",
      description: "",
      price: 0,
      selectedMenus: [],
      selectedCategories: [],
    },
    async handleSubmit(data) {
      setIsSubmitting(true);
      await axios.post<ListingItem>("http://localhost:3000/api/listing", data);
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
    setModeToUpdate(values: Partial<CreateListingRequest>) {
      fc.setValues(values);
      setMode("update");
    },
  };
};

export default useListingFormController;
