import React, { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext';
import * as Yup from 'yup';
import { Alert, Modal, StyleSheet, Text, TouchableHighlight, View, TouchableWithoutFeedback, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons'

import AppForm from '../Forms/AppForm';
import AppFormField from '../Forms/AppFormField';
import Screen from '../GeneralComponents/Screen'
import defaultStyles from '../../config/defaultStyles';
import AppText from '../GeneralComponents/AppText';
import SubmitButton from '../Forms/SubmitButton';
import AppTextInput from '../GeneralComponents/AppTextInput';
import AppButton from '../GeneralComponents/AppButton';

const validationSchema = Yup.object().shape({
    email: Yup.string().required().min(1).max(25).label('Email'),
    password: Yup.string().required().min(6).max(12).label('Password'),
})

const LogInScreen = () => {

    const navigation = useNavigation();
    const { login, resetPassword } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [ErrMsg, setErrMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function submitForm({email, password}){
        try{
            await login(email, password);
            navigation.navigate('home')
            
        }
        catch(err){
            if(err.message.includes('invalid-email')){
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

    async function handleResetPassword(){
        setErrMsg('');
        if(!resetEmail){
            return setErrMsg('please enter tour email')
        }
        setIsLoading(true);
        try{
            await resetPassword(resetEmail);
            setSuccessMsg('check your email and follow the instructions')
        }
        catch(err){
            setErrMsg('failed to reset password')
            console.log(err.message);
        }
        setIsLoading(false)
    }

    return (
        <Screen style={styles.container}>
            <AppText style={styles.text}>Please login</AppText>
            <AppForm
                initialValues={{email: '', password: ''}}
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
                    secureTextEntry={!showPassword}
                />
                    <View style={{paddingVertical: 10 , width: '100%'}}>
                <TouchableHighlight onPress={()=>setShowPassword(old => !old)}>
                        <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center'}}>
                            <Checkbox
                                value={showPassword}
                                onValueChange={()=>setShowPassword(old => !old)}
                                color={showPassword ? '#4630EB' : undefined}
                                style={{marginHorizontal: 20}}
                            />
                            <AppText style={{color: 'white'}}>Show Password</AppText>
                        </View>
                </TouchableHighlight>
                </View>
                <SubmitButton textStyle={styles.textStyle} style={styles.logInButton} title={'log In'} />
                <Text onPress={()=>setModalVisible(true)} style={{fontSize: 18, color: 'white', marginBottom: 20, textDecorationLine: 'underline'}}>Forgot your Password ?</Text>
            </AppForm>
            <AppText style={{fontSize: 20, color: 'white'}}>
                <Text>Don't have an account ? </Text>
                <Text 
                    style={{color: defaultStyles.colors.secondary, marginHorizontal: 5}}
                    onPress={()=>navigation.navigate('signupscreen')}
                >
                    Sign up here
                </Text>
            </AppText>
            <Modal
                visible={modalVisible}
                animationType='slide'
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <Screen style={styles.container}>
                    <TouchableWithoutFeedback onPress={()=>setModalVisible(!modalVisible)}>
                        <Ionicons style={styles.exitIcon}  name="exit" size={30} color="white" />
                    </TouchableWithoutFeedback>
                    <AppText style={styles.text}>Enter your Email: </AppText>
                    {successMsg ? <AppText style={{color: 'green', paddingVertical: 10}}>{successMsg}</AppText> : null}
                    <AppTextInput 
                        icon={'email'}
                        name={'email'}
                        autoCorrect={false}
                        autoCapitalize='none'
                        KeyboardType='email-address'
                        placeholder='Email'
                        textContentType='emailAddress'
                        value={resetEmail}
                        onChangeText={(val)=>setResetEmail(val)}
                    />
                    {ErrMsg ? <AppText style={{color: 'red', paddingVertical: 10}}>{ErrMsg}</AppText> : null}
                    <AppButton 
                        style={styles.logInButton} 
                        onPress={()=>handleResetPassword()}
                        disabled={isLoading}
                        textStyle={styles.textStyle} title={'reset password'} 
                    />
                </Screen>
            </Modal>
        </Screen>
    )
}

export default LogInScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: defaultStyles.colors.primary,
        padding: 10
    },
    logInButton: {
        backgroundColor: defaultStyles.colors.secondary,
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
    },
    exitIcon: {
        position: 'absolute', 
        top: 5, 
        right: 5, 
        zIndex: 50
    },
})
