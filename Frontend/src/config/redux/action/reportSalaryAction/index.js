import axios from "axios";

export const FETCH_LAPORAN_GAJI_SUCCESS = "FETCH_LAPORAN_GAJI_SUCCESS";
export const FETCH_LAPORAN_GAJI_FAILURE = "FETCH_LAPORAN_GAJI_FAILURE";
export const CLEAR_LAPORAN_GAJI = "CLEAR_LAPORAN_GAJI";

export const fetchReportSalarySuccess = (data) => ({
    type: FETCH_LAPORAN_GAJI_SUCCESS,
    payload: data,
});

export const fetchReportSalaryFailure = (error) => ({
    type: FETCH_LAPORAN_GAJI_FAILURE,
    payload: error,
});

export const clearReportSalary = () => ({
    type: CLEAR_LAPORAN_GAJI,
});

export const fetchReportSalaryByYear = (selectedYear, onDataFound) => async (dispatch) => {
    try {
        const response = await axios.get(
            `http://127.0.0.1:5000/report/salary/year/${selectedYear}`
        );
        const data = response.data;
        dispatch(fetchReportSalarySuccess(data));
        onDataFound();
    } catch (error) {
        if (error.response && error.response.data) {
            dispatch(fetchReportSalaryFailure("An error occurred while loading data."));
        }
    }
};

export const fetchReportSalaryByMonth = (selectedMonth, onDataFound) => async (dispatch) => {
    try {
        const response = await axios.get(
            `http://127.0.0.1:5000/report/salary/month/${selectedMonth}`
        );
        const data = response.data;
        dispatch(fetchReportSalarySuccess(data));
        onDataFound();
    } catch (error) {
        if (error.response && error.response.data) {
            dispatch(fetchReportSalaryFailure("An error occurred while loading data."));
        }
    }
};
