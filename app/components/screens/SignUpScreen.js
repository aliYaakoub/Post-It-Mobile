import React from 'react'
import { Alert, StyleSheet } from 'react-native'
import * as Yup from 'yup'
import { useNavigation } from '@react-navigation/native';

import { useAuth } from '../../contexts/AuthContext';
import AppFormField from '../Forms/AppFormField';
import SubmitButton from '../Forms/SubmitButton';
import AppText from '../GeneralComponents/AppText';
import Screen from '../GeneralComponents/Screen';
import AppForm from './../Forms/AppForm';
import defaultStyles from '../../config/defaultStyles';

const validationSchema = Yup.object().shape({
    email: Yup.string().required().min(1).max(25).label('Email'),
    password: Yup.string().required().min(6).max(12).label('Password'),
})

const SignUpScreen = () => {

    const navigation = useNavigation();
    const { signup } = useAuth();

    async function submitForm({email, password, confirmpassword}){
        if(password !== confirmpassword){
            return Alert.alert('passwords don\'t match')
        }
        try{
            await signup(email, password);
            navigation.goBack()
        }
        catch(err){
            if(err.message.includes('email-already-in-use')){
                Alert.alert('email already in use.');
            }
            else if(err.message.includes('invalid-email')){
                Alert.alert('Invalid Email')
            }
            else if(err.message.includes('user-not-found')){
                Alert.alert('User not found, check if typed your email is wrong')
            }
            else if(err.message.includes('wrong-password')){
                Alert.alert('Wrong password')
            }
            else{
                Alert.alert('Can\'t log in')
            }
        }
    }

    return (
        <Screen style={styles.container}>
                <AppText style={styles.text}>Please fill all fields</AppText>
                <AppForm
                    initialValues={{email: '', password: '', confirmpassword: ''}}
                    validationSchema={validationSchema}
                    onSubmit={(values)=>submitForm(values)}
                >
                    <AppFormField
                        name={'email'}
                        icon={'email'}
                        autoCorrect={false}
                        autoCapitalize='none'
                        KeyboardType='email-address'
                        placeholder='Email'
                        textContentType='emailAddress'
                    />
                    <AppFormField
                        name={'password'}
                        icon={'lock'}
                        autoCorrect={false}
                        autoCapitalize='none'
                        placeholder='Password'
                        textContentType='password'
                        secureTextEntry
                    />
                    <AppFormField
                        name={'confirmpassword'}
                        icon={'lock'}
                        autoCorrect={false}
                        autoCapitalize='none'
                        placeholder='Confirm Password'
                        textContentType='password'
                        secureTextEntry
                    />
                    <SubmitButton textStyle={styles.textStyle} style={styles.logInButton} title={'Sign Up'} />
                </AppForm>
        </Screen>
    )
}

export default SignUpScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: defaultStyles.colors.secondary,
        padding: 10
    },
    logInButton: {
        backgroundColor: defaultStyles.colors.primary,
        marginVertical: 35,
        borderRadius: 25
    },
    text: {
        fontSize: 30,
        marginVertical: 35,
        color: defaultStyles.colors.text.primary
    },
    textStyle: {
        color: defaultStyles.colors.text.primary,
    }
})
