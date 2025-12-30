import api from "@/shared/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface SettingPayload {
  temperature: {
    min: number;
    max: number;
  };
  humidity: {
    min: number;
    max: number;
  };
}

export const useSaveSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: SettingPayload) => {
      // Gọi API gửi cài đặt lên backend
      await api.patch("v1/settings", payload); // hoặc api.patch tuỳ backend
      return { success: true };
    },

    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Đã lưu cài đặt cảnh báo thành công!");
    },

    onError: (error: any) => {
      console.error(error);
      toast.error("Lưu cài đặt thất bại!");
    },
  });
};



export const useGetSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await api.get("/v1/settings");
      return data;
    },
  });
};

export type SecuritySettingValueType = "string" | "number" | "boolean" | "json";

export interface SecuritySettingDto {
  settingKey: string;
  settingValue: string;
  description?: string;
  valueType: SecuritySettingValueType;
}

export interface SaveSecuritySettingsPayload {
  maxDoorPasswordAttempts: number;
  passwordAttemptResetTimeMinutes: number;
}

export interface SaveHomeInfoSettingsPayload {
  homeName: string;
  homeAddress: string;
}

export interface HomeInfoResponse {
  homeName: string;
  homeAddress: string;
}

export const useGetSecuritySettings = () => {
  return useQuery({
    queryKey: ["security-settings"],
    queryFn: async (): Promise<SecuritySettingDto[]> => {
      const { data } = await api.get("/v1/settings/security");
      return data;
    },
  });
};

export const useSaveSecuritySettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SaveSecuritySettingsPayload) => {
      await Promise.all([
        api.patch(`/v1/settings/security/max_door_password_attempts`, {
          value: String(payload.maxDoorPasswordAttempts),
          valueType: "number" as const,
        }),
        api.patch(`/v1/settings/security/password_attempt_reset_time_minutes`, {
          value: String(payload.passwordAttemptResetTimeMinutes),
          valueType: "number" as const,
        }),
      ]);

      return { success: true };
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["security-settings"] });
      toast.success("Đã lưu cài đặt bảo mật thành công!");
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("Lưu cài đặt bảo mật thất bại!");
    },
  });
};

export const useSaveHomeInfoSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SaveHomeInfoSettingsPayload) => {
      await api.patch(`/v1/settings/home-info`, payload);

      return { success: true };
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["security-settings"] });
      queryClient.invalidateQueries({ queryKey: ["home-info"] });
      toast.success("Đã lưu thông tin nhà thành công!");
    },
    onError: (error: any) => {
      console.error(error);
      toast.error("Lưu thông tin nhà thất bại!");
    },
  });
};

export const useGetHomeInfoSettings = () => {
  return useQuery({
    queryKey: ["home-info"],
    queryFn: async (): Promise<HomeInfoResponse> => {
      const { data } = await api.get("/v1/settings/home-info");
      return data;
    },
  });
};