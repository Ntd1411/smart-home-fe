import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  Plug,
  CheckCircle2,
  XCircle,
  DoorOpen,
  DoorClosed,
  Power,
} from "lucide-react";
import {
  useCloseDoor,
  useTurnOffLight,
  type RoomDevice,
} from "../api/RoomService";
import { DeviceType } from "@/shared/enums/device.enum";
import { Button } from "@/shared/components/ui/button";
import { ComponentWithPermissionGuard } from "@/shared/components/ComponentWithPermissionGuard";


interface DeviceListProps {
  devices: RoomDevice[];
  room: string;
  permission: any;
}

export const DeviceList = ({ devices, room, permission }: DeviceListProps) => {
  const { mutateAsync: turnOffLight, isPending: isTurningOffLight } =
    useTurnOffLight(room);
  const { mutateAsync: closeDoor, isPending: isClosingDoor } =
    useCloseDoor(room);
  const devicesList = devices.map((device) => {
    if (device.type === DeviceType.DOOR || device.type === DeviceType.LIGHT) {
      return {
        ...device,
        isControllable: true,
        isOn: device.lastState === "on" || device.lastState === "open",
      };
    } else {
      return {
        ...device,
        isControllable: false,
        isOn: device.lastState === "on",
      };
    }
  });

  const handleLightDevice = (turnOn: boolean) => {
    turnOffLight({
      turnOn,
    });
  };

  const handleDoorDevice = (open: boolean) => {
    closeDoor({
      open,
    });
  };

  if (devicesList.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Chưa có thiết bị nào trong phòng này
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plug className="w-5 h-5" />
          Danh sách thiết bị ({devicesList.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {devicesList.map((device) => (
            <div
              key={device.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    device.status === "online"
                      ? "bg-green-100 dark:bg-green-900/20"
                      : "bg-gray-100 dark:bg-gray-800"
                  }`}
                >
                  {device.status === "online" ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{device.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {device.type === DeviceType.LIGHT
                      ? "Đèn"
                      : device.type === DeviceType.DOOR
                      ? "Cửa"
                      : device.type === DeviceType.GAS_SENSOR
                      ? "Cảm biến khí ga"
                      : device.type === DeviceType.LIGHT_SENSOR
                      ? "Cảm biến ánh sáng"
                      : "Cảm biến nhiệt độ, độ ẩm"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={device.status === "online" ? "default" : "secondary"}
                >
                  {device.status === "online" ? "Online" : "Offline"}
                </Badge>

                {/* NÚT ĐIỀU KHIỂN */}
                {/* LIGHT CONTROL */}
                {device?.isControllable &&
                  device.status === "online" &&
                  device.type === DeviceType.LIGHT && (
                    <ComponentWithPermissionGuard permission={permission.LIGHT}>
                      <Button
                        size="sm"
                        variant={device.isOn ? "destructive" : "default"}
                        disabled={isTurningOffLight}
                        onClick={() => handleLightDevice(!device.isOn)}
                        className={`flex items-center gap-1 ${
                          isTurningOffLight ? "opacity-50" : "cursor-pointer"
                        }`}
                      >
                        <Power className="w-4 h-4" />
                        {device.isOn ? "Tắt" : "Bật"}
                      </Button>
                    </ComponentWithPermissionGuard>
                  )}

                {/* DOOR CONTROL */}
                {device?.isControllable &&
                  device.status === "online" &&
                  device.type === DeviceType.DOOR && (
                    <ComponentWithPermissionGuard permission={permission.DOOR}>
                      <Button
                        size="sm"
                        variant="default"
                        disabled={isClosingDoor}
                        onClick={() => handleDoorDevice(!device.isOn)}
                        className={`flex items-center gap-1 ${
                          isClosingDoor ? "opacity-50" : "cursor-pointer"
                        }`}
                      >
                        {device.isOn ? (
                          <DoorClosed className="w-4 h-4" />
                        ) : (
                          <DoorOpen className="w-4 h-4" />
                        )}
                        {device.isOn ? "Đóng" : "Mở"}
                      </Button>
                    </ComponentWithPermissionGuard>
                  )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
