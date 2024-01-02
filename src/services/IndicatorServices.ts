import HttpAdapter from "./httpAdapter";
import { format } from "../utils";

class IndicatorServices extends HttpAdapter {
  getColorLight({
    message,
    palletNo,
  }: {
    message: string;
    palletNo: string;
  }): "red" | "yellow" | "green" {
    const successMsgGreen = (pallet: string) => {
      return ["ok"];
    };
    const errMsgRed = (pallet: string) => {
      return [
        format.toLowerCase(
          `Pallet ${pallet} is not found at assigned warehouse`
        ),
      ];
    };

    if (successMsgGreen(palletNo).includes(format.toLowerCase(message))) {
      return "green";
    }
    if (errMsgRed(palletNo).includes(format.toLowerCase(message))) {
      return "red";
    }

    return "yellow";
  }

  switchLights({
    ipAddr,
    message,
    palletNo = "",
  }: {
    ipAddr: string;
    message: string;
    palletNo?: string;
  }) {
    if (ipAddr) {
      const color = this.getColorLight({ message, palletNo });
      const url = `/indicator/${color}?${color.toUpperCase()}=0`;

      return this.get(url, {
        baseURL: `http://${ipAddr}`,
        validateStatus: () => {
          // Don't throw error, from any status code
          return true;
        },
      });
    }

    return;
  }
}

export default IndicatorServices;
