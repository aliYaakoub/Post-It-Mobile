import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Network from 'expo-network';
import { useState, useEffect} from 'react';
import { StyleSheet } from 'react-native';

import LogInScreen from './app/components/screens/LogInScreen';
import MainScreen from './app/components/screens/MainScreen';
import SignUpScreen from './app/components/screens/SignUpScreen';
import { AuthProvider } from './app/contexts/AuthContext';
import AppText from './app/components/GeneralComponents/AppText';
import Screen from './app/components/GeneralComponents/Screen';
import defaultStyles from './app/config/defaultStyles';
import AppButton from './app/components/GeneralComponents/AppButton';
import selectedUserScreen from './app/components/screens/selectedUserScreen';

const Stack = createNativeStackNavigator();

export default function App() {

  const [connected, setConnected] = useState(false);
  const [isloading, setIsLoading] = useState(true);

  async function testNetworkStatus(){
    setIsLoading(true)
    const network_status = await Network.getNetworkStateAsync();
    if(network_status.isConnected){
        setConnected(true);
    }
    setIsLoading(false)
  }

  useEffect(()=>{
    testNetworkStatus();
  },[])

  return (
    <>
      {isloading ? 
          <Screen style={[styles.screen, {alignItems: 'center', justifyContent: 'center', padding: 20}]}>
              <AppText style={styles.text}>Loading</AppText>
          </Screen>
          :
          connected ?
            <AuthProvider>
                <NavigationContainer>
                  <Stack.Navigator screenOptions={{headerShown: false}} >
                    <Stack.Screen name='main' component={MainScreen} />
                    <Stack.Screen name='loginscreen' component={LogInScreen} />
                    <Stack.Screen name='signupscreen' component={SignUpScreen} />
                    <Stack.Screen name='selecteduserscreen' component={selectedUserScreen} />
                  </Stack.Navigator>
                </NavigationContainer>
            </AuthProvider>
            :
            <Screen style={[styles.screen, {alignItems: 'center', justifyContent: 'center', padding: 20}]}>
                <AppText style={styles.text}>connect to the internet</AppText>
                <AppButton textStyle={{color: 'white'}} onPress={()=>testNetworkStatus()} title={'reconnect'} style={{backgroundColor: defaultStyles.colors.primary, width: '60%', borderRadius: 20}} />
            </Screen>
        }
    </>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: 70
    },
    screen: {
        backgroundColor: defaultStyles.colors.secondary
    },
    text: {
        textAlign: 'center',
        paddingVertical: 20,
        fontSize: 22,
        color: 'white'
    },
})
