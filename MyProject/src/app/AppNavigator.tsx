import React, {useContext, useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Intro from './auth/intro';
import Login from './auth/login';
import Otp from './auth/otp';
import bottomtab from './main/bottomtab';
import Home from './main/home';
import Chat from './main/chat';
import Profile from './main/profile';
import Security from './main/security';
import Members from './main/members';
import Visitors from './main/visitors';
import NoticeBoard from './main/noticeboard';
import Helpdesk from './main/helpdesk';
import MessageScreen from './main/messageScreen';
import Payment from './main/payment';
import Notification from './main/notification';
import Service from './main/service';
import AddComplaint from './main/addcomplaint';
import Bookamenities from './main/bookamenities';
import BookAmenity from './main/bookamenity';
import Creditcard from './main/creditcard';
import Debitcard from './main/debitcard';
import Editprofile from './main/editprofile';
import Getsupport from './main/getsupport';
import Language from './main/language';
import PrivacyPolicy from './main/policy';
import Receipt from './main/receipt';
import SelectAmenity from './main/selectamenity';
import Selectpaymentmethod from './main/selectpaymentmethod';
import Setting from './main/setting';
import Terms from './main/terms';
import {AuthContext} from '../../context/authContext';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // Use null for initial state
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const data = await AsyncStorage.getItem('@auth');
        const loginData = data ? JSON.parse(data) : null;
        setIsAuthenticated(!!loginData?.token); // Check if token exists
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false); // Ensure loading is set to false after the check
      }
    };
    checkAuthStatus();
  }, []);

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Loading...</Text>
      </View>
    );
  }
 const user =isAuthenticated;
  const Stack = createStackNavigator();
  return (
    <Stack.Navigator>
      {user ? (
        // ✅ Agar user login hai, toh main app screens show karein
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
        // ✅ Agar user login nahi hai, toh auth screens show karein
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