import axios from "axios";
import API from "../api/apiPascioli";
import {
  alertErrorResponse,
  alertSuccessReponse,
} from "../utils/alertResponseHttpUtils";

/**
 * Modulo para realizar las peticiones http API
 * @module export - Functions
 */

export default {
  async getImprimirFactura(datos) {
    try {
      const response = await axios.post(`${API.factura}/factura`, datos);
      return response;
    } catch (error) {
      alertErrorResponse(error);
    }
  },
};
