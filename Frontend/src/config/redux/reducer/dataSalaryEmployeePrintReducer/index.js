import {
    GET_DATA_GAJI_SINGLE_PEGAWAI_SUCCESS,
    GET_DATA_GAJI_SINGLE_PEGAWAI_FAILURE,
} from "../../action/dataSalaryEmployeePrintAction/dataSalaryEmployeePrintActionTypes";

const initialState = {
    dataSalaryEmployeePrint: [], 
    error: null,
  };
  

const dataSalaryEmployeePrintReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DATA_GAJI_SINGLE_PEGAWAI_SUCCESS:
            return {
                ...state,
                dataSalaryEmployeePrint: action.payload,
                error: null,
            };
        case GET_DATA_GAJI_SINGLE_PEGAWAI_FAILURE:
            return {
                ...state,
                dataSalaryEmployeePrint: null,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default dataSalaryEmployeePrintReducer;
