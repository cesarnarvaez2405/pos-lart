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

let response = [];

export default {
  async getCajas() {
    try {
      const responses = await axios.get(`${API.node}/caja`);
      return responses.data;
    } catch (error) {
      alertErrorResponse(error);
    }
  },

  async getCajaQuery(query) {
    try {
      const url = `${API.node}/caja/buscar-filter`;
      if (query) {
        const queryString = new URLSearchParams(query).toString();
        const fullUrl = `${url}?${queryString}`;
        response = await axios.get(fullUrl);
      } else {
        response = await axios.get(`${API.node}/caja`);
      }
      return response.data;
    } catch (error) {
      alertErrorResponse(error);
    }
  },
};
