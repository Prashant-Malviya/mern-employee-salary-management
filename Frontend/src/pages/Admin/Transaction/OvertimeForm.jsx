import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdSave } from 'react-icons/md';
import Layout from '../../../layout';
import { Breadcrumb, ButtonOne } from '../../../components';
import { getMe } from '../../../config/redux/action';

const API_URL = 'http://127.0.0.1:5000';

const initialForm = {
    employee_id: '',
    date: '',
    hours: '',
    reason: ''
};

const parseDate = (value) => {
    if (!value) return null;
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
};

const getEmployeeId = (employee) => employee.employeeId || employee.employeeId || '';
const getEmployeeName = (employee) => employee.employeeName || employee.employeeName || 'Unknown Employee';
const getEmployeePosition = (employee) => employee.position || employee.position || '';
const getEmployeeNationalId = (employee) => employee.nationalId || employee.nationalId || '';

const formatDate = (value) => {
    if (!value) return '-';
    return new Date(value).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

const statusClass = {
    pending: 'bg-warning/10 text-warning',
    approved: 'bg-success/10 text-success',
    rejected: 'bg-danger/10 text-danger'
};

const OvertimeForm = () => {
    const [formData, setFormData] = useState(initialForm);
    const [employees, setEmployees] = useState([]);
    const [overtimeEntries, setOvertimeEntries] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const { isError, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const validateForm = () => {
        const { employee_id, date, hours, reason } = formData;

        if (!employee_id || !date || !hours || !reason.trim()) {
            return 'All fields are required';
        }

        const overtimeHours = Number(hours);
        if (!Number.isInteger(overtimeHours) || overtimeHours < 1 || overtimeHours > 6) {
            return 'Overtime must be between 1-6 hours';
        }

        const selectedDate = parseDate(date);
        if (!selectedDate) {
            return 'Invalid overtime date';
        }

        const today = new Date();
        today.setHours(23, 59, 59, 999);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setHours(0, 0, 0, 0);
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        if (selectedDate > today) {
            return 'Overtime date cannot be in the future';
        }

        if (selectedDate < sevenDaysAgo) {
            return 'Overtime date cannot be older than 7 days';
        }

        if (reason.trim().length < 10) {
            return 'Reason must be at least 10 characters';
        }

        return '';
    };

    const fetchEmployees = async () => {
        const response = await axios.get(`${API_URL}/employeeData`, {
            withCredentials: true
        });
        setEmployees(response.data);
    };

    const fetchOvertime = async () => {
        const response = await axios.get(`${API_URL}/overtime`, {
            withCredentials: true
        });
        setOvertimeEntries(response.data);
    };

    const loadPageData = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchEmployees(), fetchOvertime()]);
        } catch (err) {
            setError(err.response?.data?.msg || 'Failed to load overtime data');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((current) => ({
            ...current,
            [name]: value
        }));
        setError('');
        setMessage('');
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationMessage = validateForm();

        if (validationMessage) {
            setError(validationMessage);
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: validationMessage
            });
            return;
        }

        setSubmitting(true);
        setError('');
        setMessage('');

        try {
            const response = await axios.post(`${API_URL}/overtime`, {
                ...formData,
                hours: Number(formData.hours),
                reason: formData.reason.trim()
            }, {
                withCredentials: true
            });

            setMessage(response.data.msg || 'Overtime created successfully');
            setFormData(initialForm);
            await fetchOvertime();
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Overtime berhasil disimpan',
                showConfirmButton: false,
                timer: 1500
            });
        } catch (err) {
            const backendMessage = err.response?.data?.msg || 'Failed to create overtime';
            setError(backendMessage);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: backendMessage
            });
        } finally {
            setSubmitting(false);
        }
    };

    const updateStatus = async (id, status) => {
        try {
            await axios.patch(`${API_URL}/overtime/${id}/status`, {
                status
            }, {
                withCredentials: true
            });
            await fetchOvertime();
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Status overtime berhasil diperbarui',
                showConfirmButton: false,
                timer: 1200
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.response?.data?.msg || 'Failed to update overtime status'
            });
        }
    };

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        loadPageData();
    }, []);

    useEffect(() => {
        const userRole = user?.role || user?.role;
        if (isError) {
            navigate('/login');
        }
        if (user && userRole !== 'admin') {
            navigate('/dashboard');
        }
    }, [isError, user, navigate]);

    return (
        <Layout>
            <Breadcrumb pageName="Overtime Entry" />

            <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div className="xl:col-span-1 rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
                    <div className="border-b border-stroke pb-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Input Overtime
                        </h3>
                    </div>

                    {(message || error) && (
                        <div className={`mt-4 rounded-md px-4 py-3 text-sm ${error ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                            {error || message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="mt-5 space-y-5">
                        <div>
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Employee
                            </label>
                            <select
                                name="employee_id"
                                value={formData.employee_id}
                                onChange={handleChange}
                                className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                            >
                                <option value="">Select Employee</option>
                                {employees.map((employee) => {
                                    const employeeId = getEmployeeId(employee);
                                    return (
                                        <option key={employee.id || employeeId} value={employeeId}>
                                            {getEmployeeName(employee)} {getEmployeePosition(employee) ? `- ${getEmployeePosition(employee)}` : ''}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                        <div>
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                            />
                        </div>

                        <div>
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Hours
                            </label>
                            <input
                                type="number"
                                name="hours"
                                min="1"
                                max="6"
                                value={formData.hours}
                                onChange={handleChange}
                                className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                            />
                        </div>

                        <div>
                            <label className="mb-2.5 block font-medium text-black dark:text-white">
                                Reason
                            </label>
                            <textarea
                                name="reason"
                                rows="4"
                                value={formData.reason}
                                onChange={handleChange}
                                className="w-full rounded border border-stroke bg-transparent py-3 px-4 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input"
                            />
                        </div>

                        <ButtonOne className={submitting ? 'cursor-not-allowed opacity-70' : ''}>
                            <MdSave />
                            {submitting ? 'Saving...' : 'Save Overtime'}
                        </ButtonOne>
                    </form>
                </div>

                <div className="xl:col-span-2 rounded-sm border border-stroke bg-white px-5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
                    <div className="flex items-center justify-between border-b border-stroke pb-4 dark:border-strokedark">
                        <h3 className="font-medium text-black dark:text-white">
                            Overtime List
                        </h3>
                        {loading && (
                            <span className="text-sm text-gray-5 dark:text-gray-4">
                                Loading...
                            </span>
                        )}
                    </div>

                    <div className="max-w-full overflow-x-auto py-4">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Employee</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Date</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Hours</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {overtimeEntries.length === 0 && (
                                    <tr>
                                        <td colSpan="5" className="py-6 px-4 text-center text-black dark:text-white">
                                            No overtime entries found
                                        </td>
                                    </tr>
                                )}

                                {overtimeEntries.map((entry) => (
                                    <tr key={entry.id} className="border-b border-[#eee] dark:border-strokedark">
                                        <td className="py-5 px-4">
                                            <p className="font-medium text-black dark:text-white">
                                                {entry.employee?.employeeName || entry.employee?.employeeName || entry.employee_id}
                                            </p>
                                            <p className="text-sm text-gray-5 dark:text-gray-4">
                                                {entry.employee?.nationalId || entry.employee?.nationalId || getEmployeeNationalId(entry.employee || {})}
                                            </p>
                                        </td>
                                        <td className="py-5 px-4 text-black dark:text-white">
                                            {formatDate(entry.date)}
                                        </td>
                                        <td className="py-5 px-4 text-black dark:text-white">
                                            {entry.hours}
                                        </td>
                                        <td className="py-5 px-4">
                                            <span className={`rounded-full px-3 py-1 text-sm font-medium ${statusClass[entry.status] || statusClass.pending}`}>
                                                {entry.status}
                                            </span>
                                        </td>
                                        <td className="py-5 px-4">
                                            <div className="flex flex-wrap gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() => updateStatus(entry.id, 'approved')}
                                                    disabled={entry.status === 'approved'}
                                                    className="rounded border border-success px-3 py-1 text-sm font-medium text-success hover:bg-success hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => updateStatus(entry.id, 'rejected')}
                                                    disabled={entry.status === 'rejected'}
                                                    className="rounded border border-danger px-3 py-1 text-sm font-medium text-danger hover:bg-danger hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default OvertimeForm;
