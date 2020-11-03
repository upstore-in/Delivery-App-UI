import React, { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import Card from '../../components/UI/Card';
import Axios from 'axios';
import HeaderButton from '../../components/UI/HeaderButton';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
// import Colors from '../../constants/Colors';~

const CompletedOrdersScreen = props => {
  useEffect(() => {
    const loadAsync = async () => {
      try {
        const response = await Axios.get(`https://upstore.in/api/orders/all`);
      } catch (err) {
        return console.log(err);
      }
    };

    loadAsync();
  }, []);

  return (
    <ScrollView>
      <View style={styles.actions}>
        <Text>Completed Orders Screen</Text>
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

export default CompletedOrdersScreen;
