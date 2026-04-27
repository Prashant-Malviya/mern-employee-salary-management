import axios from 'axios';
import {
    GET_DATA_JABATAN_SUCCESS,
    GET_DATA_JABATAN_FAILURE,
    CREATE_DATA_JABATAN_SUCCESS,
    CREATE_DATA_JABATAN_FAILURE,
    UPDATE_DATA_JABATAN_SUCCESS,
    UPDATE_DATA_JABATAN_FAILURE,
    DELETE_DATA_JABATAN_SUCCESS,
    DELETE_DATA_JABATAN_FAILURE
} from './dataPositionActionTypes';

const API_URL = 'http://127.0.0.1:5000';

export const getDataPosition = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`${API_URL}/data_position`);
            dispatch({
                type: GET_DATA_JABATAN_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: GET_DATA_JABATAN_FAILURE,
                payload: error.message
            });
        }
    };
};

export const createDataPosition = (formData, navigate) => {
    return async (dispatch) => {
        try {
            const response = await axios.post(`${API_URL}/data_position`, formData, {
                headers: {
                    "Content-type": "multipart/form-data"
                }
            });
            dispatch({
                type: CREATE_DATA_JABATAN_SUCCESS,
                payload: response.data
            });
            navigate("/data-position");
            return response.data;
        } catch (error) {
            dispatch({
                type: CREATE_DATA_JABATAN_FAILURE,
                payload: error.message
            });
            throw error;
        }
    };
};

export const updateDataPosition = (id, data) => {
    return async (dispatch) => {
        try {
            const response = await axios.put(`${API_URL}/data_position/${id}`, data);
            dispatch({
                type: UPDATE_DATA_JABATAN_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: UPDATE_DATA_JABATAN_FAILURE,
                payload: error.message
            });
        }
    };
};

export const deleteDataPosition = (id) => {
    return async (dispatch) => {
        try {
            const response = await axios.delete(`${API_URL}/data_position/${id}`);
            dispatch({
                type: DELETE_DATA_JABATAN_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: DELETE_DATA_JABATAN_FAILURE,
                payload: error.message
            });
        }
    };
};
