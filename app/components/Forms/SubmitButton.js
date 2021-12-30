import React from 'react'
import { StyleSheet } from 'react-native'
import AppButton from '../GeneralComponents/AppButton';
import { useFormikContext } from 'formik';

const SubmitButton = ({title, style, textStyle}) => {

    const { handleSubmit } = useFormikContext();
    return (
        <AppButton style={style} textStyle={textStyle} title={title} onPress={handleSubmit} />
    )
}

export default SubmitButton

const styles = StyleSheet.create({})
