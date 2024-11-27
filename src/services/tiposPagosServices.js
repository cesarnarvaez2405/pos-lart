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
  async getTiposPagos() {
    try {
      const response = await axios.get(`${API.node}/tipos-pagos`);
      return response.data;
    } catch (error) {
      alertErrorResponse(error);
    }
  },
};
