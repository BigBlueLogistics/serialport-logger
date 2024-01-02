import { ChangeEvent } from "react";
import { SerialPort } from "serialport";

export type IConnection = {
  selectedPort: string | undefined;
  isConnected: boolean;
  isSquare: boolean;
  indicatorIp: string;
  onToggleConnection: () => SerialPort | unknown;
  onChangePortConfig: (e: ChangeEvent<HTMLSelectElement>) => void;
  onClickSquare: () => void;
  onChangeIndicatorIp: (e: ChangeEvent<HTMLInputElement>) => void;
};

export type IPorts = {
  path?: string;
}[];
