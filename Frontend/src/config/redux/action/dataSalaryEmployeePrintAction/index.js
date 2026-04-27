import axios from "axios";
import {
    GET_DATA_GAJI_SINGLE_PEGAWAI_SUCCESS,
    GET_DATA_GAJI_SINGLE_PEGAWAI_FAILURE,
} from "./dataSalaryEmployeePrintActionTypes";

export const viewDataSalarySingleEmployeeSuccess = (data) => ({
    type: GET_DATA_GAJI_SINGLE_PEGAWAI_SUCCESS,
    payload: data,
});

export const viewDataSalarySingleEmployeeFailure = (error) => ({
    type: GET_DATA_GAJI_SINGLE_PEGAWAI_FAILURE,
    payload: error,
});

export const viewSalarySingleEmployeeByYear = (dataYear) => async (dispatch) => {
    try {
        const response = await axios.get(
            `http://127.0.0.1:5000/data_salary/month/${dataYear}`
        );
        const data = response.data;
        dispatch(viewDataSalarySingleEmployeeSuccess(data));
    } catch (error) {
        if (error.response && error.response.data) {
            dispatch(viewDataSalarySingleEmployeeFailure("An error occurred while loading data."));
        }
    }
};

export const viewSalarySingleEmployeeByMonth = (dataMonth) => async (dispatch) => {
    try {
        const response = await axios.get(
            `http://127.0.0.1:5000/data_salary/month/${dataMonth}`
        );
        const data = response.data;
        dispatch(viewDataSalarySingleEmployeeSuccess(data));
    } catch (error) {
        if (error.response && error.response.data) {
            dispatch(viewDataSalarySingleEmployeeFailure("An error occurred while loading data."));
        }
    }
};

export const viewSalarySingleEmployeeByName = (employeeName) => async (dispatch) => {
    try {
        const response = await axios.get(
            `http://127.0.0.1:5000/data_salary/name/${employeeName}`
        );
        const data = response.data;
        dispatch(viewDataSalarySingleEmployeeSuccess(data));
    } catch (error) {
        console.log(error);
        if (employeeName) {
            dispatch(viewDataSalarySingleEmployeeFailure("An error occurred while loading data."));
        }
    }
};
