import { useState, useEffect } from "react";
import { ReadlineParser, SerialPort } from "serialport";
import { ipcRenderer } from "electron";

import DataHistory from "../../components/DataHistory";
import { IDataHistory } from "../../components/DataHistory/types";
import { ICommands } from "../../components/Command/types";
import {
  format,
  ipcRendererSendMsg,
  ipcRendererListenerMsg,
} from "../../utils";
import { IMainStore } from "entities";
import "./styles.scss";

let serialportConfig: SerialPort;

function Home() {
  const [mainStore, setMainStore] = useState<IMainStore | null>(null);
  const [palletNo, setPalletNo] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [status, setStatus] = useState<IDataHistory["status"]>("idle");

  const initConnection = () => {
    const port = new SerialPort({
      path: mainStore?.port as string,
      baudRate: 9600,
      dataBits: 8,
      parity: "none",
      stopBits: 1,
      autoOpen: false,
      endOnClose: true,
    });

    return port;
  };

  const openPort = () => {
    // Open the port
    serialportConfig.open((err: any) => {
      if (err) {
        console.log(`Error opening port: ${err.message}`);
        return;
      }

      ipcRendererSendMsg("set-store-value", {
        connectionStatus: "CONNECTED",
      });
    });
  };

  const closePort = () => {
    if (serialportConfig.isOpen) {
      sendCommand("LOFF");

      // Close the port
      serialportConfig.close((err: any) => {
        if (err) {
          console.log(`Error closing port: ${err.message}`);
          return;
        }

        ipcRendererSendMsg("set-store-value", {
          triggerStatus: "LOFF",
        });
      });
    }

    ipcRendererSendMsg("set-store-value", {
      connectionStatus: "DISCONNECTED",
    });
  };

  const sendCommand = (status: ICommands["triggerStatus"]) => {
    // Send a command to the COM port
    serialportConfig.write(`'\r${status}\r'`, (err: any) => {
      if (err) {
        console.log(`Error writing to port: ${err.message}`);
        return;
      }
      console.log("command sent");
    });
  };

  const readData = () => {
    if (serialportConfig) {
      const parser = new ReadlineParser();
      serialportConfig.pipe(parser);
      serialportConfig.setEncoding("utf8");

      serialportConfig.on("readable", function () {
        const plainText = serialportConfig.read();

        if (plainText && !format.isEmpty(plainText)) {
          const [, palletNo] = plainText.split(":");

          if (format.isValidPalletNo(palletNo)) {
            // TODO: call ASRS services
            setStatus("success");
            setErrorMsg("");
          } else {
            setErrorMsg("Invalid pallet number.");
            setStatus("failed");
          }
          setPalletNo(palletNo);
        } else {
          console.log("Empty", plainText);
        }
      });
    } else {
      console.log("no data");
    }
  };

  // rehydrate the main store from localStorage
  useEffect(() => {
    const cacheMainStore = localStorage.getItem("serialport-config");
    if (cacheMainStore && serialportConfig) {
      const parsedCacheStore = JSON.parse(cacheMainStore);
      setMainStore(parsedCacheStore);
      ipcRendererSendMsg("set-store-value", parsedCacheStore);
    }
  }, []);

  // Listen new changes in mainStore from main process
  useEffect(() => {
    ipcRendererListenerMsg("get-store-value", (_, json) => {
      console.log("Home store", json);

      setMainStore(json);
      localStorage.setItem("serialport-config", JSON.stringify(json));
    });
  }, []);

  // Initialize serialport connection
  useEffect(() => {
    if (mainStore?.connectionStatus === "CONNECTING") {
      serialportConfig = initConnection();
    }
  }, [mainStore]);

  // Open / close port and send command for trigger
  useEffect(() => {
    if (serialportConfig) {
      if (mainStore?.connectionStatus === "CONNECTING") {
        openPort();
      }

      if (mainStore?.connectionStatus === "DISCONNECTING") {
        closePort();
      }

      if (mainStore?.connectionStatus === "CONNECTED") {
        sendCommand(mainStore?.triggerStatus);
      }
    }
  }, [serialportConfig, mainStore]);

  // Listen data coming from serialport
  useEffect(() => {
    readData();
  }, [serialportConfig]);

  return (
    <div className="container">
      <DataHistory palletNo={palletNo} message={errorMsg} status={status} />
    </div>
  );
}

export default Home;
