import axios from 'axios';
import {
    GET_DATA_GAJI_SUCCESS,
    GET_DATA_GAJI_FAILURE,
    DELETE_DATA_GAJI_SUCCESS,
    DELETE_DATA_GAJI_FAILURE
} from './dataSalaryActionTypes';

const API_URL = 'http://127.0.0.1:5000';

export const getDataSalary = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get(`${API_URL}/data_salary_employee`);
            dispatch({
                type: GET_DATA_GAJI_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: GET_DATA_GAJI_FAILURE,
                payload: error.message
            });
        }
    };
};

export const deleteDataSalary = (id) => {
    return async (dispatch) => {
        try {
            const response = await axios.delete(`${API_URL}/data_salary_employee/id/${id}`);
            dispatch({
                type: DELETE_DATA_GAJI_SUCCESS,
                payload: response.data
            });
        } catch (error) {
            dispatch({
                type: DELETE_DATA_GAJI_FAILURE,
                payload: error.message
            });
        }
    };
};
