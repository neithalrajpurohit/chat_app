import { Dimensions, Pressable } from "react-native";
import React from "react";
import {
  View,
  Text,
  Avatar,
  HStack,
  VStack,
  AvatarImage,
  Box,
} from "@gluestack-ui/themed";
import {
  useNavigation,
  ParamListBase,
  NavigationProp,
} from "@react-navigation/native";
const { width, height } = Dimensions.get("screen");
import moment from "moment";
import { ChatCardTypes } from "./ChatTypes";

const ChatListCard = ({
  name,
  isOnline,
  message,
  time,
  id,
  isSeen,
  avatarUrl,
}: ChatCardTypes) => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  return (
    <Pressable
      onPress={() => navigation.navigate("ChatScreen", { userId: id })}
    >
      <HStack px={10} py={10} pt={20} bg={"white"}>
        <Avatar>
          <View
            h={12}
            w={12}
            position="absolute"
            bg={isOnline ? "$green500" : "$red500"}
            zIndex={2}
            top={4}
            right={-2}
            borderRadius={500}
          ></View>
          <AvatarImage source={{ uri: avatarUrl }} />
        </Avatar>
        <HStack justifyContent="space-between" w={width * 0.68}>
          <VStack>
            <Text
              style={{ textTransform: "capitalize" }}
              marginLeft={20}
              fontWeight={700}
              fontSize={17}
            >
              {name}
            </Text>
            <Text marginLeft={20} fontWeight={400} fontSize={14}>
              {message}
            </Text>
          </VStack>
        </HStack>
        <Box>
          <Text fontSize={12} color="$blue500" fontWeight={600}>
            {moment(time).format("h:mm A")}
          </Text>
        </Box>
      </HStack>
    </Pressable>
  );
};

export default ChatListCard;
