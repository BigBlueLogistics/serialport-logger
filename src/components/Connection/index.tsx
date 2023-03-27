import { useEffect, useState } from "react";
import { SerialPort } from "serialport";
import { IPorts, IConnection } from "./types";
import "./styles.scss";

function Connection({
  selectedPort,
  isConnected,
  isSquare,
  conveyor,
  onToggleConnection,
  onChangePortConfig,
  onChangeConveyor,
  onClickSquare,
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
      <div className="wrapper">
        <label>Squaring: </label>
        <button type="button" className="btn-squaring" onClick={onClickSquare}>
          {isSquare ? "DISABLE" : "ENABLE"}
        </button>
      </div>
      <div className="wrapper">
        <button
          type="button"
          onClick={onToggleConnection}
          className="btn-connect"
        >
          {isConnected ? "disconnect" : "connect"}
        </button>
        <select
          onChange={onChangePortConfig}
          disabled={isConnected}
          value={selectedPort}
        >
          <option value="">---</option>
          {optionPorts.length
            ? optionPorts.map((data) => (
                <option key={data.path} value={data.path}>
                  {data.path}
                </option>
              ))
            : null}
        </select>
      </div>
    </fieldset>
  );
}

export default Connection;
