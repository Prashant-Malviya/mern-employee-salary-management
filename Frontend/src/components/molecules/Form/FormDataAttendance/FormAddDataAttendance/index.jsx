import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import Layout from '../../../../../layout';
import Swal from 'sweetalert2';
import { Breadcrumb, ButtonOne, ButtonTwo } from '../../../../../components';
import { BiSearch } from 'react-icons/bi';
import { getMe } from '../../../../../config/redux/action';
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from 'react-icons/md';

const ITEMS_PER_PAGE = 4;

const FormAddDataAttendance = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [dataEmployee, setDataEmployee] = useState([]);
    const [dataAttendance, setDataAttendance] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState("");
    const { isError, user } = useSelector((state) => state.auth);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const totalPages = Math.ceil(dataEmployee.length / ITEMS_PER_PAGE);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const filteredDataEmployee = dataEmployee.filter((employee) =>
        employee.employeeName.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    const getDataEmployee = async () => {
        const response = await axios.get("http://127.0.0.1:5000/employeeData");
        setDataEmployee(response.data);
    };

    const getDataAttendance = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/data_attendance");
            setDataAttendance(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
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

    const [present, setPresent] = useState([]);
    const [sick, setSick] = useState([]);
    const [absent, setAbsent] = useState([]);

    const handlePresent = (index, value) => {
        const updatePresent = [...present];
        updatePresent[index] = value;
        setPresent(updatePresent);
    };

    const handleSick = (index, value) => {
        const updateSick = [...sick];
        updateSick[index] = value;
        setSick(updateSick);
    };

    const handleAbsent = (index, value) => {
        const updateAbsent = [...absent];
        updateAbsent[index] = value;
        setAbsent(updateAbsent);
    };

    const handleSearch = (e) => {
        setSearchKeyword(e.target.value);
    };

    const saveDataAttendance = async (e) => {
        e.preventDefault();

        try {
            for (let i = 0; i < dataEmployee.length; i++) {
                const isNamaAda = dataAttendance.some(
                    (attendance) => attendance.employeeName === dataEmployee[i].employeeName
                );

                if (!isNamaAda) {
                    await axios.post("http://127.0.0.1:5000/data_attendance", {
                        nationalId: dataEmployee[i].nationalId,
                        employeeName: dataEmployee[i].employeeName,
                        nama_position: dataEmployee[i].position,
                        gender: dataEmployee[i].gender,
                        present: present[i] || 0,
                        sick: sick[i] || 0,
                        absent: absent[i] || 0,
                    });
                    navigate("/data-attendance");
                    Swal.fire({
                        icon: 'success',
                        title: "Success",
                        text: "Data Success di Save",
                        showConfirmButton: false,
                        timer: 1500,
                    });
                }
            }
        } catch (error) {
            if (error.response) {
                Swal.fire({
                    title: "Error",
                    text: error.response.data.msg,
                    icon: "error",
                });
            }
        }
    };

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

    useEffect(() => {
        getDataEmployee();
        getDataAttendance();
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

    return (
        <Layout>
            <Breadcrumb pageName="Form Attendance Data Employee" />
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6">
                <form onSubmit={saveDataAttendance}>
                    <div className="flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between">
                        <div className="relative flex-2 mb-4 md:mb-0">
                            <input
                                type="text"
                                placeholder="Cari Employee Name..."
                                value={searchKeyword}
                                onChange={handleSearch}
                                className="rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary left-0"
                            />
                            <span className="absolute left-2 py-3 text-xl">
                                <BiSearch />
                            </span>
                        </div>
                    </div>
                    <div className="max-w-full overflow-x-auto py-4">
                        <table className="w-full table-auto">
                            <thead>
                                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                    <th className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                        No
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                                        National ID
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Employee Name
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Position
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Gender
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Present
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Sick
                                    </th>
                                    <th className="py-4 px-4 font-medium text-black dark:text-white">
                                        Absent
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDataEmployee.slice(startIndex, endIndex).map((data, index) => {
                                    const isNamaAda = dataAttendance.some(
                                        (attendance) => attendance.employeeName === data.employeeName
                                    );

                                    if (isNamaAda) {
                                        return <tr
                                            key={data.id}
                                            className="border-b border-[#eee] dark:border-strokedark"
                                        >
                                            <td className="py-5 px-4">
                                                <p className="text-center text-black dark:text-white">{startIndex + index + 1}</p>
                                            </td>
                                            <td className="py-5 px-4"
                                                colSpan="8">
                                                <p className="text-center text-black dark:text-white">Attendance Data Employee Sudah di Save. Input Back Ketika Sudah Ganti Periode !</p>
                                            </td>
                                        </tr>;
                                    }

                                    return (
                                        <tr
                                            key={data.id}
                                            className="border-b border-[#eee] dark:border-strokedark"
                                        >
                                            <td className="py-5 px-4">
                                                <p className="text-center text-black dark:text-white">{startIndex + index + 1}</p>
                                            </td>
                                            <td className="py-5 px-4">
                                                <p className="text-black dark:text-white">{data.nationalId}</p>
                                            </td>
                                            <td className="py-5 px-4">
                                                <p className="text-black dark:text-white">{data.employeeName}</p>
                                            </td>
                                            <td className="py-5 px-4">
                                                <p className="text-black dark:text-white">{data.position}</p>
                                            </td>
                                            <td className="py-5 px-4">
                                                <p className="text-black dark:text-white">{data.gender}</p>
                                            </td>
                                            <td className="py-5 px-4">
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    value={present[index] || ""}
                                                    onChange={(e) => handlePresent(index, e.target.value)}
                                                    className="form-input h-8 w-10 text-center border rounded-md disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                                                    min="0"
                                                    required
                                                />
                                            </td>
                                            <td className="py-5 px-4">
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    value={sick[index] || ""}
                                                    onChange={(e) => handleSick(index, e.target.value)}
                                                    className="form-input h-8 w-10 text-center border rounded-md disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                                                    min="0"
                                                    required
                                                />
                                            </td>
                                            <td className="py-5 px-4">
                                                <input
                                                    type="number"
                                                    placeholder="0"
                                                    value={absent[index] || ""}
                                                    onChange={(e) => handleAbsent(index, e.target.value)}
                                                    className="form-input h-8 w-10 text-center border rounded-md disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input"
                                                    min="0"
                                                    required
                                                />
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
                                Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredDataEmployee.length)} dari {filteredDataEmployee.length} Attendance Data Employee
                            </span>

                        </div>
                        <div className="flex space-x-2 py-4">
                            <button
                                disabled={currentPage === 1}
                                onClick={goToPrevPage}
                                className="py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                < MdKeyboardDoubleArrowLeft />
                            </button>
                            {paginationItems()}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={goToNextPage}
                                className="py-2 px-6 rounded-lg border border-primary text-primary font-semibold hover:bg-primary hover:text-white dark:text-white dark:border-primary dark:hover:bg-primary dark:hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                < MdKeyboardDoubleArrowRight />
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row w-full gap-3 text-center py-4">
                        <div>
                            <ButtonOne type="submit">
                                <span>Save</span>
                            </ButtonOne>
                        </div>
                        <Link to="/data-attendance">
                            <ButtonTwo>
                                <span>Back</span>
                            </ButtonTwo>
                        </Link>
                    </div>
                </form>
            </div>
        </Layout >
    );
};


export default FormAddDataAttendance;
