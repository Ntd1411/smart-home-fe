import { useEffect, useState } from "react";
import { Thermometer, Droplets, Flame } from "lucide-react";
import { SensorSlider } from "../components/SensorSlider";
import { useGetSettings, useSaveSettings } from "../api/SettingService";
import { Button } from "@/shared/components/ui/button";
import { withPermissionGuard } from "@/shared/components/WithPermissionGuard";
import { ComponentWithPermissionGuard } from "@/shared/components/ComponentWithPermissionGuard";
import { PERMISSIONS } from "@/shared/constants/permissions";

const SettingPageComponent = () => {
  const { data, isLoading } = useGetSettings();
  const [temperatureRange, setTemperatureRange] = useState<[number, number]>([
    30, 70,
  ]);
  const [humidityRange, setHumidityRange] = useState<[number, number]>([
    40, 60,
  ]);
  const [gasRange, setGasRange] = useState<[number, number]>([50, 250]);
  console.log(temperatureRange);
  console.log(humidityRange);
  console.log(gasRange);
  useEffect(() => {
    if (!data || !Array.isArray(data)) return;

    const getRange = (
      type: "temperature" | "humidity" | "gas",
      fallback: [number, number]
    ): [number, number] => {
      const found = data.find((item) => item.sensorType === type);
      if (!found) return fallback;
      return [found.min, found.max];
    };

    setTemperatureRange(getRange("temperature", [0, 100]));
    setHumidityRange(getRange("humidity", [0, 100]));
    setGasRange(getRange("gas", [0, 500]));
  }, [data]);

  const { mutateAsync: saveSettingsMutation, isPending } = useSaveSettings();

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
      gas: {
        min: gasRange[0],
        max: gasRange[1],
      },
    });
  };

  return (
    <div className="p-6 md:p-10 space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">
        Cài đặt cảnh báo
      </h1>

      <SensorSlider
        label="Nhiệt độ (°C)"
        icon={<Thermometer className="w-6 h-6 md:w-7 md:h-7" />}
        value={temperatureRange}
        setValue={setTemperatureRange}
        min={0}
        max={100}
      />

      <SensorSlider
        label="Độ ẩm (%)"
        icon={<Droplets className="w-6 h-6 md:w-7 md:h-7" />}
        value={humidityRange}
        setValue={setHumidityRange}
        min={0}
        max={100}
      />

      <SensorSlider
        label="Gas"
        icon={<Flame className="w-6 h-6 md:w-7 md:h-7" />}
        value={gasRange}
        setValue={setGasRange}
        min={0}
        max={500}
      />
      <div className="flex justify-center">
        <ComponentWithPermissionGuard permission={PERMISSIONS.SETTING}>
          <Button
            disabled={isLoading || isPending}
            onClick={handleSave}
            size="sm"
            className="bg-black text-white hover:bg-gray-800"
          >
            Lưu cài đặt
          </Button>
        </ComponentWithPermissionGuard>
      </div>
    </div>
  );
};

export const SettingPage = withPermissionGuard(
  SettingPageComponent,
  PERMISSIONS.SETTING
);
