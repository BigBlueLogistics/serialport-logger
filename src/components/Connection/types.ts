import { ChangeEvent } from "react";
import { SerialPort } from "serialport";

export type IConnection = {
  isConnected: boolean;
  initConfig: () => SerialPort | unknown;
  onChangePortConfig: (e: ChangeEvent<HTMLSelectElement>) => void;
};

export type IPorts = {
  path?: string;
}[];
