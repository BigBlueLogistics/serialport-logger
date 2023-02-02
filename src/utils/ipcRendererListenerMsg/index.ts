import { ipcRenderer, IpcRendererEvent } from "electron";

export default function ipcRendererListenerMsg(
  channel: string,
  listener: (event: IpcRendererEvent, ...args: any[]) => void
) {
  if (!channel && typeof channel !== "string") {
    throw new TypeError("channel must be string");
  }

  if (!listener && typeof listener !== "function") {
    throw new TypeError("listener must be function");
  }

  return ipcRenderer.on(channel, listener);
}
