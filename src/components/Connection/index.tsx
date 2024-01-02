import { useEffect, useState } from "react";
import { SerialPort } from "serialport";
import { IPorts, IConnection } from "./types";
import "./styles.scss";

function Connection({
  selectedPort,
  isConnected,
  isSquare,
  indicatorIp,
  triggerStatus,
  onToggleConnection,
  onChangePortConfig,
  onClickSquare,
  onChangeIndicatorIp,
  onTriggerStatus,
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

  const activeClassConnectDevice = isConnected ? "active" : "";
  const activeClassBarcode =
    isConnected && triggerStatus === "LON" ? "active" : "";
  const activeClassSquare = isSquare ? "active" : "";

  return (
    <div className="col-12">
      <div className="form-control">
        <label>Connect device port:</label>
        <div className="row col-12">
          <button
            type="button"
            onClick={onToggleConnection}
            className={`btn-connect col-2 ${activeClassConnectDevice}`}
          >
            {isConnected ? "disconnect" : "connect"}
          </button>
          <select
            className="select-port col-2"
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
      </div>
      <div className="form-control">
        <label>
          Barcode reader: <small>ON / OFF</small>
        </label>
        <button
          className={`btn-trigger ${activeClassBarcode}`}
          type="button"
          onClick={onTriggerStatus}
          disabled={isConnected ? false : true}
        >
          {triggerStatus === "LOFF" ? "ON" : "OFF"}
        </button>
      </div>
      <div className="form-control">
        <label>Squaring: </label>
        <button
          type="button"
          className={`btn-squaring ${activeClassSquare}`}
          onClick={onClickSquare}
        >
          {isSquare ? "DISABLE" : "ENABLE"}
        </button>
      </div>
      <div className="form-control">
        <label>
          Indicator lights: <small>IP address</small>
        </label>
        <input
          className="col-12 text-ip-address"
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
  );
}

export default Connection;
