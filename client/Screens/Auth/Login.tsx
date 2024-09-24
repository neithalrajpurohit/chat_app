import { View, Dimensions } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Input,
  InputField,
  Button,
  ButtonText,
  Box,
  Text,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { AuthLoginStateTypes } from "./AuthTypes";
import axios from "axios";
import { API_URL } from "../../utils/Api";
import { useAuth } from "../../context/AuthContext";

const { width, height } = Dimensions.get("screen");

const Login = () => {
  const [loginDetails, setLoginDetails] = useState<AuthLoginStateTypes>({
    email: "",
    password: "",
  });
  const navigation: any = useNavigation();

  const { user, isLoading, setLoggedInUser } = useAuth();

  const loginHandler = (text: string, data: string) => {
    setLoginDetails({ ...loginDetails, [data]: text });
  };
  const loginVerification = async () => {
    try {
      const res = await axios.post(`${API_URL}/login`, loginDetails);
      await AsyncStorage.setItem(
        "Loginuser",
        JSON.stringify({ token: res.data.data, user: res.data.user })
      );
      setLoggedInUser({ token: res.data.data, user: res.data.user });
      navigation.replace("ChatListScreen");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Box bg="$fuchsia200" h={height}>
      <Text style={{ fontSize: 20, marginTop: 67, marginHorizontal: 10 }}>
        Welcome Back !
      </Text>
      <View style={{ marginHorizontal: 16, marginTop: 20 }}>
        <Input
          variant="outline"
          size="md"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}
        >
          <InputField
            placeholder="Enter Email"
            value={loginDetails.email}
            onChangeText={(text: string) => loginHandler(text, "email")}
          />
        </Input>
        <View style={{ marginVertical: 10 }} />

        <Input
          variant="outline"
          size="md"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}
        >
          <InputField
            placeholder="Enter password"
            value={loginDetails.password}
            onChangeText={(text: string) => loginHandler(text, "password")}
          />
        </Input>
      </View>
      <Button
        style={{
          marginHorizontal: 10,
          marginTop: 10,
          marginLeft: "auto",
          marginRight: "auto",
          width: 100,
        }}
        size="sm"
        variant="solid"
        action="primary"
        isDisabled={false}
        isFocusVisible={false}
        onPress={() => loginVerification()}
      >
        <View>
          <ButtonText>Login</ButtonText>
        </View>
      </Button>
      <Text mt={20} textAlign="center">
        Don't have an account ?{" "}
        <Text onPress={() => navigation.navigate("Signup")}>Signup</Text>
      </Text>
    </Box>
  );
};

export default Login;
