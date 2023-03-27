import { ChangeEvent } from "react";
import { SerialPort } from "serialport";

export type IConnection = {
  selectedPort: string | undefined;
  isConnected: boolean;
  isSquare: boolean;
  conveyor: string;
  onChangeConveyor: (e: ChangeEvent<HTMLInputElement>) => void;
  onToggleConnection: () => SerialPort | unknown;
  onChangePortConfig: (e: ChangeEvent<HTMLSelectElement>) => void;
  onClickSquare: () => void;
};

export type IPorts = {
  path?: string;
}[];
