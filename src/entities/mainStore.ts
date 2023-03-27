export type IMainStore = {
  port: string;
  connectionStatus:
    | "CONNECTING"
    | "CONNECTED"
    | "DISCONNECTING"
    | "DISCONNECTED";
  triggerStatus: "LOFF" | "LON";
  conveyor: string;
  squaring: 1 | 0;
};

export default IMainStore;
