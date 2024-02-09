import { io } from "socket.io-client";
import useSWRSubscription from "swr/subscription";

// TODO: create a generic method to create a socket
export const useAlarmSocket = () => {
    const { data, error } = useSWRSubscription("alarms", (key, { next }) => {
        const socket = io("ws://localhost:8080");

        socket.on("alarm", (data) => {
            console.log(data);
            next(null, data);
        });

        socket.on("connect", () => {
            console.log(`Socket ${socket.id} connected`);
        });

        socket.on("disconnect", () => {
            console.log(`Socket ${socket.id} disconnected`);
        });

        return () => socket.close();
    });
    return { data, error };
};
