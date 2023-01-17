import { useState, ChangeEvent, useEffect } from "react";
import Connection from "./components/Connection";
import Command from "./components/Command";
import DataHistory from "./components/DataHistory";
import { IDataHistory } from "./components/DataHistory/types";
import { ITriggerStatus } from "./components/Command/types";
import { SerialPort, ReadlineParser } from "serialport";
import { format } from "./utils";
import "./App.scss";

let initConfigPort: SerialPort;

function App() {
  const [selectedPort, setSelectedPort] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [triggerStatus, setTriggerStatus] = useState<ITriggerStatus>("LOFF");
  const [palletNo, setPalletNo] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [status, setStatus] = useState<IDataHistory["status"]>("idle");

  const initConnection = () => {
    return new SerialPort({
      path: selectedPort,
      baudRate: 9600,
      dataBits: 8,
      parity: "none",
      stopBits: 1,
      autoOpen: false,
      endOnClose: true,
    });
  };

  const onToggleConnection = () => {
    try {
      if (!isConnected) {
        initConfigPort = initConnection();
        openPort();
      } else {
        closePort();
      }
    } catch (error) {
      console.log(error);
      return error;
    }
  };

  const openPort = () => {
    // Open the port
    initConfigPort.open((err) => {
      if (err) {
        console.log(`Error opening port: ${err.message}`);
        return;
      }

      setIsConnected(true);
    });
  };

  const closePort = () => {
    if (initConfigPort.isOpen) {
      sendCommand("LOFF");
    }
    // Close the port
    initConfigPort.close((err) => {
      if (err) {
        console.log(`Error closing port: ${err.message}`);
        return;
      }
      setTriggerStatus("LOFF");
      setIsConnected(false);
    });
  };

  const sendCommand = (status: ITriggerStatus) => {
    // Send a command to the COM port
    initConfigPort.write(`'\r${status}\r'`, (err) => {
      if (err) {
        console.log(`Error writing to port: ${err.message}`);
        return;
      }

      console.log("command sent");
    });
  };

  const onChangePortConfig = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPort(e.target.value);
  };

  const onTriggerStatus = () => {
    const command = triggerStatus === "LOFF" ? "LON" : "LOFF";
    setTriggerStatus(command);
    sendCommand(command);
  };

  const readData = () => {
    if (initConfigPort) {
      const parser = new ReadlineParser();
      initConfigPort.pipe(parser);
      initConfigPort.setEncoding("utf8");

      initConfigPort.on("readable", function () {
        const plainText = initConfigPort.read();

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

  useEffect(() => {
    readData();
  }, [initConfigPort]);

  return (
    <div className="container">
      <Connection
        isConnected={isConnected}
        onToggleConnection={onToggleConnection}
        onChangePortConfig={onChangePortConfig}
      />
      <Command
        isConnected={isConnected}
        triggerStatus={triggerStatus}
        onTriggerStatus={onTriggerStatus}
      />
      <DataHistory palletNo={palletNo} message={errorMsg} status={status} />
    </div>
  );
}
export default App;
