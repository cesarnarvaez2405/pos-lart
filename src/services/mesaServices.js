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
  async getMesaPorCaja(cajaId) {
    try {
      const response = await axios.get(
        `${API.node}/mesas/buscar-por-caja/${cajaId}`
      );
      return response.data;
    } catch (error) {
      alertErrorResponse(error);
    }
  },
};
