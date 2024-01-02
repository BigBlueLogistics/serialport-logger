import { useEffect, useState } from "react";
import { SerialPort } from "serialport";
import { IPorts, IConnection } from "./types";
import "./styles.scss";

function Connection({
  selectedPort,
  isConnected,
  isSquare,
  indicatorIp,
  onToggleConnection,
  onChangePortConfig,
  onClickSquare,
  onChangeIndicatorIp,
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
      <div className="wrapper">
        <label>Indicators lights: </label>
        <div>
          <input
            type="text"
            value={indicatorIp}
            size={15}
            minLength={7}
            maxLength={15}
            pattern="^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$"
            name="indicator-ip"
            placeholder="E.g: 192.168.X.X"
            onChange={onChangeIndicatorIp}
          />
        </div>
      </div>
    </fieldset>
  );
}

export default Connection;
