import { View, Text, ImageBackground } from "react-native";
import React from "react";
import { GiftedChat } from "react-native-gifted-chat";
import { useState, useEffect, useCallback } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { socket } from "./../../utils/Socket";
import axios from "axios";
import { API_URL } from "../../utils/Api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatScreen = () => {
  const navigation: any = useNavigation();
  const [messages, setMessages] = useState<any>([]);
  const [userInfo, setUserInfo] = useState<any>({});
  const [currentUser, setCurrentUser] = useState<any>("");

  const route: any = useRoute();

  useEffect(() => {
    getUserInfo().then((remoteUserInfo: any) => {
      AsyncStorage.getItem("Loginuser").then((user: any) => {
        let cUser = JSON.parse(user!);
        setCurrentUser(cUser);
        // fetch all prev messages
        getAllMessages(cUser, remoteUserInfo);
        navigation.setOptions({ title: remoteUserInfo.name });
      });
    });

    // listen for messages
    socket.on("message", (message: any) => {
      setMessages((prevState: any) =>
        GiftedChat.append(prevState, message.message)
      );
    });
  }, []);

  const getUserInfo = async () => {
    try {
      const res = await axios.post(`${API_URL}/getUserInfo`, {
        id: route.params.userId,
      });
      setUserInfo(res.data.data);
      return res.data.data;
    } catch (err) {
      console.log(err);
    }
  };

  const getAllMessages = async (cUser: any, remoteUserInfo: any) => {
    try {
      const res = await axios.get(
        `${API_URL}/message/${cUser?.user?._id}/${remoteUserInfo._id}`
      );
      setMessages(res.data.data);
      return res.data.data;
    } catch (err) {
      console.log(err);
    }
  };

  const onSend = (messages: any = []) => {
    setMessages((previousMessages: any) =>
      GiftedChat.append(previousMessages, messages)
    );

    socket.emit("message", {
      from: currentUser,
      to: userInfo,
      message: messages,
    });
  };

  return (
    <ImageBackground
      source={{
        uri: "https://source.unsplash.com/user/wsanter",
      }}
      style={{ flex: 1 }}
    >
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: currentUser?.user?._id,
          name: currentUser?.user?.name,
        }}
      />
    </ImageBackground>
  );
};

export default ChatScreen;
