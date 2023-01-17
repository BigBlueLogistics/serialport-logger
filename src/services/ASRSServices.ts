import { AxiosRequestConfig, AxiosResponse } from "axios";
import HttpAdapter from "services/httpAdapter";
import { IASRS } from "entities";

class ASRSServices extends HttpAdapter {
  getASRSPutawayCheck(
    config: AxiosRequestConfig
  ): Promise<AxiosResponse<IASRS & { LGPLA: string }>> {
    return this.post("/ASRSPutawayCheck", {}, config);
  }

  getASRSPutawayNow(config: AxiosRequestConfig): Promise<AxiosResponse<IASRS>> {
    return this.post("/ASRSPutawayNow", {}, config);
  }

  getASRSCheckWCS(config: AxiosRequestConfig): Promise<AxiosResponse<IASRS>> {
    return this.post("/ASRSCheckWCS", {}, config);
  }

  async transferPallet(palletNo: string) {
    const queryParams = { huident: palletNo, server: "prd" };

    try {
      // ASRSPutawayCheck
      const { data: dataPutawayCheck } = await this.getASRSPutawayCheck({
        params: { lgnum: "WH05", ...queryParams },
      });
      if (dataPutawayCheck.status === "E") {
        throw dataPutawayCheck.message;
      }

      // ASRSCheckWCS
      const { data: dataWCS } = await this.getASRSCheckWCS({
        params: queryParams,
      });
      if (dataWCS.status === "E") {
        throw dataWCS.message;
      }

      // Bin2bin
      const { data: dataBin2bin } = await this.bin2bin(
        palletNo,
        dataPutawayCheck.LGPLA
      );
      if (dataBin2bin.status === "E") {
        throw dataBin2bin.message;
      }

      // ASRSPutawayNow
      const { data: dataPutawayNow } = await this.getASRSPutawayNow({
        params: { ...queryParams, wrap: 0, square: 1 },
      });
      if (dataPutawayNow.status === "E") {
        throw dataPutawayNow.message;
      }
    } catch (error) {
      throw error;
    }
  }

  async bin2bin(
    palletNo: string,
    location: string
  ): Promise<AxiosResponse<IASRS>> {
    const wh = "WH05";
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
        palletid: palletNo,
        type: "bintobin",
        server: "prd",
        username: "RFCMANAGER",
        password: "2BBLC1234@dmin",
        lgnum: "WH05",
      });

      return resp;
    } catch (error) {
      throw error;
    }
  }
}

export default ASRSServices;
