import { ChangeEvent } from "react";
import { SerialPort } from "serialport";

export type IConnection = {
  selectedPort: string | undefined;
  isConnected: boolean;
  conveyor: string;
  onChangeConveyor: (e: ChangeEvent<HTMLInputElement>) => void;
  onToggleConnection: () => SerialPort | unknown;
  onChangePortConfig: (e: ChangeEvent<HTMLSelectElement>) => void;
};

export type IPorts = {
  path?: string;
}[];
