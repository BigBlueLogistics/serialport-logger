import { ChangeEvent } from "react";
import { SerialPort } from "serialport";

export type IConnection = {
  selectedPort: string | undefined;
  isConnected: boolean;
  onToggleConnection: () => SerialPort | unknown;
  onChangePortConfig: (e: ChangeEvent<HTMLSelectElement>) => void;
};

export type IPorts = {
  path?: string;
}[];
