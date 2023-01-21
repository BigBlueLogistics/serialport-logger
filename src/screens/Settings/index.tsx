import { ChangeEvent, useEffect, useState } from "react";
import Command from "../../components/Command";
import { ipcRenderer } from "electron";
import Connection from "../../components/Connection";
import { ipcRendererSendMsg, ipcRendererListenerMsg } from "../../utils";
import { IMainStore } from "../../entities";

function Settings() {
  const [mainStore, setMainStore] = useState<IMainStore | null>(null);

  useEffect(() => {
    const cacheMainStore = localStorage.getItem("serialport-config");
    if (cacheMainStore) {
      const parsedCacheStore = JSON.parse(cacheMainStore);
      setMainStore(parsedCacheStore);
    }
  }, []);

  useEffect(() => {
    ipcRendererListenerMsg("get-store-value", (_, json) => {
      console.log("Settings store", json);
      setMainStore(json);
    });
  }, [ipcRenderer]);

  const onToggleConnection = () => {
    try {
      if (
        mainStore?.connectionStatus === "DISCONNECTED" ||
        mainStore?.connectionStatus === "DISCONNECTING"
      ) {
        //Check if has port selected
        if (mainStore.port) {
          ipcRendererSendMsg("set-store-value", {
            connectionStatus: "CONNECTING",
          });
        }
      } else {
        ipcRendererSendMsg("set-store-value", {
          connectionStatus: "DISCONNECTING",
        });
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const onChangePortConfig = async (e: ChangeEvent<HTMLSelectElement>) => {
    try {
      ipcRendererSendMsg("set-store-value", { port: e.target.value });
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const onTriggerStatus = () => {
    const command = mainStore?.triggerStatus === "LOFF" ? "LON" : "LOFF";
    ipcRendererSendMsg("set-store-value", { triggerStatus: command });
  };

  return (
    <>
      <Connection
        selectedPort={mainStore?.port}
        isConnected={mainStore?.connectionStatus === "CONNECTED"}
        onToggleConnection={onToggleConnection}
        onChangePortConfig={onChangePortConfig}
      />
      <Command
        onTriggerStatus={onTriggerStatus}
        triggerStatus={mainStore?.triggerStatus}
        isConnected={mainStore?.connectionStatus === "CONNECTED"}
      />
    </>
  );
}

export default Settings;
