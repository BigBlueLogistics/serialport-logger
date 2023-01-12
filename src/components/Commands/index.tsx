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

      <DataHistory data={data} />
    </fieldset>
  );
}

export default Commands;
