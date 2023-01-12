import { useEffect, useState } from "react";
import { SerialPort } from "serialport";
import { IPorts, IConnection } from "./types";
import "./styles.scss";

function Connection({
  isConnected,
  onToggleConnection,
  onChangePortConfig,
}: IConnection) {
  const [optionPorts, setOptionPorts] = useState<IPorts>([]);

  const listSerialPorts = async () => {
    try {
      const ports = await SerialPort.list();
      setOptionPorts(ports);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    listSerialPorts();

    setInterval(listSerialPorts, 2000);
  }, []);

  return (
    <fieldset id="fldt-connection">
      <legend>Communication</legend>
      <button
        type="button"
        onClick={onToggleConnection}
        className="btn-connect"
      >
        {isConnected ? "disconnect" : "connect"}
      </button>
      <select onChange={onChangePortConfig} disabled={isConnected}>
        <option value="">---</option>
        {optionPorts.length
          ? optionPorts.map((data) => (
              <option key={data.path} value={data.path}>
                {data.path}
              </option>
            ))
          : null}
      </select>
    </fieldset>
  );
}

export default Connection;
