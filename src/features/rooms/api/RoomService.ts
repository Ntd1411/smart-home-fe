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
  gas?: boolean;
  lightLevel?: number;
  hasWarning?: string;
  temperatureWarningMessage?: string;
  humidityWarningMessage?: string;
  gasWarningMessage?: string;
  lightsOn: number;
  lightsTotal: number;
  doorsOpen: number;
  doorsTotal: number;
  windowsOpen: number;
  windowsTotal: number;
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

// export const useTurnOffLight = (room: string) => {
//   return useMutation({
//     mutationFn: async ({ turnOn }: { turnOn: boolean }) => {
//       await api.patch(`/v1/${room}/light`, { state: turnOn });
//       return { success: true };
//     },

//     onSuccess: async () => {
//       queryClient.setQueryData(
//         ["room-detail", room],
//         (old: RoomDetail | undefined) => {
//           if (!old) return old;

//           return {
//             ...old,
//             devices: old.devices.map((item) =>
//               item.type === DeviceType.LIGHT
//                 ? {
//                     ...item,
//                     lastState: item.lastState === "on" ? "off" : "on",
//                   }
//                 : item
//             ),
//           };
//         }
//       );

//       toast.success("Đã cập nhật trạng thái tất cả đèn");
//     },

//     onError: (error: any) => {
//       toast.error(error?.message || "Không thể cập nhật trạng thái đèn");
//     },
//   });
// };

// Điều khiển từng đèn cụ thể
export const useControlSpecificLight = (room: string) => {
  return useMutation({
    mutationFn: async ({ deviceId, state }: { deviceId: string; state: boolean }) => {
      await api.patch(`/v1/${room}/light/${deviceId}`, { state });
      return { success: true };
    },
    onSuccess: async (_, variables) => {
      queryClient.setQueryData(
        ["room-detail", room],
        (old: RoomDetail | undefined) => {
          if (!old) return old;
          return {
            ...old,
            devices: old.devices.map((item) =>
              item.id === variables.deviceId
                ? { ...item, lastState: variables.state ? "on" : "off" }
                : item
            ),
          };
        }
      );
      toast.success(`Đã ${variables.state ? 'bật' : 'tắt'} đèn`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || "Không thể điều khiển đèn");
    },
  });
};

// Bật/tắt tất cả đèn
export const useControlAllLights = (room: string) => {
  return useMutation({
    mutationFn: async ({ state }: { state: boolean }) => {
      await api.patch(`/v1/${room}/lights/control-all`, { state });
      return { success: true };
    },
    onSuccess: async (_, variables) => {
      queryClient.setQueryData(
        ["room-detail", room],
        (old: RoomDetail | undefined) => {
          if (!old) return old;
          return {
            ...old,
            devices: old.devices.map((item) =>
              item.type === DeviceType.LIGHT && item.status === "online"
                ? { ...item, lastState: variables.state ? "on" : "off" }
                : item
            ),
          };
        }
      );
      toast.success(`Đã ${variables.state ? 'bật' : 'tắt'} tất cả đèn`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || "Không thể điều khiển tất cả đèn");
    },
  });
};

// export const useCloseDoor = (room: string) => {
//   return useMutation({
//     mutationFn: async ({ open }: { open: boolean }) => {
//       await api.patch(`/v1/${room}/door`, { state: open });

//       return { success: true };
//     },
//     onSuccess: async () => {
//       queryClient.setQueryData(["room-detail", room], (old: RoomDetail) => {
//         if (!old) return old;
//         return {
//           ...old,
//           devices: old.devices.map((item) => 
//             item.type === DeviceType.DOOR ? {
//               ...item,
//               lastState: item.lastState === "open" ? "closed": "open"
//             }: item
//           )
//         }
//       });
//       toast.success("Đã cập nhật trạng thái cửa thành công");
//     },
//     onError: (error: any) => {
//       toast.error(error?.message || "Không thể cập nhật trạng thái cửa");
//     },
//   });
// };

