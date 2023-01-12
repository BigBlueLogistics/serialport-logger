import { useState, ChangeEvent, useEffect } from "react";
import Connection from "./components/Connection";
import Command from "./components/Command";
import { ITriggerStatus } from "./components/Command/types";
import { SerialPort, ReadlineParser } from "serialport";
import { arrayLimit } from "./utils";
import "./App.scss";

let initConfigPort: SerialPort;

function App() {
  const [selectedPort, setSelectedPort] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [triggerStatus, setTriggerStatus] = useState<ITriggerStatus>("LOFF");
  const [historyData, setHistoryData] = useState<string[]>([]);

  const initConfig = () => {
    try {
      initConfigPort = new SerialPort({
        path: selectedPort,
        baudRate: 9600,
        dataBits: 8,
        parity: "none",
        stopBits: 1,
        autoOpen: false,
        endOnClose: true,
      });

      // Open the port
      initConfigPort.open((err) => {
        if (err) {
          console.log(`Error opening port: ${err.message}`);
          return;
        }

        setIsConnected(true);
      });
    } catch (error) {
      console.log(error);
      return error;
    }
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
        if (plainText && plainText.match(/./i)) {
          // Limit data to only 6 entries and
          // display the last two elements from array.
          setHistoryData((prev) => {
            const newData = [...prev, plainText];
            const limitData = arrayLimit(6, newData);

            return limitData;
          });
        }
      });
    } else {
      console.log("no data");
    }
  };

  const closeConnection = () => {
    if (isConnected) {
      sendCommand("LOFF");
      initConfigPort.close();
    }
  };

  useEffect(() => {
    readData();

    return () => closeConnection();
  }, [initConfigPort]);

  return (
    <div className="container">
      <Connection
        isConnected={isConnected}
        initConfig={initConfig}
        onChangePortConfig={onChangePortConfig}
      />
      <Command
        isConnected={isConnected}
        data={historyData}
        triggerStatus={triggerStatus}
        onTriggerStatus={onTriggerStatus}
      />
    </div>
  );
}
export default App;
