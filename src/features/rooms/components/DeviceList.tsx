import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { useState } from "react";
import {
  Plug,
  CheckCircle2,
  XCircle,
  DoorOpen,
  DoorClosed,
  Power,
  Key,
  Lightbulb,
  LightbulbOff,
  SquareStack,
  Bot,
} from "lucide-react";
import {
  useControlSpecificLight,
  useControlSpecificDoor,
  useControlAllLights,
  useControlAllDoors,
  useControlSpecificWindow,
  useControlAllWindows,
  useCommandAuto,
  useChangeDoorPassword,
  type RoomDevice,
} from "../api/RoomService";
import { DeviceType } from "@/shared/enums/device.enum";
import { Button } from "@/shared/components/ui/button";
import { ComponentWithPermissionGuard } from "@/shared/components/ComponentWithPermissionGuard";
import { ChangeDoorPasswordDialog } from "./ChangeDoorPasswordDialog";

interface DeviceListProps {
  devices: RoomDevice[];
  room: string;
  permission: any;
}

export const DeviceList = ({ devices, room, permission }: DeviceListProps) => {
  const { mutateAsync: controlSpecificLight } = useControlSpecificLight(room);
  const { mutateAsync: controlSpecificDoor } = useControlSpecificDoor(room);
  const { mutateAsync: controlSpecificWindow } = useControlSpecificWindow(room);
  const { mutateAsync: controlAllLights, isPending: isControllingAllLights } =
    useControlAllLights(room);
  const { mutateAsync: controlAllDoors, isPending: isControllingAllDoors } =
    useControlAllDoors(room);
  const { mutateAsync: controlAllWindows, isPending: isControllingAllWindows } =
    useControlAllWindows(room);
  const { mutateAsync: commandAuto, isPending: isCommandingAuto } =
    useCommandAuto(room);
  const { mutateAsync: changeDoorPassword, isPending: isChangingPassword } =
    useChangeDoorPassword(room);

  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [selectedDoorId, setSelectedDoorId] = useState<string>("");
  const [controllingLightId, setControllingLightId] = useState<string | null>(
    null
  );
  const [controllingDoorId, setControllingDoorId] = useState<string | null>(
    null
  );
  const [controllingWindowId, setControllingWindowId] = useState<string | null>(
    null
  );
  const [autoMode, setAutoMode] = useState(false);

  const devicesList = devices.map((device) => {
    if (
      device.type === DeviceType.DOOR ||
      device.type === DeviceType.LIGHT ||
      device.type === DeviceType.WINDOW
    ) {
      return {
        ...device,
        isControllable: true,
        isOn:
          device.lastState === "on" ||
          device.lastState === "unlocked" ||
          device.lastState === "opened",
      };
    } else {
      return {
        ...device,
        isControllable: false,
        isOn: device.lastState === "on",
      };
    }
  });

  const lights = devicesList.filter((d) => d.type === DeviceType.LIGHT);
  const doors = devicesList.filter((d) => d.type === DeviceType.DOOR);
  const windows = devicesList.filter((d) => d.type === DeviceType.WINDOW);
  const onlineLights = lights.filter((d) => d.status === "online");
  const onlineDoors = doors.filter((d) => d.status === "online");
  const onlineWindows = windows.filter((d) => d.status === "online");
  const anyLightOn = onlineLights.some((d) => d.isOn);
  const anyDoorOpen = onlineDoors.some((d) => d.isOn);
  const anyWindowOpen = onlineWindows.some((d) => d.isOn);
  const allLightsOff = onlineLights.length > 0 && !anyLightOn;
  const allDoorsClosed = onlineDoors.length > 0 && !anyDoorOpen;
  const allWindowsClosed = onlineWindows.length > 0 && !anyWindowOpen;

  const handleLightDevice = async (deviceId: string, turnOn: boolean) => {
    setControllingLightId(deviceId);
    try {
      await controlSpecificLight({ deviceId, state: turnOn });
    } finally {
      setControllingLightId(null);
    }
  };

  const handleDoorDevice = async (deviceId: string, open: boolean) => {
    setControllingDoorId(deviceId);
    try {
      await controlSpecificDoor({ deviceId, state: open });
    } finally {
      setControllingDoorId(null);
    }
  };

  const handleToggleAllLights = async () => {
    const turnOn = allLightsOff;
    await controlAllLights({ state: turnOn });
  };

  const handleToggleAllDoors = async () => {
    const open = allDoorsClosed;
    await controlAllDoors({ state: open });
  };

  const handleWindowDevice = async (deviceId: string, open: boolean) => {
    setControllingWindowId(deviceId);
    try {
      await controlSpecificWindow({ deviceId, state: open });
    } finally {
      setControllingWindowId(null);
    }
  };

  const handleToggleAllWindows = async () => {
    const open = allWindowsClosed;
    await controlAllWindows({ state: open });
  };

  const handleToggleAutoMode = async () => {
    const newAutoMode = !autoMode;
    await commandAuto({ state: newAutoMode });
    setAutoMode(newAutoMode);
  };

  const handleChangePassword = async (
    oldPassword: string,
    newPassword: string
  ) => {
    await changeDoorPassword({
      deviceId: selectedDoorId,
      oldPassword,
      newPassword,
    });
    setPasswordDialogOpen(false);
  };

  const openPasswordDialog = (doorId: string) => {
    setSelectedDoorId(doorId);
    setPasswordDialogOpen(true);
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Plug className="w-5 h-5" />
            Danh sách thiết bị ({devicesList.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            {/* Nút điều khiển tất cả đèn */}
            {onlineLights.length > 0 && permission?.ALL_LIGHTS && (
              <ComponentWithPermissionGuard permission={permission.ALL_LIGHTS}>
                <Button
                  size="sm"
                  variant={anyLightOn ? "destructive" : "default"}
                  disabled={isControllingAllLights}
                  onClick={handleToggleAllLights}
                  className="flex items-center gap-1"
                >
                  {anyLightOn ? (
                    <LightbulbOff className="w-4 h-4" />
                  ) : (
                    <Lightbulb className="w-4 h-4" />
                  )}
                  {anyLightOn ? "Tắt tất cả đèn" : "Bật tất cả đèn"}
                </Button>
              </ComponentWithPermissionGuard>
            )}
            {/* Nút điều khiển tất cả cửa */}
            {onlineDoors.length > 0 && permission?.ALL_DOORS && (
              <ComponentWithPermissionGuard permission={permission.ALL_DOORS}>
                <Button
                  size="sm"
                  variant={anyDoorOpen ? "default" : "outline"}
                  disabled={isControllingAllDoors}
                  onClick={handleToggleAllDoors}
                  className="flex items-center gap-1"
                >
                  {anyDoorOpen ? (
                    <DoorClosed className="w-4 h-4" />
                  ) : (
                    <DoorOpen className="w-4 h-4" />
                  )}
                  {anyDoorOpen ? "Đóng tất cả cửa" : "Mở tất cả cửa"}
                </Button>
              </ComponentWithPermissionGuard>
            )}
            {/* Nút điều khiển tất cả cửa sổ */}
            {onlineWindows.length > 0 && permission?.ALL_WINDOWS && (
              <ComponentWithPermissionGuard permission={permission.ALL_WINDOWS}>
                <Button
                  size="sm"
                  variant={anyWindowOpen ? "default" : "outline"}
                  disabled={isControllingAllWindows}
                  onClick={handleToggleAllWindows}
                  className="flex items-center gap-1"
                >
                  {anyWindowOpen ? (
                    <SquareStack className="w-4 h-4" />
                  ) : (
                    <SquareStack className="w-4 h-4" />
                  )}
                  {anyWindowOpen ? "Đóng tất cả cửa sổ" : "Mở tất cả cửa sổ"}
                </Button>
              </ComponentWithPermissionGuard>
            )}
            {/* Nút chế độ tự động (chỉ kitchen) */}
            {room === "kitchen" && permission?.AUTO_MODE && (
              <ComponentWithPermissionGuard permission={permission.AUTO_MODE}>
                <Button
                  size="sm"
                  variant={autoMode ? "default" : "outline"}
                  disabled={isCommandingAuto}
                  onClick={handleToggleAutoMode}
                  className="flex items-center gap-1"
                >
                  <Bot className="w-4 h-4" />
                  {autoMode ? "Tắt Auto" : "Bật Auto"}
                </Button>
              </ComponentWithPermissionGuard>
            )}
          </div>
        </div>
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
                      : device.type === DeviceType.WINDOW
                      ? "Cửa sổ"
                      : device.type === DeviceType.GAS_SENSOR
                      ? "Cảm biến khí ga"
                      : device.type === DeviceType.LIGHT_SENSOR
                      ? "Cảm biến ánh sáng"
                      : "Cảm biến nhiệt độ, độ ẩm"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* NÚT ĐIỀU KHIỂN */}
                {/* LIGHT CONTROL */}
                {device?.isControllable &&
                  device.status === "online" &&
                  device.type === DeviceType.LIGHT && permission?.EACH_LIGHT && (
                    <ComponentWithPermissionGuard
                      permission={permission.EACH_LIGHT}
                    >
                      <Button
                        size="sm"
                        variant={device.isOn ? "destructive" : "default"}
                        disabled={controllingLightId === device.id}
                        onClick={() =>
                          handleLightDevice(device.id, !device.isOn)
                        }
                        className={`flex items-center gap-1 ${
                          controllingLightId === device.id
                            ? "opacity-50"
                            : "cursor-pointer"
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
                  device.type === DeviceType.DOOR && permission?.EACH_DOOR && (
                    <>
                      <ComponentWithPermissionGuard
                        permission={permission.EACH_DOOR}
                      >
                        <Button
                          size="sm"
                          variant="default"
                          disabled={controllingDoorId === device.id}
                          onClick={() =>
                            handleDoorDevice(device.id, !device.isOn)
                          }
                          className={`flex items-center gap-1 ${
                            controllingDoorId === device.id
                              ? "opacity-50"
                              : "cursor-pointer"
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
                      {permission?.DOOR_PASSWORD && (
                        <ComponentWithPermissionGuard
                          permission={permission.DOOR_PASSWORD}
                        >
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isChangingPassword}
                          onClick={() => openPasswordDialog(device.id)}
                          className="flex items-center gap-1"
                        >
                          <Key className="w-4 h-4" />
                          Mật khẩu
                        </Button>
                        </ComponentWithPermissionGuard>
                      )}
                    </>
                  )}

                {/* WINDOW CONTROL */}
                {device?.isControllable &&
                  device.status === "online" &&
                  device.type === DeviceType.WINDOW && permission?.EACH_WINDOW && (
                    <ComponentWithPermissionGuard
                      permission={permission.EACH_WINDOW}
                    >
                      <Button
                        size="sm"
                        variant={device.isOn ? "default" : "outline"}
                        disabled={controllingWindowId === device.id}
                        onClick={() =>
                          handleWindowDevice(device.id, !device.isOn)
                        }
                        className={`flex items-center gap-1 ${
                          controllingWindowId === device.id
                            ? "opacity-50"
                            : "cursor-pointer"
                        }`}
                      >
                        <SquareStack className="w-4 h-4" />
                        {device.isOn ? "Đóng" : "Mở"}
                      </Button>
                    </ComponentWithPermissionGuard>
                  )}
                <Badge
                  variant={device.status === "online" ? "default" : "secondary"}
                >
                  {device.status === "online" ? "Online" : "Offline"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <ChangeDoorPasswordDialog
        open={passwordDialogOpen}
        onOpenChange={setPasswordDialogOpen}
        onSubmit={handleChangePassword}
        isLoading={isChangingPassword}
      />
    </Card>
  );
};
