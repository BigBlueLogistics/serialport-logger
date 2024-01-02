export type IMainStore = {
  port: string;
  connectionStatus:
    | "CONNECTING"
    | "CONNECTED"
    | "DISCONNECTING"
    | "DISCONNECTED";
  triggerStatus: "LOFF" | "LON";
  squaring: 1 | 0;
  indicatorIp: string;
};

export default IMainStore;
