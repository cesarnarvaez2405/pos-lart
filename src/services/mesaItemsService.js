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
  async crearMesaItems(datos) {
    try {
      const response = await axios.post(`${API.node}/mesa-item`, datos);
      alertSuccessReponse(response);
      return response.data;
    } catch (error) {
      alertErrorResponse(error);
    }
  },

  async eliminarMesaItem(id) {
    try {
      const response = await axios.delete(`${API.node}/mesa-item/${id}`);
      return response.data;
    } catch (error) {
      alertErrorResponse(error);
    }
  },

  async editarMesaItem(id, data) {
    try {
      const response = await axios.patch(`${API.node}/mesa-item/${id}`, data);
      return response.data;
    } catch (error) {
      alertErrorResponse(error);
    }
  },

  async dividirMesa(datos) {
    try {
      const response = await axios.post(
        `${API.node}/mesa-item/dividir-mesa`,
        datos
      );
      alertSuccessReponse(response);
      return response.data;
    } catch (error) {
      alertErrorResponse(error);
    }
  },
};
