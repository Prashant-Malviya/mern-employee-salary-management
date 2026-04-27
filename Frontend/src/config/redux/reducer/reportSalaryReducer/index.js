import {
    FETCH_LAPORAN_GAJI_SUCCESS,
    FETCH_LAPORAN_GAJI_FAILURE,
    CLEAR_LAPORAN_GAJI,
} from "../../action/reportSalaryAction";

const initialState = {
    dataReportSalary: [],
    error: null,
};

const reportSalaryReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_LAPORAN_GAJI_SUCCESS:
            return {
                ...state,
                dataReportSalary: action.payload,
                error: null,
            };
        case FETCH_LAPORAN_GAJI_FAILURE:
            return {
                ...state,
                dataReportSalary: [],
                error: action.payload,
            };
        case CLEAR_LAPORAN_GAJI:
            return {
                ...state,
                dataReportSalary: [],
                error: null,
            };
        default:
            return state;
    }
};

export default reportSalaryReducer;
