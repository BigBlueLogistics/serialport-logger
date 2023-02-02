import { IMainStore } from "../../entities";

export type ICommands = {
  isConnected: boolean;
  onTriggerStatus: () => void;
} & Pick<IMainStore, "triggerStatus">;
