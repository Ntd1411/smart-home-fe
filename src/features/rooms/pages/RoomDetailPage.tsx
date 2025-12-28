import { useParams, useNavigate } from "react-router";
import { useGetRoomDetailQuery } from "../api/RoomService";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import {
  ArrowLeft,
  Loader2,
  RefreshCw,
  Thermometer,
  Droplets,
  Lightbulb,
  DoorOpen,
  Flame,
  Sun,
  Plug,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import { DeviceList } from "../components/DeviceList";
import ROUTES from "@/shared/lib/routes";
import { useRoomDetail } from "../hooks/useGetRoomDetail";
import { hasPermission } from "@/shared/lib/utils";
import { useMeQuery } from "@/features/auth/api/AuthService";
import LoadingSpinner from "@/shared/components/LoadingSpinner";
import { PERMISSIONS } from "@/shared/constants/permissions";

const getRoomName = (location: string) => {
  if (location === "living-room") return "Phòng khách";
  if (location === "bedroom") return "Phòng ngủ";
  if (location === "kitchen") return "Nhà bếp";
  if (location === "bathroom") return "Phòng tắm";
  return location || "Chưa xác định";
};

const ROOM_PERMISSION_GROUP = {
  "living-room": PERMISSIONS.ROOMS.LIVING_ROOM,
  "bedroom": PERMISSIONS.ROOMS.BEDROOM,
  "kitchen": PERMISSIONS.ROOMS.KITCHEN,
} as const;

export const RoomDetailPage = () => {
  const { location } = useParams<{ location: string }>();

  const roomPermissions =
    ROOM_PERMISSION_GROUP[location as keyof typeof ROOM_PERMISSION_GROUP];

  const {
    data: selfInfo,
    isLoading: isLoadingMe,
    isPending: isPendingMe,
  } = useMeQuery();
  const permissions =
    selfInfo?.data?.roles.flatMap((role) => role.permissions) || [];

  // Loading state
  if (isLoadingMe || isPendingMe) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner isLoading={true} className="py-20" />
      </div>
    );
  }

  console.log("roomPermissions", permissions);

  const hasAccess = hasPermission(permissions, roomPermissions.DETAILS);

  if (!hasAccess) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center space-y-4 max-w-md">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Không có quyền truy cập</h2>
            <p className="text-muted-foreground mt-2">
              Bạn không có quyền truy cập tài nguyên này. Vui lòng liên hệ quản
              trị viên để được cấp quyền.
            </p>
          </div>
        </div>
      </div>
    );
  }

  useRoomDetail(location);
  const navigate = useNavigate();
  const { data, isLoading, isFetching, refetch } = useGetRoomDetailQuery(
    location || ""
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="animate-spin w-6 h-6" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <p className="text-center text-muted-foreground">
          Không tìm thấy phòng
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(ROUTES.OVERVIEW.url)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{getRoomName(data.location)}</h1>
            <p className="text-sm text-muted-foreground">{data.location}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="flex items-center gap-2"
        >
          <RefreshCw
            className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`}
          />
          Làm mới
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Plug className="w-5 h-5" />
            Thiết bị online
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.devicesOnline} / {data.devicesTotal}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {data.devicesTotal > 0
              ? `${Math.round(
                  (data.devicesOnline / data.devicesTotal) * 100
                )}% đang hoạt động`
              : "Chưa có thiết bị"}
          </p>
        </CardContent>
      </Card>

      {/* Thông tin cảm biến */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Thermometer className="w-5 h-5" />
              Nhiệt độ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {data.temperature !== undefined ? `${data.temperature}°C` : "--"}
            </div>
            {/* Cảnh báo */}
            {data.temperatureWarningMessage && (
              <p className="text-sm text-red-500 mt-1">
                {data.temperatureWarningMessage}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Droplets className="w-5 h-5" />
              Độ ẩm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {data.humidity !== undefined ? `${data.humidity}%` : "--"}
            </div>
            {data.humidityWarningMessage && (
              <p className="text-sm text-red-500 mt-1">
                {data.humidityWarningMessage}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Thống kê thiết bị */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="w-5 h-5" />
              Đèn
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.lightsOn} / {data.lightsTotal}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {data.lightsTotal > 0
                ? `${Math.round(
                    (data.lightsOn / data.lightsTotal) * 100
                  )}% đang bật`
                : "Chưa có đèn"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <DoorOpen className="w-5 h-5" />
              Cửa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.doorsOpen} / {data.doorsTotal}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {data.doorsTotal > 0
                ? `${Math.round(
                    (data.doorsOpen / data.doorsTotal) * 100
                  )}% đang mở`
                : "Chưa có cửa"}
            </p>
          </CardContent>
        </Card>

        {/* Ánh sáng */}
        {data.lightLevel && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sun className="w-5 h-5" />
                Ánh sáng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{data.lightLevel}</div>
              <p className="text-sm text-muted-foreground mt-1">lux</p>
            </CardContent>
          </Card>
        )}

        {/* Gas */}
        {data.gas && (
          <Card
            className={`border-2 ${
              data.gas
                ? "border-red-500 bg-red-50 animate-pulse"
                : "border-muted"
            }`}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Flame
                  className={`w-5 h-5 ${
                    data.gas
                      ? "text-red-600 animate-bounce"
                      : "text-muted-foreground"
                  }`}
                />
                Gas
              </CardTitle>
            </CardHeader>

            <CardContent>
              {data.gas ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-red-600 font-bold text-2xl">
                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                    DANGER
                  </div>

                  <p className="text-sm text-red-600 uppercase tracking-wide">
                    Gas leak detected
                  </p>

                  {data.gasWarningMessage && (
                    <p className="text-sm text-red-700 font-medium">
                      {data.gasWarningMessage}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-green-600 font-medium">
                  ✅ No gas detected
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Danh sách thiết bị */}
      <DeviceList
        devices={data.devices}
        room={data.location}
        permission={roomPermissions}
      />

      {/* Điều khiển thiết bị */}
      {/* <DeviceControl devices={data.devices} /> */}
    </div>
  );
};