// Điều khiển từng cửa cụ thể
export const useControlSpecificDoor = (room: string) => {
  return useMutation({
    mutationFn: async ({ deviceId, state }: { deviceId: string; state: boolean }) => {
      await api.patch(`/v1/${room}/door/${deviceId}`, { state });
      return { success: true };
    },
    onSuccess: async (_, variables) => {
      queryClient.setQueryData(
        ["room-detail", room],
        (old: RoomDetail | undefined) => {
          if (!old) return old;
          return {
            ...old,
            devices: old.devices.map((item) =>
              item.id === variables.deviceId
                ? { ...item, lastState: variables.state ? "unlocked" : "locked" }
                : item
            ),
          };
        }
      );
      toast.success(`Đã ${variables.state ? 'mở' : 'đóng'} cửa`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || "Không thể điều khiển cửa");
    },
  });
};

// Đóng/mở tất cả cửa
export const useControlAllDoors = (room: string) => {
  return useMutation({
    mutationFn: async ({ state }: { state: boolean }) => {
      await api.patch(`/v1/${room}/doors/control-all`, { state });
      return { success: true };
    },
    onSuccess: async (_, variables) => {
      queryClient.setQueryData(
        ["room-detail", room],
        (old: RoomDetail | undefined) => {
          if (!old) return old;
          return {
            ...old,
            devices: old.devices.map((item) =>
              item.type === DeviceType.DOOR && item.status === "online"
                ? { ...item, lastState: variables.state ? "unlocked" : "locked" }
                : item
            ),
          };
        }
      );

      toast.success(`Đã ${variables.state ? 'mở' : 'đóng'} tất cả cửa`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || "Không thể điều khiển tất cả cửa");
    },
  });
};

export const useChangeDoorPassword = (room: string) => {
  return useMutation({
    mutationFn: async ({
      deviceId,
      oldPassword,
      newPassword,
    }: {
      deviceId: string;
      oldPassword: string;
      newPassword: string;
    }) => {
      const res = await api.patch(`/v1/${room}/door/${deviceId}/change-password`, {
        oldPassword,
        newPassword,
      });
      return res.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["room-detail", room] });
      toast.success("Đã đổi mật khẩu cửa thành công");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể đổi mật khẩu cửa"
      );
    },
  });
};

// Điều khiển từng cửa sổ cụ thể
export const useControlSpecificWindow = (room: string) => {
  return useMutation({
    mutationFn: async ({ deviceId, state }: { deviceId: string; state: boolean }) => {
      await api.patch(`/v1/${room}/window/${deviceId}`, { state });
      return { success: true };
    },
    onSuccess: async (_, variables) => {
      queryClient.setQueryData(
        ["room-detail", room],
        (old: RoomDetail | undefined) => {
          if (!old) return old;
          return {
            ...old,
            devices: old.devices.map((item) =>
              item.id === variables.deviceId
                ? { ...item, lastState: variables.state ? "opened" : "closed" }
                : item
            ),
          };
        }
      );
      toast.success(`Đã ${variables.state ? 'mở' : 'đóng'} cửa sổ`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || "Không thể điều khiển cửa sổ");
    },
  });
};

// Đóng/mở tất cả cửa sổ
export const useControlAllWindows = (room: string) => {
  return useMutation({
    mutationFn: async ({ state }: { state: boolean }) => {
      await api.patch(`/v1/${room}/windows/control-all`, { state });
      return { success: true };
    },
    onSuccess: async (_, variables) => {
      queryClient.setQueryData(
        ["room-detail", room],
        (old: RoomDetail | undefined) => {
          if (!old) return old;
          return {
            ...old,
            devices: old.devices.map((item) =>
              item.type === DeviceType.WINDOW && item.status === "online"
                ? { ...item, lastState: variables.state ? "opened" : "closed" }
                : item
            ),
          };
        }
      );
      toast.success(`Đã ${variables.state ? 'mở' : 'đóng'} tất cả cửa sổ`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || "Không thể điều khiển tất cả cửa sổ");
    },
  });
};

// Điều khiển chế độ tự động (chỉ kitchen)
export const useCommandAuto = (room: string) => {
  return useMutation({
    mutationFn: async ({ state }: { state: boolean }) => {
      await api.patch(`/v1/${room}/auto`, { state });
      return { success: true };
    },
    onSuccess: async (_, variables) => {
      toast.success(`Đã ${variables.state ? 'bật' : 'tắt'} chế độ tự động`);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || error?.message || "Không thể điều khiển chế độ tự động");
    },
  });
};