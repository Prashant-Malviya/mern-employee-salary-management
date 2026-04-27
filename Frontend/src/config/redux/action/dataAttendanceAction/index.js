import axios from 'axios';
import {
    GET_DATA_KEHADIRAN_SUCCESS,
    GET_DATA_KEHADIRAN_FAILURE,
    CREATE_DATA_KEHADIRAN_SUCCESS,
    CREATE_DATA_KEHADIRAN_FAILURE,
    UPDATE_DATA_KEHADIRAN_SUCCESS,
    UPDATE_DATA_KEHADIRAN_FAILURE,
    DELETE_DATA_KEHADIRAN_SUCCESS,
    DELETE_DATA_KEHADIRAN_FAILURE
} from './dataAttendanceActionTypes';

export const getDataAttendance = () => {
    return async (dispatch) => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/data_attendance');
            const dataAttendance = response.data;
            dispatch({
                type: GET_DATA_KEHADIRAN_SUCCESS,
                payload: dataAttendance
            });
        } catch (error) {
            dispatch({
                type: GET_DATA_KEHADIRAN_FAILURE,
                payload: error.message
            });
        }
    };
};

export const createDataAttendance = (dataEmployee, dataAttendance, navigate) => async (dispatch) => {
    try {
        for (let i = 0; i < dataEmployee.length; i++) {
            const isNamaAda = dataAttendance.some(
                (attendance) => attendance.employeeName === dataEmployee[i].employeeName
            );

            if (!isNamaAda) {
                const response = await axios.post("http://127.0.0.1:5000/data_attendance", {
                    nationalId: dataEmployee[i].nationalId,
                    employeeName: dataEmployee[i].employeeName,
                    nama_position: dataEmployee[i].position,
                    gender: dataEmployee[i].gender,
                    present: present[i] || 0,
                    sick: sick[i] || 0,
                    absent: absent[i] || 0,
                });

                dispatch({
                    type: CREATE_DATA_KEHADIRAN_SUCCESS,
                    payload: response.data,
                });

                navigate("/data-attendance");
                return response.data;
            }
        }
    } catch (error) {
        dispatch({
            type: CREATE_DATA_KEHADIRAN_FAILURE,
            payload: error.message,
        });
        throw error;
    }
};

export const updateDataAttendance = (id, dataAttendance) => {
    return async (dispatch) => {
        try {
            const response = await axios.put(`http://127.0.0.1:5000/data_attendance/${id}`, dataAttendance);
            if (response.status === 200) {
                dispatch({
                    type: UPDATE_DATA_KEHADIRAN_SUCCESS,
                    payload: 'Data attendance berhasil diupdate'
                });
                dispatch(getDataAttendance());
            } else {
                dispatch({
                    type: UPDATE_DATA_KEHADIRAN_FAILURE,
                    payload: response.data.message
                });
            }
        } catch (error) {
            dispatch({
                type: UPDATE_DATA_KEHADIRAN_FAILURE,
                payload: error.message
            });
        }
    };
};

export const deleteDataAttendance = (id) => {
    return async (dispatch) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:5000/data_attendance/${id}`);
            if (response.status === 200) {
                dispatch({
                    type: DELETE_DATA_KEHADIRAN_SUCCESS,
                    payload: 'Delete data berhasil'
                });
                dispatch(getDataAttendance());
            } else {
                dispatch({
                    type: DELETE_DATA_KEHADIRAN_FAILURE,
                    payload: response.data.message
                });
            }
        } catch (error) {
            dispatch({
                type: DELETE_DATA_KEHADIRAN_FAILURE,
                payload: error.message
            });
        }
    };
};
