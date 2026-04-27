import { useState, useEffect } from 'react';
import Layout from '../../../../layout';
import { Link, useNavigate } from 'react-router-dom';
import { Breadcrumb, ButtonOne } from '../../../../components';
import { FaRegEdit, FaPlus, FaDownload } from 'react-icons/fa';
import { BsTrash3 } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { deleteDataEmployee, getDataEmployee, getMe } from '../../../../config/redux/action';
import { BiSearch } from 'react-icons/bi';
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight, MdOutlineKeyboardArrowDown } from 'react-icons/md';
import axios from 'axios';

const ITEMS_PER_PAGE = 4;

const DataEmployee = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchKeyword, setSearchKeyword] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [positions, setPositions] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError, user } = useSelector((state) => state.auth);
    const { dataEmployee } = useSelector((state) => state.dataEmployee);

    const totalPages = Math.ceil(dataEmployee.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const filteredDataEmployee = dataEmployee.filter((employee) => {
        const { employeeName, status } = employee;
        const keyword = searchKeyword.toLowerCase();
        const statusKeyword = filterStatus.toLowerCase();
        return (
            employeeName.toLowerCase().includes(keyword) &&
            (filterStatus === '' || status.toLowerCase() === statusKeyword)
        );
    });

    const salaryByDepartment = positions.reduce((accumulator, position) => {
        const name = position.nama_position || position.positionName;
        const salary = position.salary_pokok || position.baseSalary || '';

        if (name) {
            accumulator[name] = salary;
        }

        return accumulator;
    }, {});

    const escapeCsvValue = (value) => {
        const stringValue = String(value ?? '');

        if (/[",\n]/.test(stringValue)) {
            return `"${stringValue.replace(/"/g, '""')}"`;
        }

        return stringValue;
    };

    const downloadCsv = () => {
        const headers = ['Name', 'Designation', 'Department', 'Salary'];
        const rows = filteredDataEmployee.map((employee) => {
            const department = employee.position || employee.position || '';
            const salary = salaryByDepartment[department] || '';

            return [
                employee.employeeName || employee.employeeName || '',
                employee.designation || 'Helper',
                department,
                salary,
            ];
        });

        const csv = [headers, ...rows]
            .map((row) => row.map(escapeCsvValue).join(','))
            .join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.setAttribute('download', 'employee-list.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handleSearch = (event) => {
        setSearchKeyword(event.target.value);
    };

    const handleFilterStatus = (event) => {
        setFilterStatus(event.target.value);
    };

    const onDeleteEmployee = (id) => {
        Swal.fire({
            title: 'Konfirmasi',
            text: 'Apakah Anda yakin ingin Menghapus?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Tidak',
            reverseButtons: true,
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteDataEmployee(id)).then(() => {
                    Swal.fire({
                        title: 'Success',
                        text: 'Data employee berhasil dihapus.',
                        icon: 'success',
                        timer: 1000,
                        timerProgressBar: true,
                        showConfirmButton: false,
                    });
                    dispatch(getDataEmployee());
                });
            }
        });
    };

    useEffect(() => {
        dispatch(getDataEmployee(startIndex, endIndex));
    }, [dispatch, startIndex, endIndex]);

    useEffect(() => {
        const fetchPositions = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:5000/data_position', {
                    withCredentials: true,
                });
                setPositions(response.data);
            } catch (error) {
                setPositions([]);
            }
        };

        fetchPositions();
    }, []);

    useEffect(() => {
        dispatch(getMe());
    }, [dispatch]);

    useEffect(() => {
        if (isError) {
            navigate('/login');
        }
        if (user && user.role !== 'admin') {
            navigate('/dashboard');
        }
    }, [isError, user, navigate]);

    const paginationItems = () => {
        const items = [];
        const maxVisiblePages = 5;

        const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        for (let page = startPage; page <= endPage; page++) {
            items.push(
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`py-2 px-4 border border-gray-2 text-black font-semibold dark:text-white dark:border-strokedark ${currentPage === page ? 'bg-primary text-white hover:bg-primary dark:bg-primary dark:hover:bg-primary' : 'hover:bg-gray-2 dark:hover:bg-stroke'
                        } rounded-lg`}
                >
                    {page}
                </button>
            );
        }

        if (startPage > 2) {
            items.unshift(
                <p
                    key="start-ellipsis"
                    className="py-2 px-4 border border-gray-2 dark:bg-transparent text-black font-medium bg-gray dark:border-strokedark dark:text-white"
                >
                    ...
                </p>
            );
        }

        if (endPage < totalPages - 1) {
            items.push(
                <p
                    key="end-ellipsis"
                    className="py-2 px-4 border border-gray-2 dark:bg-transparent text-black font-medium bg-gray dark:border-strokedark dark:text-white"
                >
                    ...
                </p>
            );
        }

        return items;
    };

    return (
        <Layout>
            <Breadcrumb pageName="Employee Data" />
            <div className="flex flex-col gap-3 sm:flex-row">
                <Link to="/data-employee/form-data-employee/add">
                    <ButtonOne>
                        <span>Add Employee</span>
                        <span>
                            <FaPlus />
                        </span>
                    </ButtonOne>
                </Link>
                <button
                    type="button"
                    onClick={downloadCsv}
                    className="inline-flex items-center justify-center gap-2 rounded bg-primary py-3 px-5 font-medium text-white transition hover:bg-opacity-90"
                >
                    <span>Download CSV</span>
                    <FaDownload />
                </button>
            </div>
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6">
                <div className="flex justify-between items-stretch mt-4 flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="relative flex-1 md:mr-2">
                        <div className="relative">
                            <span className="absolute top-1/2 right-4 z-30 -translate-y-1/2 text-xl">
                                <MdOutlineKeyboardArrowDown />
                            </span>
                            <select
                                value={filterStatus}
                                onChange={handleFilterStatus}
                                className="relative w-full appearance-none rounded border border-stroke bg-transparent py-3 px-8 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input md:w-auto"
                            >
                                <option value="">Status</option>
                                <option value="Employee Tetap">Permanent Employee</option>
                                <option value="Employee Tidak Tetap">Contract Employee</option>
                            </select>
                        </div>
                    </div>
                    <div className="relative flex-2 mb-4 md:mb-0">
                        <input
                            type="text"
                            placeholder="Cari Employee Name..."
                            value={searchKeyword}
                            onChange={handleSearch}
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary left-0"
                        />
                        <span className="absolute left-2 py-3 text-xl">
                            <BiSearch />
                        </span>
                    </div>
                </div>

                <div className="-mx-5 max-w-[calc(100%+2.5rem)] overflow-x-auto py-4 px-5 sm:mx-0 sm:max-w-full sm:px-0">
                    <table className="min-w-[1120px] w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4 whitespace-nowrap">
                                <th className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">No</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">Photo</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">National ID</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Employee Name</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Designation</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Gender</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Join Date</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Status</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Role</th>
                                <th className="py-4 px-4 font-medium text-black dark:text-white">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDataEmployee.slice(startIndex, endIndex).map((data, index) => {
                                return (
                                    <tr key={data.id}>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white text-center">{startIndex + index + 1}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 pl-9 dark:border-strokedark">
                                            <div className="h-12.5 w-15">
                                                <div className="rounded-full overflow-hidden">
                                                    <img src={`http://127.0.0.1:5000/images/${data.photo}`} alt="Photo Profil" />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white text-center">{data.nationalId}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{data.employeeName}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{data.designation || 'Helper'}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{data.gender}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{data.joinDate}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{data.status}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <p className="text-black dark:text-white">{data.role}</p>
                                        </td>
                                        <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                                            <div className="flex items-center space-x-3.5">
                                                <Link
                                                    to={`/data-employee/form-data-employee/edit/${data.id}`}
                                                    className="hover:text-black">
                                                    <FaRegEdit className="text-primary text-xl hover:text-black dark:hover:text-white" />
                                                </Link>
                                                <button
                                                    onClick={() => onDeleteEmployee(data.id)}
                                                    className="hover:text-black">
                                                    <BsTrash3 className="text-danger text-xl hover:text-black dark:hover:text-white" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-5 dark:text-gray-4 text-sm py-4">
                            Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredDataEmployee.length)} dari {filteredDataEmployee.length} Employee Data
                        </span>
                    </div>
                    <div className="flex space-x-2 py-4">
                        <button
                            disabled={currentPage === 1}
                            onClick={goToPrevPage}
                            className="py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50"
                        >
                            < MdKeyboardDoubleArrowLeft />
                        </button>
                        {paginationItems()}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={goToNextPage}
                            className="py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50"
                        >
                            < MdKeyboardDoubleArrowRight />
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DataEmployee;
