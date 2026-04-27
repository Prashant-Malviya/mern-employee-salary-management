import {
    FETCH_SLIP_GAJI_SUCCESS,
    FETCH_SLIP_GAJI_FAILURE,
    CLEAR_SLIP_GAJI,
} from "../../action/slipSalaryAction";

const initialState = {
    dataSlipSalary: [],
    error: null,
};

const slipSalaryReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_SLIP_GAJI_SUCCESS:
            return {
                ...state,
                dataSlipSalary: action.payload,
                error: null,
            };
        case FETCH_SLIP_GAJI_FAILURE:
            return {
                ...state,
                dataSlipSalary: [],
                error: action.payload,
            };
        case CLEAR_SLIP_GAJI:
            return {
                ...state,
                dataSlipSalary: [],
                error: null,
            };
        default:
            return state;
    }
};

export default slipSalaryReducer;
