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
          name="gallery"
          options={{
            title: "Gallery",
            tabBarIcon: ({ color, focused }) => (
              <Ionicons
                name={focused ? "images-sharp" : "images-outline"}
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
