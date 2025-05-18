import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Provider } from "react-redux";
import { store } from "../../store/store";
import { Platform } from "react-native";

export default function TabLayout() {
  return (
    <Provider store={store}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#2563EB",
          tabBarInactiveTintColor: "#94A3B8",
          headerStyle: {
            backgroundColor: "#FFFFFF",
            elevation: 0,
            shadowOpacity: 0,
          },
          headerShadowVisible: false,
          headerTintColor: "#1E293B",
          tabBarStyle: {
            backgroundColor: "#FFFFFF",
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: Platform.OS === "ios" ? 90 : 70,
            paddingBottom: Platform.OS === "ios" ? 20 : 10,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "600",
          },
          tabBarItemStyle: {
            paddingVertical: 5,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Camera",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "camera-sharp" : "camera-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="post"
          options={{
            title: "Create Ad",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "add-circle" : "add-circle-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="posts"
          options={{
            title: "My Ads",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "grid-sharp" : "grid-outline"}
                color={color}
                size={24}
              />
            ),
          }}
        />
      </Tabs>
    </Provider>
  );
}
