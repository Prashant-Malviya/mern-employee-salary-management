import axios from 'axios';
import {
    GET_DATA_PEGAWAI_SUCCESS,
    GET_DATA_PEGAWAI_FAILURE,
    PEGAWAI_IMAGE_SUCCESS,
    PEGAWAI_IMAGE_FAILURE,
    GET_DATA_PEGAWAI_BY_ID_SUCCESS,
    GET_DATA_PEGAWAI_BY_ID_FAILURE,
    GET_DATA_PEGAWAI_BY_NIK_SUCCESS,
    GET_DATA_PEGAWAI_BY_NIK_FAILURE,
    GET_DATA_PEGAWAI_BY_NAME_SUCCESS,
    GET_DATA_PEGAWAI_BY_NAME_FAILURE,
    CREATE_DATA_PEGAWAI_REQUEST,
    CREATE_DATA_PEGAWAI_SUCCESS,
    CREATE_DATA_PEGAWAI_FAILURE,
    UPDATE_DATA_PEGAWAI_SUCCESS,
    UPDATE_DATA_PEGAWAI_FAILURE,
    DELETE_DATA_PEGAWAI_SUCCESS,
    DELETE_DATA_PEGAWAI_FAILURE
} from './dataEmployeeActionTypes';

const API_URL = 'http://127.0.0.1:5000';

export const getDataEmployee = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`${API_URL}/employeeData`, {
                withCredentials: true
            });
            dispatch({
                type: GET_DATA_PEGAWAI_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: GET_DATA_PEGAWAI_FAILURE,
                payload: error.message
            });
        }
    };
};

export const employeeImage = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`${API_URL}/images`);
            dispatch({
                type: PEGAWAI_IMAGE_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: PEGAWAI_IMAGE_FAILURE,
                payload: error.message
            });
        }
    };
};

export const getDataEmployeeById = (id) => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`${API_URL}/employeeData/id/${id}`, {
                withCredentials: true
            });
            dispatch({
                type: GET_DATA_PEGAWAI_BY_ID_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: GET_DATA_PEGAWAI_BY_ID_FAILURE,
                payload: error.message
            });
        }
    };
};

export const getDataEmployeeByNik = (nationalId) => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`${API_URL}/employeeData/nationalId/${nationalId}`, {
                withCredentials: true
            });
            dispatch({
                type: GET_DATA_PEGAWAI_BY_NIK_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: GET_DATA_PEGAWAI_BY_NIK_FAILURE,
                payload: error.message
            });
        }
    };
};

export const getDataEmployeeByName = (employeeName) => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`${API_URL}/employeeData/name/${employeeName}`, {
                withCredentials: true
            });
            dispatch({
                type: GET_DATA_PEGAWAI_BY_NAME_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: GET_DATA_PEGAWAI_BY_NAME_FAILURE,
                payload: error.message
            });
        }
    };
};

export const createDataEmployee = (formData, navigate) => {
    return async (dispatch) => {
        dispatch({ type: CREATE_DATA_PEGAWAI_REQUEST });

        try {
            const response = await axios.post(`${API_URL}/employeeData`, formData, {
                headers: {
                    "Content-type": "multipart/form-data"
                },
                withCredentials: true
            });
            dispatch({
                type: CREATE_DATA_PEGAWAI_SUCCESS,
                payload: response.data
            });
            navigate("/data-employee");
            return response.data;
        } catch (error) {
            dispatch({
                type: CREATE_DATA_PEGAWAI_FAILURE,
                payload: error.message
            });
            throw error;
        }
    };
};

export const updateDataEmployee = (id, data) => {
    return async (dispatch) => {
        try {
            const response = await axios.patch(`${API_URL}/employeeData/${id}`, data, {
                withCredentials: true
            });
            dispatch({
                type: UPDATE_DATA_PEGAWAI_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: UPDATE_DATA_PEGAWAI_FAILURE,
                payload: error.message
            });
        }
    };
};

export const deleteDataEmployee = (id) => {
    return async (dispatch) => {
        try {
            const response = await axios.delete(`${API_URL}/employeeData/${id}`, {
                withCredentials: true
            });
            dispatch({
                type: DELETE_DATA_PEGAWAI_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: DELETE_DATA_PEGAWAI_FAILURE,
                payload: error.message
            });
        }
    };
};
