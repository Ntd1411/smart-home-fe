import { useEffect } from 'react';
import { useSocketStore } from '@/shared/stores/useSocketStore';
import { useQueryClient } from '@tanstack/react-query';
import type { OverviewData, Room, QuickStatus } from '../api/OverviewService';
import type { Location } from '@/shared/enums/location.enum';

export const useOverviewRealtime = () => {
  const { socket, isConnected } = useSocketStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    // danh sách room cần lắng nghe
    const roomsList: Location[] = ['living-room', 'bedroom', 'kitchen'];

    // lưu handler riêng cho cleanup
    const handlers: Record<string, (data: any) => void> = {};

    // Lắng nghe từng room
    roomsList.forEach((room) => {
      const handler = (data: Partial<Room>) => {
        queryClient.setQueryData<OverviewData>(['overview'], (old) => {
          if (!old) return old;

          const roomIndex = old.rooms.findIndex(r => r.location === room);
          const updatedRooms = [...old.rooms];

          if (roomIndex >= 0) {
            updatedRooms[roomIndex] = { ...updatedRooms[roomIndex], ...data };
          } else {
            updatedRooms.push({ location: room, hasWarning: false, ...data });
          }

          return { ...old, rooms: updatedRooms };
        });
      };

      handlers[room] = handler;
      socket.on(`sensor:${room}`, handler);
    });

    // Lắng nghe quick status nếu socket có gửi
    const quickStatusHandler = (data: Partial<QuickStatus>) => {
      queryClient.setQueryData<OverviewData>(['overview'], (old) => {
        if (!old) return old;
        return { ...old, quickStatus: { ...old.quickStatus, ...data } };
      });
    };

    handlers['quickStatus'] = quickStatusHandler;
    socket.on(`devices`, quickStatusHandler);

    // Cleanup khi component unmount hoặc socket thay đổi
    return () => {
      roomsList.forEach(room => {
        socket.off(`sensor:${room}`, handlers[room]);
      });
      socket.off('devices', handlers['quickStatus']);
    };
  }, [socket, queryClient, isConnected]);
};
