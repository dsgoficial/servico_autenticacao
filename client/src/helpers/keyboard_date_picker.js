import React from 'react'
import { KeyboardDatePicker } from '@material-ui/pickers'
import { useField, useFormikContext } from "formik";

const FormikKeyboardDatePicker = ({...props}) => {
    const { setFieldValue } = useFormikContext();
    const [field] = useField(props);

    const errorText = 1
    const touchedVal = 1
    const hasError = touchedVal && errorText !== undefined

    return (<KeyboardDatePicker
      clearable
      autoOk
      format="dd/MM/yyyy"
      placeholder="01/01/2020"
      error={hasError}
      helperText={hasError ? errorText : ''}
      mask={value =>
        value
          ? [/[0-3]/, /\d/, "/", /0|1/, /\d/, "/", /1|2/, /\d/, /\d/, /\d/]
          : []
      }
      onChange={val => {
        setFieldValue(field.name, val);
      }}
      animateYearScrolling={false}
      {...field}
      {...props}
    />)
    }

export default FormikKeyboardDatePicker