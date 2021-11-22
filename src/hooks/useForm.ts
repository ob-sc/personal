import { useState } from 'react';
import { isEmpty } from '../lib/util';
import { Controller, Errors, FormEventHandler, StringObject, Values } from '../types';

const useForm = (defaults: StringObject, required: string[]) => {
  const [values, setValues] = useState<Values>(defaults);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // jeweils das 2. Argument nach key weglassen, um den key wieder zu entfernen

  const setValue = (key: string, value?: string) => {
    setValues({ ...values, [key]: value?.trim() });
  };

  const setError = (key: string, error?: Error) => {
    setErrors({ ...errors, [key]: error });
    console.log(errors);
  };

  const submitHandler: FormEventHandler = (e) => {
    e.preventDefault();
    setSuccess(false);
    setSubmitting(true);
    // TODO: submit
    for (let i = 0; i < required.length; i++) {
      const key = required[i];
      const val = values[key];
      if (isEmpty(val)) setError(key, new Error('Pflichtfeld'));
      // console.log(errors, key);
    }
    setSubmitting(false);
    // setSuccess(true);
  };

  const controller: Controller = {
    values,
    setValue,
    errors,
    setError,
  };

  return {
    submitHandler,
    controller,
    isSubmitting: submitting,
    isSuccess: success,
    isError: Object.keys(errors).length > 0,
  };
};

export default useForm;
