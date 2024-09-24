import { StyleSheet } from "react-native";
import { config, GluestackUIProvider, Text } from "@gluestack-ui/themed";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthProvider from "./context/AuthContext";
import Login from "./Screens/Auth/Login";
import Signup from "./Screens/Auth/Signup";
import ChatList from "./Screens/ChatScreen/ChatList";
import ChatScreen from "./Screens/ChatScreen/ChatScreen";
import SplashScreen from "./Screens/Auth/SplashScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <GluestackUIProvider config={config.theme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SplashScreen">
            <Stack.Screen
              name="Login"
              options={{ headerShown: false }}
              component={Login}
            />
            <Stack.Screen
              name="Signup"
              options={{ headerShown: false }}
              component={Signup}
            />
            <Stack.Screen
              name="ChatListScreen"
              options={{ headerShown: true, title: "chats" }}
              component={ChatList}
            />
            <Stack.Screen
              name="ChatScreen"
              options={{ headerShown: true, title: "" }}
              component={ChatScreen}
            />
            <Stack.Screen
              name="SplashScreen"
              options={{ headerShown: false, title: "" }}
              component={SplashScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GluestackUIProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
