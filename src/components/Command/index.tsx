import DataHistory from "../DataHistory";
import { ICommands } from "./types";
import "./styles.scss";

function Commands({
  data,
  triggerStatus,
  isConnected,
  onTriggerStatus,
}: ICommands) {
  return (
    <fieldset id="fldt-command">
      <legend>Command</legend>
      <div className="wrapper-trigger">
        <label>Trigger:</label>
        <button
          className="btn-trigger"
          type="button"
          onClick={onTriggerStatus}
          disabled={isConnected ? false : true}
        >
          {triggerStatus === "LOFF" ? "ON" : "OFF"}
        </button>
      </div>

      <DataHistory data={data} />
    </fieldset>
  );
}

export default Commands;
