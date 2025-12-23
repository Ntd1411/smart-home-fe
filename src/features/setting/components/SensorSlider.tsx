import * as Slider from "@radix-ui/react-slider";
import type { JSX } from "react";

interface SensorSliderProps {
  label: string;
  icon: JSX.Element;
  value: [number, number];
  setValue: (val: [number, number]) => void;
  min: number;
  max: number;
}

export const SensorSlider = ({ label, icon, value, setValue, min, max }: SensorSliderProps) => (
  <div className="w-full max-w-xl mx-auto p-6 md:p-8 bg-white rounded-lg border border-gray-200 shadow-lg">
    <div className="flex items-center gap-3 text-xl md:text-2xl font-bold mb-4">
      {icon} {label}
    </div>

    <div className="flex justify-between text-base md:text-lg text-muted-foreground font-medium mb-2">
      <span>{min}</span>
      <span>{value[0]} - {value[1]}</span>
      <span>{max}</span>
    </div>

    <Slider.Root
      className="relative flex items-center w-full h-6 md:h-8"
      value={value}
      min={min}
      max={max}
      step={1}
      onValueChange={setValue}
    >
      <Slider.Track className="relative flex-1 h-4 md:h-5 bg-red-200 rounded-full">
        <Slider.Range className="absolute h-4 md:h-5 bg-green-400 rounded-full" />
      </Slider.Track>

      <Slider.Thumb className="block w-7 h-7 md:w-9 md:h-9 bg-white border border-gray-400 rounded-full shadow-md" />
      <Slider.Thumb className="block w-7 h-7 md:w-9 md:h-9 bg-white border border-gray-400 rounded-full shadow-md" />
    </Slider.Root>
  </div>
);
