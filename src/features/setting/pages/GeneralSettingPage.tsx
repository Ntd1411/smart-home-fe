import { useEffect, useState } from "react";
import { Thermometer, Droplets } from "lucide-react";
import { SensorSlider } from "../components/SensorSlider";
import {
  useGetSecuritySettings,
  useGetSettings,
  useSaveHomeInfoSettings,
  useSaveSecuritySettings,
  useSaveSettings,
} from "../api/SettingService";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { FormPageLayout } from "@/shared/components/FormPageLayout";
import { withPermissionGuard } from "@/shared/components/WithPermissionGuard";
import { ComponentWithPermissionGuard } from "@/shared/components/ComponentWithPermissionGuard";
import { PERMISSIONS } from "@/shared/constants/permissions";

const GeneralSettingPageComponent = () => {
  const { data, isLoading } = useGetSettings();
  const { data: securitySettings } = useGetSecuritySettings();
  const [temperatureRange, setTemperatureRange] = useState<[number, number]>([
    30, 70,
  ]);
  const [humidityRange, setHumidityRange] = useState<[number, number]>([
    40, 60,
  ]);

  const [maxDoorPasswordAttempts, setMaxDoorPasswordAttempts] =
    useState<number>(5);
  const [passwordAttemptResetTimeMinutes, setPasswordAttemptResetTimeMinutes] =
    useState<number>(30);

  const [homeName, setHomeName] = useState<string>("");
  const [homeAddress, setHomeAddress] = useState<string>("");

  useEffect(() => {
    if (!data || !Array.isArray(data)) return;

    const getRange = (
      type: "temperature" | "humidity",
      fallback: [number, number]
    ): [number, number] => {
      const found = data.find((item) => item.sensorType === type);
      if (!found) return fallback;
      return [found.min, found.max];
    };

    setTemperatureRange(getRange("temperature", [0, 100]));
    setHumidityRange(getRange("humidity", [0, 100]));
  }, [data]);

  useEffect(() => {
    if (!securitySettings || !Array.isArray(securitySettings)) return;

    const maxAttempts = securitySettings.find(
      (s) => s.settingKey === "max_door_password_attempts"
    );
    const resetMinutes = securitySettings.find(
      (s) => s.settingKey === "password_attempt_reset_time_minutes"
    );

    if (maxAttempts?.settingValue !== undefined) {
      const parsed = Number(maxAttempts.settingValue);
      if (!Number.isNaN(parsed)) {
        setMaxDoorPasswordAttempts(parsed);
      }
    }

    if (resetMinutes?.settingValue !== undefined) {
      const parsed = Number(resetMinutes.settingValue);
      if (!Number.isNaN(parsed)) {
        setPasswordAttemptResetTimeMinutes(parsed);
      }
    }

    const homeNameSetting = securitySettings.find(
      (s) => s.settingKey === "home_name"
    );
    const homeAddressSetting = securitySettings.find(
      (s) => s.settingKey === "home_address"
    );

    setHomeName(homeNameSetting?.settingValue ?? "");
    setHomeAddress(homeAddressSetting?.settingValue ?? "");
  }, [securitySettings]);

  const { mutateAsync: saveSettingsMutation, isPending } = useSaveSettings();
  const {
    mutateAsync: saveSecuritySettingsMutation,
    isPending: isSavingSecurity,
  } = useSaveSecuritySettings();

  const {
    mutateAsync: saveHomeInfoMutation,
    isPending: isSavingHomeInfo,
  } = useSaveHomeInfoSettings();

  const handleSave = () => {
    saveSettingsMutation({
      temperature: {
        min: temperatureRange[0],
        max: temperatureRange[1],
      },
      humidity: {
        min: humidityRange[0],
        max: humidityRange[1],
      },
    });
  };

  const handleSaveSecurity = () => {
    saveSecuritySettingsMutation({
      maxDoorPasswordAttempts,
      passwordAttemptResetTimeMinutes,
    });
  };

  const handleSaveHomeInfo = () => {
    saveHomeInfoMutation({
      homeName,
      homeAddress,
    });
  };

  return (
    <FormPageLayout
      title="Cài đặt"
      description="Quản lý ngưỡng cảnh báo và cấu hình bảo mật"
    >
      <div className="p-6 md:p-10">
        <div className="mx-auto w-full max-w-4xl space-y-6">
          <Tabs defaultValue="alerts" className="w-full">
          <TabsList className="w-full sm:w-fit">
            <TabsTrigger value="home-info">Thông tin nhà</TabsTrigger>
            <TabsTrigger value="thresholds">Ngưỡng cảnh báo</TabsTrigger>
            <TabsTrigger value="security">Bảo mật</TabsTrigger>
          </TabsList>

          <TabsContent value="home-info" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin nhà</CardTitle>
                <CardDescription>
                  Cập nhật thông tin cơ bản về ngôi nhà.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="homeName">Tên nhà</Label>
                  <Input
                    id="homeName"
                    value={homeName}
                    onChange={(e) => setHomeName(e.target.value)}
                    placeholder="Ví dụ: Nhà của An"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="homeAddress">Địa chỉ</Label>
                  <Input
                    id="homeAddress"
                    value={homeAddress}
                    onChange={(e) => setHomeAddress(e.target.value)}
                    placeholder="Ví dụ: 123 Nguyễn Trãi, Q.1, TP.HCM"
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end border-t">
                <ComponentWithPermissionGuard permission={PERMISSIONS.SETTING}>
                  <Button
                    disabled={isSavingHomeInfo}
                    onClick={handleSaveHomeInfo}
                    size="sm"
                  >
                    Lưu thông tin nhà
                  </Button>
                </ComponentWithPermissionGuard>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="thresholds" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ngưỡng cảnh báo</CardTitle>
                <CardDescription>
                  Điều chỉnh khoảng an toàn cho cảm biến.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <SensorSlider
                    label="Nhiệt độ (°C)"
                    icon={<Thermometer className="w-6 h-6 md:w-7 md:h-7" />}
                    value={temperatureRange}
                    setValue={setTemperatureRange}
                    min={0}
                    max={100}
                  />
                </div>

                <div className="space-y-4">
                  <SensorSlider
                    label="Độ ẩm (%)"
                    icon={<Droplets className="w-6 h-6 md:w-7 md:h-7" />}
                    value={humidityRange}
                    setValue={setHumidityRange}
                    min={0}
                    max={100}
                  />
                </div>
              </CardContent>
              <CardFooter className="justify-end border-t">
                <ComponentWithPermissionGuard permission={PERMISSIONS.SETTING}>
                  <Button
                    disabled={isLoading || isPending}
                    onClick={handleSave}
                    size="sm"
                  >
                    Lưu ngưỡng cảnh báo
                  </Button>
                </ComponentWithPermissionGuard>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt bảo mật</CardTitle>
                <CardDescription>
                  Thiết lập giới hạn nhập sai mật khẩu và thời gian reset.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Số lần nhập sai mật khẩu tối đa</Label>
                    <Input
                      type="number"
                      min={1}
                      value={maxDoorPasswordAttempts}
                      onChange={(e) => {
                        const next = Number(e.target.value);
                        setMaxDoorPasswordAttempts(
                          Number.isFinite(next) ? next : 1
                        );
                      }}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Thời gian reset số lần nhập sai (phút)</Label>
                    <Input
                      type="number"
                      min={1}
                      value={passwordAttemptResetTimeMinutes}
                      onChange={(e) => {
                        const next = Number(e.target.value);
                        setPasswordAttemptResetTimeMinutes(
                          Number.isFinite(next) ? next : 1
                        );
                      }}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-end border-t">
                <ComponentWithPermissionGuard permission={PERMISSIONS.SETTING}>
                  <Button
                    disabled={isSavingSecurity}
                    onClick={handleSaveSecurity}
                    size="sm"
                  >
                    Lưu cài đặt bảo mật
                  </Button>
                </ComponentWithPermissionGuard>
              </CardFooter>
            </Card>
          </TabsContent>
          </Tabs>
        </div>
      </div>
    </FormPageLayout>
  );
};

export const GeneralSettingPage = withPermissionGuard(
  GeneralSettingPageComponent,
  PERMISSIONS.SETTING
);
