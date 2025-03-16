import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Provider } from "react-redux";
import { store } from "../../store/store";
export default function TabLayout() {
  return (
    <Provider store={store}>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#ffd33d",
          headerStyle: {
            backgroundColor: "#25292e",
          },
          headerShadowVisible: false,
          headerTintColor: "#fff",
          tabBarStyle: {
            backgroundColor: "#25292e",
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
            title: "New Post",
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
            title: "My Posts",
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
