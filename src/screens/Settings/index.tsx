import { ChangeEvent, useEffect, useState } from "react";
import Command from "../../components/Command";
import { ipcRenderer } from "electron";
import Connection from "../../components/Connection";
import { ipcRendererSendMsg, ipcRendererListenerMsg } from "../../utils";
import { IMainStore } from "../../entities";

function Settings() {
  const [mainStore, setMainStore] = useState<IMainStore>({
    connectionStatus: "DISCONNECTED",
    port: "",
    conveyor: "",
    triggerStatus: "LOFF",
  });

  useEffect(() => {
    const cacheMainStore = localStorage.getItem("serialport-config");
    if (cacheMainStore) {
      const parsedCacheStore = JSON.parse(cacheMainStore);

      setMainStore(parsedCacheStore);
    }
  }, []);

  useEffect(() => {
    ipcRendererListenerMsg("get-store-value", (_, json) => {
      setMainStore(json);
    });
  }, [ipcRenderer]);

  const onToggleConnection = () => {
    if (!mainStore.conveyor) {
      alert("Please input the conveyour number");
      return;
    }

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

  const onChangeConveyor = (e: ChangeEvent<HTMLInputElement>) => {
    ipcRendererSendMsg("set-store-value", { conveyor: e.target.value });
  };

  return (
    <>
      <Connection
        selectedPort={mainStore?.port}
        conveyor={mainStore?.conveyor}
        isConnected={mainStore?.connectionStatus === "CONNECTED"}
        onToggleConnection={onToggleConnection}
        onChangePortConfig={onChangePortConfig}
        onChangeConveyor={onChangeConveyor}
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
