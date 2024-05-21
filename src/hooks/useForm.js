import { useState } from "react";

export const useForm = (inicialForm, validationSchema) => {
  const [formData, setFormState] = useState(inicialForm);
  const [errorsInput, setErrorsInput] = useState({});

  const onInputChange = (event) => {
    const { name, value } = event.target;
    const files = event.target.files;
    setFormState({
      ...formData,
      [name]: files ? files[0] : value,
      // [name]: value,
    });
    // if (event.target?.filess) {
    //   console.log(event.target.files);
    //   // let files = Array.from(e.target.files);

    //   setFormState({
    //     ...formData,
    //     // [name]: files,
    //     [name]: event.target.files[0],
    //   });
    // }
    setErrorsInput({
      ...errorsInput,
      [name]: [],
    });

    validateForm();
  };

  const validateForm = () => {
    const newErrors = {};

    for (const key in validationSchema) {
      const validationFn = validationSchema[key];
      if (formData[key] != undefined) {
        let value = formData[key];
        const fieldErrors = validationFn
          .map((fn) => fn(value))
          .filter((error) => error !== undefined);
        if (fieldErrors.length > 0) {
          newErrors[key] = fieldErrors;
        }
      }
    }
    setErrorsInput(newErrors);
    return Object.keys(newErrors).length;
  };

  const clearForm = () => {
    setFormState(inicialForm);
    setErrorsInput({});
  };

  const fillForm = (data) => {
    // for (let name in data) {
    //   formData[name] = data[name];
    // }
    setFormState({
      ...formData,
      ...inicialForm,
    });
  };

  return {
    formData,
    onInputChange,
    validateForm,
    errorsInput,
    clearForm,
    fillForm,
  };
};
