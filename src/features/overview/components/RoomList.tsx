import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  Thermometer,
  Droplets,
  AlertTriangle,
  ArrowRight,
  Sun,
} from "lucide-react";
import { type Room } from "../api/OverviewService";
import { useNavigate } from "react-router";
import ROUTES from "@/shared/lib/routes";
import { useMeQuery } from "@/features/auth/api/AuthService";
import { hasPermission } from "@/shared/lib/utils";
import { PERMISSIONS } from "@/shared/constants/permissions";

interface RoomListProps {
  rooms: Room[];
}

export const RoomList = ({ rooms }: RoomListProps) => {
  const navigate = useNavigate();

  const { data: selfInfo } = useMeQuery();
  const roles = selfInfo?.data?.roles ?? [];
  const isSystem = roles.some((role) => role.isSystemRole);
  const permissions = roles.flatMap((role) => role.permissions) || [];

  const roomPermissionGroup = {
    "living-room": PERMISSIONS.ROOMS.LIVING_ROOM,
    "bedroom": PERMISSIONS.ROOMS.BEDROOM,
    "kitchen": PERMISSIONS.ROOMS.KITCHEN,
  } as const;

  const allowedRooms = isSystem
    ? rooms
    : rooms.filter((room) => {
        const roomPermission =
          roomPermissionGroup[room.location as keyof typeof roomPermissionGroup];
        if (!roomPermission) return false;
        return hasPermission(permissions, roomPermission.DETAILS);
      });

  if (rooms.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Chưa có phòng nào</p>
        </CardContent>
      </Card>
    );
  }

  if (allowedRooms.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Bạn không có quyền truy cập phòng nào
          </p>
        </CardContent>
      </Card>
    );
  }

  const getRoomName = (location: string) => {
    if (location === "living-room") return "Phòng khách";
    if (location === "bedroom") return "Phòng ngủ";
    if (location === "kitchen") return "Nhà bếp";
    if (location === "bathroom") return "Phòng tắm";
    return location || "Chưa xác định";
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Danh sách phòng</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allowedRooms.map((room) => (
          <Card
            key={room.location}
            className={`cursor-pointer hover:shadow-lg transition-shadow ${
              room.hasWarning ? "border-orange-200 dark:border-orange-800" : ""
            }`}
            onClick={() => navigate(ROUTES.ROOM_DETAIL.getPath(room.location))}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {getRoomName(room.location)}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {room.hasWarning && (
                    <Badge
                      variant="destructive"
                      className="flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      Cảnh báo
                    </Badge>
                  )}
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Nhiệt độ */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Nhiệt độ
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {room.temperature !== undefined
                      ? `${room.temperature}°C`
                      : "--"}
                  </span>
                </div>

                {/* Độ ẩm */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Độ ẩm</span>
                  </div>
                  <span className="text-sm font-medium">
                    {room.humidity !== undefined ? `${room.humidity}%` : "--"}
                  </span>
                </div>
                {/* Ánh sáng */}
                {room.lightLevel && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Ánh sáng
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {room.lightLevel}
                    </span>
                  </div>
                )}

                {/* Gas
                {room.gas && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Gas</span>
                    </div>
                    <span className="text-sm font-medium">{room.gas}</span>
                  </div>
                )} */}

                {/* Cảnh báo */}
                {room.hasWarning && (
                  <div className="mt-3 space-y-1">
                    {room.temperatureWarningMessage && (
                      <div className="p-2 rounded-md bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                        <p className="text-xs text-orange-800 dark:text-orange-200">
                          {room.temperatureWarningMessage}
                        </p>
                      </div>
                    )}
                    {room.humidityWarningMessage && (
                      <div className="p-2 rounded-md bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                        <p className="text-xs text-orange-800 dark:text-orange-200">
                          {room.humidityWarningMessage}
                        </p>
                      </div>
                    )}
                    {room.gasWarningMessage && (
                      <div
                        className="
      flex items-start gap-2
      p-3 rounded-md
      border border-red-500
      bg-red-50 dark:bg-red-900/20
      animate-pulse
    "
                      >
                        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5" />

                        <p className="text-xs font-semibold text-red-700 dark:text-red-200 uppercase tracking-wide">
                          {room.gasWarningMessage}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
