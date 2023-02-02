export type IMainStore = {
  port: string;
  connectionStatus:
    | "CONNECTING"
    | "CONNECTED"
    | "DISCONNECTING"
    | "DISCONNECTED";
  triggerStatus: "LOFF" | "LON";
  conveyor: string;
};

export default IMainStore;
