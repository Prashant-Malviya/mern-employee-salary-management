import { useState, useEffect } from 'react';
import Layout from '../../../../layout';
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { Breadcrumb, ButtonOne } from '../../../../components';
import { FaRegEye } from 'react-icons/fa'
import { BiSearch } from 'react-icons/bi'
import Swal from 'sweetalert2';
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight, MdOutlineKeyboardArrowDown } from 'react-icons/md'
import { TfiPrinter } from 'react-icons/tfi'
import { fetchReportSalaryByMonth, fetchReportSalaryByYear, getDataSalary, getMe } from '../../../../config/redux/action';

const ITEMS_PER_PAGE = 4;

const DataSalary = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filterYear, setFilterYear] = useState("");
    const [filterMonth, setFilterMonth] = useState("");
    const [filterNama, setFilterNama] = useState("");
    const [showMessage, setShowMessage] = useState(false);

    const { dataSalary } = useSelector((state) => state.dataSalary);
    const { isError, user } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const totalPages = Math.ceil(dataSalary.length / ITEMS_PER_PAGE);

    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    const filteredDataSalary = dataSalary.filter((salaryDataEmployee) => {
        const isMatchMonth =
            filterMonth === "" ||
            (typeof salaryDataEmployee.month === 'string' &&
                salaryDataEmployee.month.toLowerCase().includes(filterMonth.toLowerCase()));
        const isMatchYear =
            filterYear === "" || salaryDataEmployee.tahun.toString() === filterYear;
        const isMatchNama =
            filterNama === "" ||
            (typeof salaryDataEmployee.employeeName === 'string' &&
                salaryDataEmployee.employeeName.toLowerCase().includes(filterNama.toLowerCase()));
        return isMatchMonth && isMatchYear && isMatchNama;
    });

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

    const handleMonthChange = (event) => {
        setFilterMonth(event.target.value);
    };

    const handleYearChange = (event) => {
        setFilterYear(event.target.value);
    };

    const handleNamaChange = (event) => {
        setFilterNama(event.target.value);
    };

    const handleSearch = async (event) => {
        event.preventDefault();

        const selectedMonth = filterMonth;
        const selectedYear = filterYear;

        let yearDataFound = false;
        let monthDataFound = false;

        await Promise.all([
            dispatch(fetchReportSalaryByYear(selectedYear, () => (yearDataFound = true))),
            dispatch(fetchReportSalaryByMonth(selectedMonth, () => (monthDataFound = true))),
        ]);
        setShowMessage(true);

        if (yearDataFound && monthDataFound) {
            setShowMessage(false);
            navigate(
                `/report/salary/print-page?month=${selectedMonth}&year=${selectedYear}`
            );
        } else {
            setShowMessage(false);
            Swal.fire({
                icon: 'error',
                title: 'Data not found',
                text: 'Sorry, the data you are looking for was not found',
                timer: 2000,
            });
        }
    };

    useEffect(() => {
        dispatch(getDataSalary(startIndex, endIndex));
    }, [dispatch, startIndex, endIndex]);

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
            <Breadcrumb pageName='Data Salary Employee' />

            <div className='rounded-sm border border-stroke bg-white px-5 pt-2 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-10 mt-6'>
                <div className='border-b border-stroke py-2 dark:border-strokedark'>
                    <h3 className='font-medium text-black dark:text-white'>
                        Filter Data Salary Employee
                    </h3>
                </div>
                <form onSubmit={handleSearch}>
                    {showMessage && (
                        <p className="text-meta-1">Data not found</p>
                    )}
                    <div className='flex flex-col md:flex-row md:justify-between items-center mt-4'>
                        <div className='relative w-full md:w-1/2 md:mr-2 mb-4 md:mb-0'>
                            <div className='relative'>
                                <span className='px-6'>Month</span>
                                <span className='absolute top-1/2 left-70 z-30 -translate-y-1/2 text-xl'>
                                    <MdOutlineKeyboardArrowDown />
                                </span>
                                <select
                                    value={filterMonth}
                                    onChange={handleMonthChange}
                                    required
                                    className='relative appearance-none rounded border border-stroke bg-transparent py-2 px-18 outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input'
                                >
                                    <option value=''>Pilih Month</option>
                                    <option value='Januari'>Januari</option>
                                    <option value='Februari'>Februari</option>
                                    <option value='Maret'>Maret</option>
                                    <option value='April'>April</option>
                                    <option value='Mei'>Mei</option>
                                    <option value='Juni'>Juni</option>
                                    <option value='Juli'>Juli</option>
                                    <option value='Agustus'>Agustus</option>
                                    <option value='September'>September</option>
                                    <option value='Oktober'>Oktober</option>
                                    <option value='November'>November</option>
                                    <option value='Desember'>Desember</option>
                                </select>
                            </div>
                        </div>
                        <div className='relative w-full md:w-1/2 md:mr-2 mb-4 md:mb-0'>
                            <div className='relative'>
                                <span className='px-6'>Year</span>
                                <input
                                    type='number'
                                    placeholder='Loginkan Year...'
                                    value={filterYear}
                                    onChange={handleYearChange}
                                    required
                                    className='rounded border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary left-0'
                                />
                                <span className='absolute left-25 py-3 text-xl '>
                                    <BiSearch />
                                </span>
                            </div>
                        </div>
                        <div className='w-full md:w-1/2 flex justify-center md:justify-end'>
                            <div className='w-full md:w-auto'>
                                <ButtonOne type='submit'>
                                    <span>Print Daftar Salary</span>
                                    <span>
                                        <TfiPrinter />
                                    </span>
                                </ButtonOne>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="bg-gray-2 text-left dark:bg-meta-4 mt-6">
                    {filteredDataSalary
                        .reduce((uniqueEntries, data) => {
                            const isEntryExist = uniqueEntries.find(entry => entry.month === data.month && entry.tahun === data.tahun);
                            if (!isEntryExist) {
                                uniqueEntries.push(data);
                            }
                            return uniqueEntries;
                        }, []).map(data => (data.tahun !== 0 && data.month !== 0 &&
                            <h2 className="px-4 py-2 text-black dark:text-white" key={`${data.month}-${data.tahun}`}>
                                Menampilkan Data Salary Employee Month :
                                <span className="font-medium"> {data.month} </span>
                                Year :
                                <span className="font-medium"> {data.tahun}</span>
                            </h2>
                        ))}
                </div>

            </div>

            <div className='rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1 mt-6'>
                <div className="flex justify-between items-center mt-4 flex-col md:flex-row md:justify-between">
                    <div className="relative flex-2 mb-4 md:mb-0">
                        <input
                            type='text'
                            placeholder='Cari Employee Name...'
                            value={filterNama}
                            onChange={handleNamaChange}
                            className='rounded-lg border-[1.5px] border-stroke bg-transparent py-2 pl-10 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary left-0'
                        />
                        <span className='absolute left-2 py-3 text-xl'>
                            <BiSearch />
                        </span>
                    </div>
                </div>

                <div className='max-w-full overflow-x-auto py-4'>
                    <table className='w-full table-auto-full'>
                        <thead>
                            <tr className='bg-gray-2  dark:bg-meta-4'>
                                <th className='py-2 px-2 font-medium text-black dark:text-white'>
                                    No
                                </th>
                                <th className='py-2 px-2 font-medium text-black dark:text-white'>
                                    National ID
                                </th>
                                <th className='py-2 px-2 font-medium text-black dark:text-white'>
                                    Nama <br /> Employee
                                </th>
                                <th className='py-2 px-2 font-medium text-black dark:text-white'>
                                    Position
                                </th>
                                <th className='py-2 px-2 font-medium text-black dark:text-white'>
                                    Salary <br /> Pokok
                                </th>
                                <th className='py-2 px-2 font-medium text-black dark:text-white'>
                                    Tunjangan <br />Transport
                                </th>
                                <th className='py-2 px-2 font-medium text-black dark:text-white'>
                                    Uang <br /> Makan
                                </th>
                                <th className='py-2 px-2 font-medium text-black dark:text-white'>
                                    Deduction
                                </th>
                                <th className='py-2 px-2 font-medium text-black dark:text-white'>
                                    Total <br /> Salary
                                </th>
                                <th className='py-2 px-2 font-medium text-black dark:text-white'>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDataSalary.slice(startIndex, endIndex).map((data, index) => {
                                return (
                                    <tr key={data.id}>
                                        <td className='border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{startIndex + index + 1}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{data.nationalId}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{data.employeeName}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>{data.position}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>Rp. {data.salary_pokok}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>Rp. {data.transportAllowance}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>Rp. {data.mealAllowance}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>Rp. {data.deduction}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark'>
                                            <p className='text-black dark:text-white'>Rp. {data.total}</p>
                                        </td>
                                        <td className='border-b border-[#eee] py-5 px-4 text-center dark:border-strokedark'>
                                            <div className='flex items-center space-x-3.5'>
                                                <Link
                                                    className='hover:text-black'
                                                    to={`/data-salary/detail-data-salary/name/${data.employeeName}`}
                                                >
                                                    <FaRegEye className="text-primary text-xl hover:text-black dark:hover:text-white" />
                                                </Link>
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
                            Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredDataSalary.length)} data {filteredDataSalary.length} Data Salary Employee
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
    )
}

export default DataSalary;