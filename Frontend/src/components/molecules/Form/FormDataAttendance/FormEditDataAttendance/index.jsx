import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '../../../../../layout';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Breadcrumb, ButtonOne, ButtonTwo, ButtonThree } from '../../../../../components';
import { getMe } from '../../../../../config/redux/action';

const FormEditDataAttendance = () => {
    const [nationalId, setNik] = useState('');
    const [namaEmployee, setNamaEmployee] = useState('');
    const [namaPosition, setNamaPosition] = useState('');
    const [present, setPresent] = useState('');
    const [sick, setSick] = useState('');
    const [absent, setAbsent] = useState('');
    const [msg, setMsg] = useState('');
    const { id } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isError, user } = useSelector((state) => state.auth);

    useEffect(() => {
        const getUserById = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:5000/data_attendance/${id}`);
                setNamaEmployee(response.data.employeeName);
                setNik(response.data.nationalId);
                setNamaPosition(response.data.nama_position);
                setPresent(response.data.present);
                setSick(response.data.sick);
                setAbsent(response.data.absent);
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        }
        getUserById();
    }, [id]);

    const updateDataAttendance = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('employeeName', namaEmployee);
            formData.append('nationalId', nationalId);
            formData.append('nama_position', namaPosition);
            formData.append('present', present);
            formData.append('sick', sick);
            formData.append('absent', absent);

            const response = await axios.patch(`http://127.0.0.1:5000/data_attendance/update/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMsg(response.data.msg);
            Swal.fire({
                icon: 'success',
                title: 'Success',
                timer: 1500,
                text: response.data.msg
            });
            navigate('/data-attendance');
        } catch (error) {
            setMsg(error.response.data.msg);
            Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: error.response.data.msg
            });
        }
    };

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
            <Breadcrumb pageName='Form Edit Attendance Data Employee' />

            <div className='sm:grid-cols-2'>
                <div className='flex flex-col gap-9'>
                    <div className='rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark'>
                        <div className='border-b border-stroke py-4 px-6.5 dark:border-strokedark'>
                            <h3 className='font-medium text-black dark:text-white'>
                                Form Edit Attendance Data Employee
                            </h3>
                        </div>
                        <form onSubmit={updateDataAttendance}>
                            <div className='p-6.5'>
                                <div className='mb-4.5 flex flex-col gap-6 xl:flex-row'>
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Employee Name <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='text'
                                            id='namaEmployee'
                                            name='namaEmployee'
                                            value={namaEmployee}
                                            onChange={(e) => setNamaEmployee(e.target.value)}
                                            disabled
                                            placeholder='Loginkan Nama'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            National ID <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='number'
                                            id='nationalId'
                                            name='nationalId'
                                            value={nationalId}
                                            onChange={(e) => setNik(e.target.value)}
                                            required
                                            disabled
                                            placeholder='Loginkan National ID'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                </div>

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row mt-10">
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Position <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='text'
                                            id='namaPosition'
                                            name='namaPosition'
                                            value={namaPosition}
                                            onChange={(e) => setNamaPosition(e.target.value)}
                                            required={true}
                                            disabled
                                            placeholder='Loginkan position'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>

                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Present <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='number'
                                            id='present'
                                            name='present'
                                            value={present}
                                            onChange={(e) => setPresent(e.target.value)}
                                            required
                                            placeholder='Loginkan present'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                </div>

                                <div className="mb-4.5 flex flex-col gap-6 xl:flex-row mt-10">
                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Sick <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='number'
                                            id='sick'
                                            name='sick'
                                            value={sick}
                                            onChange={(e) => setSick(e.target.value)}
                                            required
                                            placeholder='Loginkan sick'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>

                                    <div className='w-full xl:w-1/2'>
                                        <label className='mb-2.5 block text-black dark:text-white'>
                                            Absent <span className='text-meta-1'>*</span>
                                        </label>
                                        <input
                                            type='number'
                                            id='absent'
                                            name='absent'
                                            value={absent}
                                            onChange={(e) => setAbsent(e.target.value)}
                                            required
                                            placeholder='Loginkan absent'
                                            className='w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary'
                                        />
                                    </div>
                                </div>
                                <div className='flex flex-col md:flex-row w-full gap-3 text-center'>
                                    <div>
                                        <ButtonOne  >
                                            <span>Perbarui</span>
                                        </ButtonOne>
                                    </div>
                                    <Link to="/data-attendance" >
                                        <ButtonTwo  >
                                            <span>Back</span>
                                        </ButtonTwo>
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default FormEditDataAttendance;
