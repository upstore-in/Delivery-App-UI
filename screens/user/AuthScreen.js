import React, { useState, useContext } from 'react';
import { ScrollView, View, KeyboardAvoidingView, StyleSheet, Button, TextInput, Text, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as yup from 'yup';
import { Formik } from 'formik';
import Card from '../../components/UI/Card';
import StateContext from '../../StateContext';
import DispatchContext from '../../DispatchContext';

import Axios from 'axios';
import Colors from '../../constants/Colors';

const AuthScreen = props => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const mainState = useContext(StateContext);
  const mainDispatch = useContext(DispatchContext);

  const phoneValidationSchema = yup.object().shape({
    phoneNumber: yup.string().max(10, 'PHONE must have 10 digits').min(10, 'PHONE must have 10 digits').required('Please enter valid number')
  });

  const OTPValidationSchema = yup.object().shape({
    OTP: yup.string().max(6, 'OTP must have 6 digits').min(6, 'OTP must have 6 digits').required('OTP is required')
  });

  const onSubmitNumber = async values => {
    setLoading(true);
    console.log(values.phoneNumber, values.OTP);
    try {
      const response = await Axios.post(`http://172.20.10.8:8000/api/getSessionId`, { phoneNumber: values.phoneNumber });
      setSessionId(response.data.session_id);
      setPhoneNumber(values.phoneNumber);
      setLoading(false);

      console.log(response.data);
    } catch (err) {
      return console.log(err);
    }

    return;
  };

  const onSubmitOTP = async values => {
    setLoading(true);
    console.log(values.phoneNumber, values.OTP);
    try {
      const response = await Axios.post(`http://172.20.10.8:8000/api/verifyOTP`, { phoneNumber: values.phoneNumber, OTP: values.OTP, session_id: sessionId });
      mainDispatch({ type: 'login', value: response.data });
    } catch (err) {
      return console.log(err);
    }

    return;
  };

  return (
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={50} style={styles.screen}>
      <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Formik validationSchema={phoneNumber ? OTPValidationSchema : phoneValidationSchema} initialValues={phoneNumber ? { OTP: '' } : { phoneNumber: '' }} onSubmit={phoneNumber ? onSubmitOTP : onSubmitNumber}>
              {({ handleChange, handleBlur, handleSubmit, errors, values }) => (
                <View>
                  <Text style={styles.label}>{phoneNumber ? 'OTP' : 'Phone'}</Text>
                  <TextInput style={styles.input} onChangeText={handleChange(`${phoneNumber ? 'OTP' : 'phoneNumber'}`)} onBlur={handleBlur(`${phoneNumber ? 'OTP' : 'phoneNumber'}`)} value={phoneNumber ? values.OTP : values.phoneNumber} />
                  {loading ? <ActivityIndicator size="small" color={Colors.primary} /> : <Button onPress={handleSubmit} title="Submit" />}
                  {<Text>{JSON.stringify(errors)}</Text>}
                </View>
              )}
            </Formik>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export const screenOptions = {
  headerTitle: 'Authenticate'
};

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    maxHeight: 400,
    padding: 20
  },
  buttonContainer: {
    marginTop: 10
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  },
  label: {
    fontFamily: 'open-sans-bold',
    marginVertical: 8
  }
});

export default AuthScreen;