import React, { useContext, useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/authContext';

import Intro from './auth/intro';
import Register from './auth/register';
import Login from './auth/login';
import Otp from './auth/otp';

import bottomtab from './main/bottomtab';
import Home from './main/home';
import Chat from './main/chat';
import Security from './main/security';
import Service from './main/service';
import Profile from './main/profile';
import Notification from './main/notification';
import Bookamenities from './main/bookamenities';
import BookAmenity from './main/bookamenity';
import Creditcard from './main/creditcard';
import Debitcard from './main/debitcard';
import Editprofile from './main/editprofile';
import Getsupport from './main/getsupport';
import Language from './main/language';
import Members from './main/members';
import Payment from './main/payment';
import Receipt from './main/receipt';
import SelectAmenity from './main/selectamenity';
import Selectpaymentmethod from './main/selectpaymentmethod';
import Setting from './main/setting';
import Terms from './main/terms';
import Visitors from './main/visitors';
import NoticeBoard from './main/noticeboard';
import Helpdesk from './main/helpdesk';
import AddComplaint from './main/addcomplaint';
import PrivacyPolicy from './main/policy';
import MessageScreen from './main/messageScreen';
import AddGuestScreen from './main/Addguest';
import AddDeliveryScreen from './main/AddDeliveryScreen';
import VisitorHistory from './main/VisitorHistory';
import security from './main/security';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  // ✅ Move useContext to the top
  const [state] = useContext(AuthContext);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const data = await AsyncStorage.getItem('@auth');
        const loginData = data ? JSON.parse(data) : null;
        setIsAuthenticated(!!loginData?.token);
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuthStatus();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const authenticatedUser = state?.user && state?.token;

  return (
    <Stack.Navigator>
      {authenticatedUser ? (
        <>
          <Stack.Screen
            name="main"
            component={bottomtab}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Chat"
            component={Chat}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Security"
            component={Security}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Service"
            component={Service}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Notification"
            component={Notification}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Members"
            component={Members}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Visitors"
            component={Visitors}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Noticeboard"
            component={NoticeBoard}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Payment"
            component={Payment}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Receipt"
            component={Receipt}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Selectpaymentmethod"
            component={Selectpaymentmethod}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Creditcard"
            component={Creditcard}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Debitcard"
            component={Debitcard}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Bookamenities"
            component={Bookamenities}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Selectamenity"
            component={SelectAmenity}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Bookamenity"
            component={BookAmenity}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Helpdesk"
            component={Helpdesk}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Addcomplaint"
            component={AddComplaint}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Setting" component={Setting} />
          <Stack.Screen name="Editprofile" component={Editprofile} />
          <Stack.Screen name="Language" component={Language} />
          <Stack.Screen name="Getsupport" component={Getsupport} />
          <Stack.Screen name="Terms" component={Terms} />
          <Stack.Screen name="Policy" component={PrivacyPolicy} />
          <Stack.Screen
            name="MessageScreen"
            component={MessageScreen}
            options={{headerShown: false}}
          />
        </>
      ) : (
        <>
        {/* <Stack.Screen name="secuirty" component={Security} />
        <Stack.Screen name="AddGuest" component={AddGuestScreen} />
        <Stack.Screen name="AddDelivery" component={AddDeliveryScreen} />
        <Stack.Screen name="History" component={VisitorHistory} />


            <Stack.Screen
            name="security"
            component={security}
            options={{headerShown: false}}
          /> */}
          <Stack.Screen
            name="Intro"
            component={Intro}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Otp"
            component={Otp}
            options={{headerShown: false}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;