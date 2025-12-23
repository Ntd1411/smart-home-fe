import { queryClient } from "@/shared/components/ReactQueryProvider";
import { DeviceType, type DeviceStatus } from "@/shared/enums/device.enum";
import api from "@/shared/lib/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export interface RoomDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  lastState: string;
}

export interface RoomDetail {
  location: string;
  devices: RoomDevice[];
  temperature?: number;
  humidity?: number;
  gasLevel?: number;
  lightLevel?: number;
  hasWarning?: string;
  temperatureWarningMessage?: string;
  humidityWarningMessage?: string;
  gasWarningMessage?: string;
  lightsOn: number;
  lightsTotal: number;
  doorsOpen: number;
  doorsTotal: number;
  devicesOnline: number;
  devicesTotal: number;
}

export const useGetRoomDetailQuery = (location: string) => {
  return useQuery({
    queryKey: ["room-detail", location],
    queryFn: async () => {
      const res = await api.get<RoomDetail>(`/v1/${location}/details`);
      console.log(res.data);
      return res.data;
    },
    refetchInterval: 30000, // Refetch mỗi 30 giây
    enabled: !!location,
  });
};

export const useTurnOffLight = (room: string) => {
  return useMutation({
    mutationFn: async ({ turnOn }: { turnOn: boolean }) => {
      await api.patch(`/v1/${room}/light`, { state: turnOn });
      return { success: true };
    },

    onSuccess: async () => {
      queryClient.setQueryData(
        ["room-detail", room],
        (old: RoomDetail | undefined) => {
          if (!old) return old;

          return {
            ...old,
            devices: old.devices.map((item) =>
              item.type === DeviceType.LIGHT
                ? {
                    ...item,
                    lastState: item.lastState === "on" ? "off" : "on",
                  }
                : item
            ),
          };
        }
      );

      toast.success("Đã cập nhật trạng thái tất cả đèn");
    },

    onError: (error: any) => {
      toast.error(error?.message || "Không thể cập nhật trạng thái đèn");
    },
  });
};

export const useCloseDoor = (room: string) => {
  return useMutation({
    mutationFn: async ({ open }: { open: boolean }) => {
      await api.patch(`/v1/${room}/door`, { state: open });

      return { success: true };
    },
    onSuccess: async () => {
      queryClient.setQueryData(["room-detail", room], (old: RoomDetail) => {
        if (!old) return old;
        return {
          ...old,
          devices: old.devices.map((item) => 
            item.type === DeviceType.DOOR ? {
              ...item,
              lastState: item.lastState === "open" ? "closed": "open"
            }: item
          )
        }
      });
      toast.success("Đã cập nhật trạng thái cửa thành công");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Không thể cập nhật trạng thái cửa");
    },
  });
};
