import {
    FETCH_LAPORAN_ABSENSI_SUCCESS,
    FETCH_LAPORAN_ABSENSI_FAILURE,
    CLEAR_LAPORAN_ABSENSI,
} from "../../action/reportAttendanceAction";

const initialState = {
    dataReportAttendance: [],
    error: null,
};

const reportAttendanceReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_LAPORAN_ABSENSI_SUCCESS:
            return {
                ...state,
                dataReportAttendance: action.payload,
                error: null,
            };
        case FETCH_LAPORAN_ABSENSI_FAILURE:
            return {
                ...state,
                dataReportAttendance: [],
                error: action.payload,
            };
        case CLEAR_LAPORAN_ABSENSI:
            return {
                ...state,
                dataReportAttendance: [],
                error: null,
            };
        default:
            return state;
    }
};

export default reportAttendanceReducer;
