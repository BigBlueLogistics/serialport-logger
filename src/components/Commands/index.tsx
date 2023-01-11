import { ICommands } from "./types";
import "./styles.scss";

function Commands({
  data,
  triggerStatus,
  isConnected,
  onTriggerStatus,
}: ICommands) {
  return (
    <fieldset>
      <div>
        <label>Trigger:</label>
        <button
          type="button"
          onClick={onTriggerStatus}
          disabled={isConnected ? false : true}
        >
          {triggerStatus === "LOFF" ? "ON" : "OFF"}
        </button>
      </div>
      <legend>Command</legend>
      <div className="data-history">
        {data.length ? (
          data.map((barcode, idx) => (
            <p key={idx}>{barcode.split(":").toString()}</p>
          ))
        ) : (
          <p>No data available.</p>
        )}
      </div>
    </fieldset>
  );
}

export default Commands;
