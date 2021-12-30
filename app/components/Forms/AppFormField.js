import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import AppTextInput from '../GeneralComponents/AppTextInput'
import ErrorMessage from '../GeneralComponents/ErrorMessage'
import { useFormikContext } from 'formik'

const AppFormField = ({name, ...otherProps}) => {

    const { errors, setFieldTouched, handleChange, touched} = useFormikContext();

    return (
        <>
            <AppTextInput
                onChangeText={handleChange(name)}
                onBlur={()=>setFieldTouched(name)}
                {...otherProps}
            />
            <ErrorMessage visible={touched[name]} error={errors[name]}>{errors[name]}</ErrorMessage>
        </>
    )
}

export default AppFormField

const styles = StyleSheet.create({})
