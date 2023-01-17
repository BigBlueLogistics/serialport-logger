export type ITriggerStatus = "LON" | "LOFF";

export type ICommands = {
  isConnected: boolean;
  triggerStatus: ITriggerStatus;
  onTriggerStatus: () => void;
};
