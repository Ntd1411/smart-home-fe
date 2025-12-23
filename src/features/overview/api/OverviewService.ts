import { queryClient } from "@/shared/components/ReactQueryProvider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import api from "@/shared/lib/api";
import type { Location } from "@/shared/enums/location.enum";
import type { DeviceStatus } from "@/shared/enums/device.enum";

// Types
export interface QuickStatus {
  lightsOn: number;
  lightsTotal: number;
  devicesOnline: number;
  devicesTotal: number;
  doorsOpen: number;
  doorsTotal: number;
}

export interface Room {
  location: Location;
  hasWarning: boolean;
  temperature?: number;
  humidity?: number;
  gasLevel?: number;
  lightLevel?: number;
  temperatureWarningMessage?: string;
  gasWarningMessage?: string;
  humidityWarningMessage?: string;
}

export interface DeviceOverview {
  id: string;
  name: string;
  type: string;
  location: string;
  lastState: string;
  status: DeviceStatus;
}

export interface OverviewData {
  quickStatus: QuickStatus;
  devices: DeviceOverview[];
  rooms: Room[];
}

// API Hooks
export const useGetOverviewQuery = () => {
  return useQuery({
    queryKey: ["overview"],
    queryFn: async () => {
      const res = await api.get<OverviewData>("/v1/overview");
      return res.data;
    },
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });
};

export const useTurnOffAllLightsMutation = () => {
  return useMutation({
    mutationFn: async (turnOn: boolean) => {
      await api.patch(`/v1/overview/lights`, { state: turnOn });

      return { success: true };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["overview"] });
      toast.success("Đã cập nhật trạng thái tất cả đèn");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Không thể cập nhật trạng thái đèn");
    },
  });
};

export const useLockAllDoorsMutation = () => {
  return useMutation({
    // state: true => mở tất cả cửa, false => khóa tất cả cửa
    mutationFn: async (open: boolean) => {
      await api.patch(`/v1/overview/doors`, { state: open });
      return { success: true };
    },
    onSuccess: async (_data, open) => {
      await queryClient.invalidateQueries({ queryKey: ["overview"] });
      toast.success(open ? "Đã mở tất cả cửa" : "Đã khóa tất cả cửa");
    },
    onError: (error: any) => {
      toast.error(error?.message || "Không thể cập nhật trạng thái cửa");
    },
  });
};
