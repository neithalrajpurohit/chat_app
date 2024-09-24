import React, { useEffect, useState } from "react";
import { Dimensions, SafeAreaView } from "react-native";
import { View, Text, Spinner } from "@gluestack-ui/themed";
import { useAuth } from "../../context/AuthContext";
import {
  useNavigation,
  NavigationProp,
  ParamListBase,
} from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { socket } from "../../utils/Socket";

const { width, height } = Dimensions.get("screen");

const SplashScreen = () => {
  const navigation: any = useNavigation();
  const [loading, setIsLoading] = useState(false);

  useEffect(() => {
    socket.connect();
    setIsLoading(true);
    AsyncStorage.getItem("Loginuser").then((user) => {
      setIsLoading(false);

      if (!user) {
        return navigation.replace("Login");
      } else {
        return navigation.replace("ChatListScreen");
      }
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Text mt={height * 0.1} py={20} textAlign="center" fontSize={30}>
          ChatApp
        </Text>
        <Spinner />
      </View>
    </SafeAreaView>
  );
};

export default SplashScreen;
