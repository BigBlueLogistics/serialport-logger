import { useEffect, useState } from "react";
import { SerialPort } from "serialport";
import { IPorts, IConnection } from "./types";

function Connection({
  isConnected,
  initConfig,
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
      <fieldset>
        <legend>Communication</legend>
        <button type="button" onClick={initConfig}>
          Connect
        </button>
        <select onChange={onChangePortConfig}>
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
