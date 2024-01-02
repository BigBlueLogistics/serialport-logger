import { ChangeEvent, useEffect, useState } from "react";
import { ipcRenderer } from "electron";
import Connection from "../../components/Connection";
import { ipcRendererSendMsg, ipcRendererListenerMsg } from "../../utils";
import { IMainStore } from "../../entities";

function Settings() {
  const [mainStore, setMainStore] = useState<IMainStore>({
    connectionStatus: "DISCONNECTED",
    port: "",
    triggerStatus: "LOFF",
    squaring: 0,
    indicatorIp: "",
  });

  // rehydrate the main store from localStorage
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

  const onClickSquare = () => {
    const squaring = Number(mainStore?.squaring) === 1 ? 0 : 1;
    ipcRendererSendMsg("set-store-value", { squaring });
  };

  const onChangeIndicatorIp = (e: ChangeEvent<HTMLInputElement>) => {
    ipcRendererSendMsg("set-store-value", { indicatorIp: e.target.value });
  };

  return (
    <>
      <Connection
        selectedPort={mainStore?.port}
        indicatorIp={mainStore?.indicatorIp}
        isConnected={mainStore?.connectionStatus === "CONNECTED"}
        isSquare={Number(mainStore?.squaring) === 1}
        onToggleConnection={onToggleConnection}
        onChangePortConfig={onChangePortConfig}
        onClickSquare={onClickSquare}
        onChangeIndicatorIp={onChangeIndicatorIp}
        onTriggerStatus={onTriggerStatus}
        triggerStatus={mainStore?.triggerStatus}
      />
    </>
  );
}

export default Settings;
