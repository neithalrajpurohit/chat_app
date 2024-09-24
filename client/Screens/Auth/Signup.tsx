import { View, Dimensions } from "react-native";
import React, { useState } from "react";
import {
  Input,
  InputField,
  Button,
  ButtonText,
  Box,
  useToast,
  ToastTitle,
  Toast,
  Text,
  VStack,
} from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/core";
import axios from "axios";
import { AuthStateTypes } from "./AuthTypes";
import { API_URL } from "../../utils/Api";
const { width, height } = Dimensions.get("screen");

const Signup = () => {
  const navigation: any = useNavigation();
  const toast: any = useToast();

  const [signUpData, setSignUpData] = useState<AuthStateTypes>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });

  const passwordHandler = async () => {
    if (signUpData.password !== signUpData.confirmPassword) {
      toast.show({
        placement: "bottom",
        render: () => {
          return (
            <Toast bg="$red500">
              <VStack>
                <ToastTitle>Password Mismatch !</ToastTitle>
              </VStack>
            </Toast>
          );
        },
      });
    } else {
      const res = await axios.post(`${API_URL}/signup`, signUpData);
      navigation.navigate("Login");
    }
  };

  const signupHandler = (
    text: string,
    data: "email" | "name" | "password" | "confirmPassword"
  ) => {
    setSignUpData({ ...signUpData, [data]: text });
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
            value={signUpData.email}
            onChangeText={(text: string) => signupHandler(text, "email")}
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
            placeholder="Enter name"
            value={signUpData.name}
            onChangeText={(text: string) => signupHandler(text, "name")}
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
            type="password"
            value={signUpData.password}
            onChangeText={(text: string) => signupHandler(text, "password")}
          />
        </Input>
        <View style={{ marginTop: 16 }} />
        <Input
          variant="outline"
          size="md"
          isDisabled={false}
          isInvalid={false}
          isReadOnly={false}
        >
          <InputField
            placeholder="Confirm Password"
            value={signUpData.confirmPassword}
            onChangeText={(text: string) =>
              signupHandler(text, "confirmPassword")
            }
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
        onPress={() => passwordHandler()}
      >
        <View>
          <ButtonText>SignUp</ButtonText>
        </View>
      </Button>
      <Text mt={20} textAlign="center">
        Already have an account ?
        <Text onPress={() => navigation.navigate("Login")}>Login</Text>
      </Text>
    </Box>
  );
};

export default Signup;
