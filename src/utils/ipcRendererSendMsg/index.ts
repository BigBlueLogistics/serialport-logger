import { ipcRenderer } from "electron";

export default function ipcRendererSendMsg(
  channel: string,
  argObj: Record<string, any>
) {
  if (!argObj && typeof argObj !== "object") {
    throw new TypeError("Value must be an object");
  }

  return ipcRenderer.send(channel, argObj);
}
