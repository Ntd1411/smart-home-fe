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
  gas: {
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