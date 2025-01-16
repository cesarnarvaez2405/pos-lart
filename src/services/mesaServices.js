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

  async crearMesa(datos) {
    try {
      const response = await axios.post(`${API.node}/mesas`, datos);
      alertSuccessReponse(response);
      return response.data;
    } catch (error) {
      alertErrorResponse(error);
    }
  },

  async editarMesa(id, datos) {
    try {
      const response = await axios.patch(`${API.node}/mesas/${id}`, datos);
      alertSuccessReponse(response);
      return response.data;
    } catch (error) {
      alertErrorResponse(error);
    }
  },

  async buscarPorId(id) {
    try {
      const response = await axios.get(`${API.node}/mesas/${id}`);
      return response.data;
    } catch (error) {
      alertErrorResponse(error);
    }
  },
};
