import React, { useContext, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import HeaderButton from '../../components/UI/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Axios from 'axios';
import StateContext from '../../StateContext';
import DispatchContext from '../../DispatchContext';
// import Colors from '../../constants/Colors';

const AssignedOrdersScreen = props => {
  const mainState = useContext(StateContext);
  const mainDispatch = useContext(DispatchContext);

  const { user } = mainState;
  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${user.token}` }
    };
    const getPermissions = async () => {
      let pushToken;
      let statusObj = await Permissions.getAsync(Permissions.NOTIFICATIONS);
      if (statusObj.status !== 'granted') {
        statusObj = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      }
      if (statusObj.status !== 'granted') {
        pushToken = null;
      }

      if (statusObj.status === 'granted' && !mainState.user.pushToken) {
        pushToken = (await Notifications.getExpoPushTokenAsync()).data;

        try {
          const response = await Axios.put(`http://172.20.10.8:8000/api/user/${user._id}`, { pushToken }, config);
        } catch (err) {
          return console.log(err);
        }

        mainDispatch({ type: 'pushToken', value: pushToken });
      }

      console.log(pushToken);
    };
    getPermissions();

    return () => {};
  }, []);

  return (
    <ScrollView>
      <View style={styles.actions}>
        <Text>Assigned Orders Screen</Text>
      </View>
    </ScrollView>
  );
};

export const screenOptions = navData => {
  return {
    headerTitle: 'Orders',
    headerLeft: () => (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  actions: {
    marginVertical: 10,
    alignItems: 'center'
  }
});

export default AssignedOrdersScreen;
