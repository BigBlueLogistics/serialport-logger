export type IMainStore = {
  port: string;
  connectionStatus:
    | "CONNECTING"
    | "CONNECTED"
    | "DISCONNECTING"
    | "DISCONNECTED";
  triggerStatus: "LOFF" | "LON";
};

export default IMainStore;
