import {
    GET_DATA_GAJI_SUCCESS,
    GET_DATA_GAJI_FAILURE,
    DELETE_DATA_GAJI_SUCCESS,
    DELETE_DATA_GAJI_FAILURE
} from '../../action/dataSalaryAction/dataSalaryActionTypes';

const initialState = {
    dataSalary: [],
    message: null,
    error: null
};

const dataSalaryReducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_DATA_GAJI_SUCCESS:
            return {
                ...state,
                dataSalary: action.payload,
                message: null,
                error: null,
            };
        case GET_DATA_GAJI_FAILURE:
            return {
                ...state,
                error: action.payload,
                message: '',
            };
        case DELETE_DATA_GAJI_SUCCESS:
            return {
                ...state,
                message: action.payload,
                error: null,
            };
        case DELETE_DATA_GAJI_FAILURE:
            return {
                ...state,
                error: action.payload,
                message: null,
            };
        default:
            return state;
    }
};

export default dataSalaryReducer;
