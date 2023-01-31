import { AxiosResponse } from "axios";
import HttpAdapter from "./httpAdapter";
import { IASRS } from "../entities";

class ASRSServices extends HttpAdapter {
  getASRSPutawayCheck(
    data: any
  ): Promise<AxiosResponse<IASRS & { LGPLA: string }>> {
    return this.post("/ASRSPutawayCheck", data);
  }

  getASRSPutawayNow(data: any): Promise<AxiosResponse<IASRS>> {
    return this.post("/ASRSPutawayNow", data);
  }

  getASRSCheckWCS(data: any): Promise<AxiosResponse<IASRS>> {
    return this.post("/ASRSCheckWCS", data);
  }

  hasPalletFromOutbound(data: any) {
    return this.get("/has-outbound", {
      baseURL: "http://192.168.5.139:15692/api",
      params: {
        ...data,
      },
    });
  }

  async transferPallet(palletNo: string, conveyorDest: string) {
    const queryParams = { huident: palletNo, server: "prd" };

    try {
      // Check has outbound
      const { data: dataHasOutbound } = await this.hasPalletFromOutbound({
        palletNo,
        conveyor_des: conveyorDest,
      });
      if (dataHasOutbound.status === "E") {
        throw new Error(dataHasOutbound.message);
      }

      // ASRSPutawayCheck
      const { data: dataPutawayCheck } = await this.getASRSPutawayCheck({
        ...queryParams,
        lgnum: "WH05",
      });
      const excludeMessage = `Pallet ${palletNo} is already located at ASRS, putaway request cannot be processed`;
      if (
        dataPutawayCheck.status === "E" &&
        dataPutawayCheck.message.toLowerCase() !== excludeMessage.toLowerCase()
      ) {
        throw new Error(dataPutawayCheck.message);
      }

      // ASRSCheckWCS
      const { data: dataWCS } = await this.getASRSCheckWCS(queryParams);
      if (dataWCS.status === "E") {
        throw new Error(dataWCS.message);
      }

      // Bin2bin
      const { data: dataBin2bin } = await this.bin2bin(
        palletNo,
        dataPutawayCheck.LGPLA
      );
      if (dataBin2bin.status === "E") {
        throw new Error(dataBin2bin.message);
      }

      // ASRSPutawayNow
      const { data: dataPutawayNow } = await this.getASRSPutawayNow({
        server: "prd",
        huident: palletNo,
        wrap: 1,
        square: 0,
      });
      if (dataPutawayNow.status === "E") {
        throw new Error(dataPutawayNow.message);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async bin2bin(
    palletNo: string,
    location: string
  ): Promise<AxiosResponse<IASRS>> {
    const wh = "WH05";
    // const palletNo = "";
    // const location = "ASRS";

    try {
      let item = "";
      let header = "";

      let BinToBinTransferResultSet =
        "{" +
        "\n" +
        '"Warehouseno":' +
        '"' +
        wh +
        '",' +
        "\n" +
        '"Warehouseprocesstype":' +
        '"",' +
        "\n" +
        '"Handlingunit":' +
        '"",' +
        "\n" +
        '"Product":' +
        '"",' +
        "\n" +
        '"Storagebin":' +
        '"",' +
        "\n" +
        '"Resource":' +
        '"",' +
        "\n" +
        '"Transportationunit":' +
        '"",' +
        "\n" +
        '"Partyentitledtodispose":' +
        '"",' +
        "\n" +
        '"Owner":' +
        '"",' +
        "\n" +
        '"WhseOrder":' +
        '"",' +
        "\n" +
        '"WhseTask":' +
        '"",' +
        "\n" +
        '"Type":' +
        '"",' +
        "\n" +
        '"Message":' +
        '""' +
        "\n" +
        "}\n]";

      item =
        "{" +
        "\n" +
        '"Warehouseno":' +
        '"' +
        wh +
        '",' +
        "\n" +
        '"Warehouseprocesstype":' +
        '"9999",' +
        "\n" +
        '"Handlingunit":' +
        '"' +
        palletNo +
        '",' +
        "\n" +
        '"Product":' +
        '"",' +
        "\n" +
        '"Storagebin":' +
        '"",' +
        "\n" +
        '"Resource":' +
        '"",' +
        "\n" +
        '"Transportationunit":' +
        '"",' +
        "\n" +
        '"Partyentitledtodispose":' +
        '"",' +
        "\n" +
        '"Owner":' +
        '"",' +
        "\n" +
        '"Delayconfirmation":' +
        "false," +
        "\n" +
        '"Desthandlingunit":' +
        '"",' +
        "\n" +
        '"Deststoragetypegroup":' +
        '"",' +
        "\n" +
        '"Deststoragetype":' +
        '"ASRS",' +
        "\n" +
        '"Deststoragesection":' +
        '"",' +
        "\n" +
        '"Deststoragebin":' +
        '"ASRS",' +
        "\n" +
        '"Destresource":' +
        '"",' +
        "\n" +
        '"Desttransunit":' +
        '"",' +
        "\n" +
        '"Destcarrier":' +
        '"",' +
        "\n" +
        '"Reason":' +
        '"",' +
        "\n" +
        '"Plannedexecdatetime": "/Date(' +
        new Date().valueOf() +
        ')/",\n' +
        '"Confirmwtimmediately":' +
        "true," +
        "\n" +
        '"Nameofprinter":' +
        '"",' +
        "\n" +
        '"Exceptioncode":' +
        '"",' +
        "\n" +
        '"BinToBinTransferResultSet":' +
        "[" +
        "\n" +
        BinToBinTransferResultSet +
        "\n" +
        "\n}\n]\n}\n}";

      header =
        header +
        '{"d": {' +
        "\n" +
        '"Warehouseno":' +
        '"' +
        wh +
        '",' +
        "\n" +
        '"Warehouseprocesstype":' +
        '"9999",' +
        "\n" +
        '"Handlingunit":' +
        '"' +
        palletNo +
        '",' +
        "\n" +
        '"Product":' +
        '"",' +
        "\n" +
        '"Storagebin":' +
        '"' +
        location +
        '",' +
        "\n" +
        '"Resource":' +
        '"",' +
        "\n" +
        '"Transportationunit":' +
        '"",' +
        "\n" +
        '"Partyentitledtodispose":' +
        '"",' +
        "\n" +
        '"Owner":' +
        '"",' +
        "\n" +
        '"BinToBinTransferSet":' +
        "[" +
        item;

      const resp = await this.post("/internalwebservice", {
        headerinfo: header,
        type: "bintobin",
        server: "prd",
        username: "RFCMANAGER",
        password: "2BBLC1234@dmin",
      });

      return resp;
    } catch (error) {
      throw error;
    }
  }
}

export default ASRSServices;
