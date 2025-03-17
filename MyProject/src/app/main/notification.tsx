import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, PermissionsAndroid } from "react-native";
import messaging from "@react-native-firebase/messaging";
import { API_URL } from "@env";


// ✅ Define Type for Notifications
type NotificationType = {
  id: string;
  title: string;
  body: string;
};

const Notification = () => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  useEffect(() => {
    requestPermission();
    getFCMToken();

    // 🔹 Listen for Incoming Notifications
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      console.log("📩 New Notification:", remoteMessage);

      // ✅ Ensure title and body are always strings
      const title = remoteMessage.notification?.title
        ? String(remoteMessage.notification.title)
        : remoteMessage.data?.title
        ? String(remoteMessage.data.title)
        : "New Notification";

      const body = remoteMessage.notification?.body
        ? String(remoteMessage.notification.body)
        : remoteMessage.data?.body
        ? String(remoteMessage.data.body)
        : "You have a new message.";

      Alert.alert("🔔 New Notification", title);

      setNotifications((prev) => [
        { id: Date.now().toString(), title, body },
        ...prev,
      ]);
    });

    return unsubscribe;
  }, []);

  // 🔹 Request Notification Permission (Android 13+)
  const requestPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert("Permission Denied");
    }
  };

  // 🔹 Fetch Firebase Token & Save in Backend
  const getFCMToken = async () => {
    try {
      const token = await messaging().getToken();
      console.log("FCM Token:", token);

      // ✅ Send Token to Backend
      await fetch(`/api/v1/auth/save-token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flat: "101", token }),
      });
    } catch (error) {
      console.error("Error Fetching Token:", error);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>📩 Notifications</Text>

      {notifications.length === 0 ? (
        <Text>No notifications yet.</Text>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                padding: 10,
                backgroundColor: "#f8f9fa",
                marginVertical: 5,
                borderRadius: 5,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>{item.title}</Text>
              <Text>{item.body}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default Notification;
