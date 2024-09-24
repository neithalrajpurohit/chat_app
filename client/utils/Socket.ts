import { io } from "socket.io-client";
import { API_URL } from "./Api";

export const socket = io(API_URL);
