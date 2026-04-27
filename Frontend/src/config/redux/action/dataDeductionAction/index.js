import axios from 'axios';
import {
    GET_DATA_POTONGAN_SUCCESS,
    GET_DATA_POTONGAN_FAILURE,
    CREATE_DATA_POTONGAN_SUCCESS,
    CREATE_DATA_POTONGAN_FAILURE,
    UPDATE_DATA_POTONGAN_SUCCESS,
    UPDATE_DATA_POTONGAN_FAILURE,
    DELETE_DATA_POTONGAN_SUCCESS,
    DELETE_DATA_POTONGAN_FAILURE
} from './dataDeductionActionTypes';

const API_URL = 'http://127.0.0.1:5000';

export const getDataDeduction = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`${API_URL}/data_deduction`);
            dispatch({
                type: GET_DATA_POTONGAN_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: GET_DATA_POTONGAN_FAILURE,
                payload: error.message
            });
        }
    };
};

export const createDataDeduction = (formData, navigate) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(`${API_URL}/data_deduction`, formData, {
                headers: {
                    "Content-type": "multipart/form-data"
                }
            });
            dispatch({
                type: CREATE_DATA_POTONGAN_SUCCESS,
                payload: response.data
            });
            navigate("/data-deduction");
            return response.data;
        } catch (error) {
            dispatch({
                type: CREATE_DATA_POTONGAN_FAILURE,
                payload: error.message
            });
            throw error;
        }
    };
};

export const updateDataDeduction = (id, data) => {
    return async (dispatch) => {
        try {
            const response = await axios.put(`${API_URL}/data_deduction/${id}`, data);
            dispatch({
                type: UPDATE_DATA_POTONGAN_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: UPDATE_DATA_POTONGAN_FAILURE,
                payload: error.message
            });
        }
    };
};

export const deleteDataDeduction = (id) => {
    return async (dispatch) => {
        try {
            const response = await axios.delete(`${API_URL}/data_deduction/${id}`);
            dispatch({
                type: DELETE_DATA_POTONGAN_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: DELETE_DATA_POTONGAN_FAILURE,
                payload: error.message
            });
        }
    };
};
