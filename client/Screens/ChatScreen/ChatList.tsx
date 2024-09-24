import { ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import ChatListCard from "./ChatListCard";
import axios from "axios";
import { API_URL } from "../../utils/Api";
import { socket } from "../../utils/Socket";
import { useAuth } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { Pressable, Text, View } from "@gluestack-ui/themed";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChatList = () => {
  const [users, setUsers] = useState<any>([]);
  const navigation: any = useNavigation();

  const { user, isLoading } = useAuth();

  console.log(user, "user");

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    navigation.addListener("focus", () => {
      getAllUsers().then((allUsers) => {
        console.log(allUsers);
        setUsers(allUsers);
      });
    });

    socket.on("users", () => {
      getAllUsers().then((allUsers) => {
        console.log(allUsers);
        setUsers(allUsers);
      });
    });
    navigation.setOptions({
      headerRight: ({ size, color }: any) => (
        <Pressable
          android_ripple={{ color: "rgba(0,0,0,.2)" }}
          onPress={() => {
            AsyncStorage.removeItem("Loginuser").then(() => {
              socket.disconnect();
              navigation.replace("Login");
            });
          }}
        >
          <Ionicons name="exit-outline" size={25} color={color} />
        </Pressable>
      ),
    });
  }, []);

  useEffect(() => {
    AsyncStorage.getItem("Loginuser").then((userInfo) => {
      if (userInfo) {
        socket.emit("joinroom", JSON.parse(userInfo));
      }
    });
  }, [isLoading, user]);

  const getAllUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/get/allusers`);
      let allUsers = res.data?.data;
      return allUsers;
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <View>
      <ScrollView>
        {users
          .filter((cuUser: any) => cuUser._id !== user?.user?._id)
          .map((userItem: any, i: number) => {
            return (
              <ChatListCard
                key={i}
                name={userItem.name}
                message={userItem.recentMessage}
                time={userItem.time}
                isOnline={userItem?.isOnline}
                id={userItem._id}
                isSeen={userItem?.isSeen}
                avatarUrl={`https://i.pravatar.cc/150?img=${i}`}
              />
            );
          })}
      </ScrollView>
    </View>
  );
};

export default ChatList;
