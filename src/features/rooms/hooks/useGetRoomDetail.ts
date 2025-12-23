import { useSocketStore } from "@/shared/stores/useSocketStore";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { RoomDetail } from "../api/RoomService";

export const useRoomDetail = (location: string | undefined) => {
  const { socket, isConnected } = useSocketStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    console.log("Socket connected:", isConnected);
    if (!socket || !location) return;

    const handleSensorAndDeviceData = (data: Partial<RoomDetail>) => {
      console.log(data);
      queryClient.setQueryData<RoomDetail>(
        ["room-detail", location],
        (oldData) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            ...data, // chỉ override field có trong socket
          };
        }
      );
    };

    // Lắng nghe các room hiện có
    socket.on(`sensor:${location}`, handleSensorAndDeviceData);

    socket.on(`device:${location}`, handleSensorAndDeviceData);

    // clean up function của useEffect
    // chạy khi component unmount
    // dependency thay đổi
    // trước khi useEffect chạy lại lần tiếp theo
    // gỡ event listener cũ của socket
    return () => {
      socket.off(`sensor:${location}`, handleSensorAndDeviceData);
      socket.off(`device:${location}`, handleSensorAndDeviceData);
    };
  }, [socket, location, queryClient]);

  return null;
};
