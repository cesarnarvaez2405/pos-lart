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
  async crearMesaContabilidad(datos) {
    try {
      const response = await axios.post(`${API.node}/mesa-contabilidad`, datos);
      return response.data;
    } catch (error) {
      alertErrorResponse(error);
    }
  },
};
