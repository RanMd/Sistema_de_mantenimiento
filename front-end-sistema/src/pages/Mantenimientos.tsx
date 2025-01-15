import { ComboBoxInput } from '../components/Input';
import { DataTable } from '../tables/data-table';
import { columnsMaintenance } from '../tables/columns';
import { useRef, useState, useEffect, useCallback } from 'react';
import { Row, Table } from '@tanstack/react-table';
import { getActivesPerMant, getAllMaintenance, getDetailsUpdate, getLastIdMaintenance, getMaintenance, saveMaintenance } from '../services/ActiveService';
import { ActiveSelectionModal } from '../components/ActiveSelectionModal';
import { DetailsType, Maintenance, MaintenanceToSave } from '../models/Maintenance';
import { ActiveToTable } from '../models/Active';
import ConfigureActiveModal from '../components/ModalConfigureActive';
import { ModalMaintenance } from '../components/ModalMaintenance';

const MantenimientosPage = () => {
    const [maintenance, setMaintenance] = useState<Maintenance[]>([])
    const [registerIsOpen, setRegisterIsOpen] = useState(false);

    const [maintenanceId, setMaintenanceId] = useState<number>(0);
    const [modalMaintenanceIsOpen, setModalMaintenanceIsOpen] = useState(false);

    const [updateIsOpen, setUpdateIsOpen] = useState(false);

    const [dateFilter, setDateFilter] = useState<{
        year: string,
        month: string
    }>({ year: '', month: '' })

    const tableRef = useRef<Table<Maintenance>>(null);

    const setFilter = (column: string, value: string) => {
        tableRef.current?.getColumn(column)?.setFilterValue(value)
    }

    const handleDateFilter = (value: string, isYear: boolean = true) => {
        const updateFilter = isYear
            ? { ...dateFilter, year: value }
            : { ...dateFilter, month: value };

        setDateFilter(updateFilter);

        const filter = updateFilter.year || updateFilter.month
            ? `${updateFilter.year}${updateFilter.month ? `-${updateFilter.month}-` : ''}`
            : '';

        tableRef.current?.getColumn('date_start_mant')?.setFilterValue(filter)
    }

    const handleModalMaintenance = (num_mant: number) => {
        setMaintenanceId(num_mant);
        setModalMaintenanceIsOpen(true);
    }

    const handleUpdateMaintenance = (num_mant: number) => {
        setMaintenanceId(num_mant);
        setUpdateIsOpen(true);
    }

    // Fetch data

    const fetchMaintenance = useCallback(async () => {
        const { data } = await getAllMaintenance();

        if (data) { setMaintenance(data) }
    }, [])

    useEffect(() => {
        fetchMaintenance();
    }, [fetchMaintenance])

    return (
        <>
            <section className="actives-page">
                <header className='actives-header'>
                    <h1>Registro de mantenimientos</h1>
                    <button className='primary-button' onClick={() => setRegisterIsOpen(true)}>Crear mantenimiento</button>
                </header>
                <section className="search-section">
                    <div className="search-filters">
                        <input
                            type='text'
                            onChange={(e) => setFilter('code_mant', e.target.value)}
                            placeholder='Buscar por codigo' />

                        <ComboBoxInput
                            setOption={(option) => handleDateFilter(option)}
                            placeholder='Filtrar mantenimiento por año'
                        >
                            <span>Ninguno</span>
                            <span>2019</span>
                            <span>2020</span>
                            <span>2021</span>
                            <span>2022</span>
                            <span>2023</span>
                            <span>2024</span>
                            <span>2025</span>
                        </ComboBoxInput>
                        <ComboBoxInput
                            setOption={(option) => {
                                const month = option === 'Enero' ? '01' : option === 'Febrero' ? '02' : option === 'Marzo' ? '03' : option === 'Abril' ? '04' : option === 'Mayo' ? '05' : option === 'Junio' ? '06' : option === 'Julio' ? '07' : option === 'Agosto' ? '08' : option === 'Septiembre' ? '09' : option === 'Octubre' ? '10' : option === 'Noviembre' ? '11' : option === 'Diciembre' ? '12' : '';

                                handleDateFilter(month, false);
                            }}
                            placeholder='Filtrar mantenimiento por mes'
                        >
                            <span>Ninguno</span>
                            <span>Enero</span>
                            <span>Febrero</span>
                            <span>Marzo</span>
                            <span>Abril</span>
                            <span>Mayo</span>
                            <span>Junio</span>
                            <span>Julio</span>
                            <span>Agosto</span>
                            <span>Septiembre</span>
                            <span>Octubre</span>
                            <span>Noviembre</span>
                            <span>Diciembre</span>
                        </ComboBoxInput>
                        <ComboBoxInput
                            setOption={(option) => {
                                const state = option === 'Abierto' ? '1' : option === 'Cerrado' ? '0' : ''
                                setFilter('state_mant', state)
                            }}
                            placeholder='Filtrar mantenimiento por estado'
                        >
                            <span>Ninguno</span>
                            <span>Abierto</span>
                            <span>Cerrado</span>
                        </ComboBoxInput>
                    </div>
                </section>
                <DataTable columns={columnsMaintenance(handleModalMaintenance, handleUpdateMaintenance)} data={maintenance} ref={tableRef}></DataTable>
            </section>
            <CreateMaintenance open={registerIsOpen} setOpen={setRegisterIsOpen} />
            <UpdateMaintenance open={updateIsOpen} setOpen={setUpdateIsOpen} numMant={maintenanceId} />
            <ModalMaintenance id_maintenance={maintenanceId} isOpen={modalMaintenanceIsOpen} setIsOpen={setModalMaintenanceIsOpen} />
        </>
    )
};

type ActivesType = {
    id_act: number
}

const CreateMaintenance = ({ open, setOpen }: { open: boolean, setOpen: (open: boolean) => void }) => {
    const [modalActivesStatus, setModalActivesStatus] = useState(false);
    const [modalConfigStatus, setModalConfigStatus] = useState(false);
    const [isOpen, setIsOpen] = useState(open);
    const [maintenance, setMaintenance] = useState<MaintenanceToSave>({} as MaintenanceToSave);
    const [details, setDetails] = useState<DetailsType[]>([]);
    const [actives, setActives] = useState<ActiveToTable[]>([]);
    const [idActive, setIdActive] = useState<number>(0);
    const [messageActive, setMessageActive] = useState<boolean>(false);

    const [tipoMant, setTipoMant] = useState<string>('');

    const operadores = {
        Externo: ['Juan', 'Pepe', 'Pedro'],
        Interno: ['Carlos', 'Luis', 'Miguel']
    }

    const handleAddActives = (activesToAdd: Row<ActiveToTable>[]) => {
        const detalle: ActivesType[] = [];

        const activesToAddAux = [...actives, ...activesToAdd.map((active) => {
            detalle.push({ id_act: active.original.id });
            return active.original;
        })];

        setMaintenance({ ...maintenance, actives: [...(maintenance.actives || []), ...detalle] });

        setActives(activesToAddAux);
    }

    const handleRemoveActive = (id: number) => {
        const opt = confirm('¿Está seguro de eliminar este activo?');

        if (!opt) return;

        const detalleAux = maintenance.actives.filter((active) => active.id_act !== id);

        const activesAux = actives.filter((active) => active.id !== id);

        const detailsAux = details.filter((detail) => detail.id_act !== id);

        setDetails(detailsAux);
        setMaintenance({ ...maintenance, actives: detalleAux });
        setActives(activesAux);
    }

    const handleOpenMaintenance = async () => {
        if (actives.length === 0 || !maintenance.attendant_mant || !maintenance.type_attendant_mant) {
            setMessageActive(true);
            return;
        }

        setMessageActive(false);
        setMaintenance({ ...maintenance, state_mant: 1 });
        setOpen(false);
        await saveMaintenance(maintenance, details);
    }

    const handleAddDetail = (detail: DetailsType) => {
        const detailFiltered = details.filter((det) => det.id_act !== detail.id_act);

        setDetails([...detailFiltered, detail]);
    }

    useEffect(() => {
        setIsOpen(open)
    }, [open])

    useEffect(() => {
        const fetchLastId = async () => {
            const { data } = await getLastIdMaintenance();

            const lastId = (data + 1).toString();
            const code = `MANT-${lastId.padStart(4, '0')}`;
            setMaintenance({ ...maintenance, code_mant: code, num_mant: data + 1 });
        }

        fetchLastId();
    }, [])

    return (
        <section className="actives-page page-over" style={{ display: isOpen ? 'flex' : 'none' }}>
            <header className='actives-header'>
                <h1>Registro del mantenimiento</h1>
                <button className='primary-button' onClick={() => setOpen(false)}>Volver</button>
            </header>
            {messageActive &&
                <section className='message-section'>
                    <span>Por favor, complete los campos para registrar el mantenimiento</span>
                </section>
            }
            <section className='details-section'>
                <section className='details-section-info'>
                    <span className='label-info'>Código del mantenimiento:</span>
                    <span className='tag-info'>{maintenance.code_mant}</span>
                </section>
                <section className='details-section-info'>
                    <span className='label-info'>Personal del mantenimiento:</span>
                    <ComboBoxInput
                        setOption={(option) => {
                            setTipoMant(option);
                            setMaintenance({ ...maintenance, type_attendant_mant: option })
                        }}
                        placeholder='Seleccione un tipo'
                    >
                        <span>Ninguno</span>
                        <span>Interno</span>
                        <span>Externo</span>
                    </ComboBoxInput>
                </section>
                <section className='details-section-info'>
                    <span className='label-info'>Encargado del mantenimiento:</span>
                    <ComboBoxInput
                        setOption={(option) => setMaintenance({ ...maintenance, attendant_mant: option })}
                        placeholder='Seleccione el encargado'
                    >
                        <span>Ninguno</span>
                        {tipoMant !== '' && operadores[tipoMant as 'Externo' | 'Interno'].map((op) => (
                            <span key={op}>{op}</span>
                        ))}
                    </ComboBoxInput>
                </section>
                <section className='details-section-info'>
                    <span className='label-info'>Estado del mantenimiento:</span>
                    <span className='tag-info tag-state'>Abierto</span>
                </section>
            </section>
            <button
                className='primary-button'
                style={{ alignSelf: 'flex-start' }}
                onClick={() => setModalActivesStatus(true)}
            >
                Agregar activos
            </button>
            <section className={'actives-data' + (actives.length === 0 ? ' empty-data' : '')}>
                {
                    actives.length === 0
                        ? <span>No hay activos registrados en este mantenimiento</span>
                        : actives.map((active) => (
                            <section className='details-active-info' key={active.id}>
                                <svg fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="notepad-1" enableBackground="new 0 0 32 32" xmlSpace="preserve">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <rect x="9" y="17" width="14" height="2"></rect>
                                        <rect x="9" y="21" width="14" height="2"></rect>
                                        <rect x="9" y="13" width="14" height="2"></rect>
                                        <path d="M23 4V2h-2v2h-4V2h-2v2h-4V2H9v2H4v26h24V4H23zM26 28H6V6h3v2h2V6h4v2h2V6h4v2h2V6h3V28z"></path>
                                    </g>
                                </svg>

                                {/* <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L12.7348 11.2045L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z" fill="currentColor">
                                        </path>
                                    </g>
                                </svg> */}


                                <span className=''>{active.code}</span>
                                <span className=''>{active.name}</span>
                                <span className=''>{active.type}</span>
                                <div className="buttons">
                                    <button
                                        className='primary-button'
                                        onClick={() => handleRemoveActive(active.id)}
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        className='primary-button'
                                        onClick={() => {
                                            setIdActive(active.id);
                                            setModalConfigStatus(true);
                                        }}
                                    >
                                        Detalles
                                    </button>
                                </div>
                            </section>
                        ))
                }
            </section>
            <section className='footer-buttons-section'>
                <button
                    className='primary-button'
                    style={{ alignSelf: 'flex-start' }}
                    disabled={actives.length === 0}
                    onClick={() => handleOpenMaintenance()}
                >
                    Abrir
                </button>
                <button
                    className='primary-button'
                    style={{ alignSelf: 'flex-start' }}
                    disabled
                >
                    Finalizar
                </button>
            </section>
            {modalActivesStatus &&
                <ActiveSelectionModal
                    isOpen={modalActivesStatus}
                    setIsOpen={setModalActivesStatus}
                    handleSelectedActivos={handleAddActives}
                />
            }
            {modalConfigStatus &&
                <ConfigureActiveModal
                    idActive={idActive}
                    isOpen={modalConfigStatus}
                    setIsOpen={setModalConfigStatus}
                    handleAddDetails={handleAddDetail}
                    details={details}
                />}
        </section>
    )
}

const UpdateMaintenance = ({ open, setOpen, numMant }: { open: boolean, setOpen: (open: boolean) => void, numMant: number }) => {
    const [modalActivesStatus, setModalActivesStatus] = useState(false);
    const [modalConfigStatus, setModalConfigStatus] = useState(false);

    const [maintenance, setMaintenance] = useState<Maintenance>({} as Maintenance);

    const [details, setDetails] = useState<DetailsType[]>([]);
    const [actives, setActives] = useState<ActiveToTable[]>([]);

    const [idActive, setIdActive] = useState<number>(0);
    const [messageActive, setMessageActive] = useState<boolean>(false);

    const handleAddActives = (activesToAdd: Row<ActiveToTable>[]) => {
        const detalle: ActivesType[] = [];

        const activesToAddAux = [...actives, ...activesToAdd.map((active) => {
            detalle.push({ id_act: active.original.id });
            return active.original;
        })];

        setActives(activesToAddAux);
    }

    const handleRemoveActive = (id: number) => {
        const opt = confirm('¿Está seguro de eliminar este activo?');

        if (!opt) return;

        const activesAux = actives.filter((active) => active.id !== id);

        const detailsAux = details.filter((detail) => detail.id_act !== id);

        setDetails(detailsAux);
        setActives(activesAux);
    }

    const handleCloseMaintenance = async () => {
        if (actives.length === 0 || !maintenance.attendant_mant || !maintenance.type_attendant_mant) {
            setMessageActive(true);
            return;
        }
    }

    const handleAddDetail = (detail: DetailsType) => {
        const detailFiltered = details.filter((det) => det.id_act !== detail.id_act);

        setDetails([...detailFiltered, detail]);
    }

    useEffect(() => {
        if (numMant === 0) return;

        const fetchMaintenance = async () => {
            const { data } = await getMaintenance(numMant);

            if (data) {
                setMaintenance(data);
            }
        }

        const fetchDetails = async () => {
            const { data } = await getDetailsUpdate(numMant);

            if (data) {
                data.forEach((detail) => {
                    detail.activity_mant = detail.activity_mant.filter((act) => act !== null)
                    detail.components = detail.components.filter((comp) => comp.name_comp !== null)
                })
                console.log(data);
                setDetails(data);
            }
        }

        const fectActives = async () => {
            const { data } = await getActivesPerMant(numMant);

            if (data) {
                setActives(data);
            }
        }

        fetchMaintenance();
        fetchDetails();
        fectActives();
    }, [numMant])

    return (
        <section className="actives-page page-over" style={{ display: open ? 'flex' : 'none' }}>
            <header className='actives-header'>
                <h1>Actualización del Mantenimiento</h1>
                <button className='primary-button' onClick={() => setOpen(false)}>Volver</button>
            </header>
            {messageActive &&
                <section className='message-section'>
                    <span>Por favor, complete los campos para registrar el mantenimiento</span>
                </section>
            }
            <section className='details-section'>
                <section className='details-section-info'>
                    <span className='label-info'>Código del mantenimiento:</span>
                    <span className='tag-info'>{maintenance.code_mant}</span>
                </section>
                <section className='details-section-info'>
                    <span className='label-info'>Personal del mantenimiento:</span>
                    <span className='tag-info'>{maintenance.type_attendant_mant}</span>
                </section>
                <section className='details-section-info'>
                    <span className='label-info'>Encargado del mantenimiento:</span>
                    <span className='tag-info'>{maintenance.attendant_mant}</span>
                </section>
                <section className='details-section-info'>
                    <span className='label-info'>Fecha de inicio del mantenimiento:</span>
                    <span className='tag-info'>{maintenance.date_start_mant}</span>
                </section>
                <section className='details-section-info'>
                    <span className='label-info'>Estado del mantenimiento:</span>
                    <span className='tag-info tag-state'>{maintenance.state_mant === 1 && 'Abierto'}</span>
                </section>
            </section>
            <button
                className='primary-button'
                style={{ alignSelf: 'flex-start' }}
                onClick={() => setModalActivesStatus(true)}
            >
                Agregar activos
            </button>
            <section className={'actives-data' + (actives.length === 0 ? ' empty-data' : '')}>
                {
                    actives.length === 0
                        ? <span>No hay activos registrados en este mantenimiento</span>
                        : actives.map((active) => (
                            <section className='details-active-info' key={active.id}>
                                <svg fill="currentColor" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="notepad-1" enableBackground="new 0 0 32 32" xmlSpace="preserve">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <rect x="9" y="17" width="14" height="2"></rect>
                                        <rect x="9" y="21" width="14" height="2"></rect>
                                        <rect x="9" y="13" width="14" height="2"></rect>
                                        <path d="M23 4V2h-2v2h-4V2h-2v2h-4V2H9v2H4v26h24V4H23zM26 28H6V6h3v2h2V6h4v2h2V6h4v2h2V6h3V28z"></path>
                                    </g>
                                </svg>

                                {/* <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                                    <g id="SVGRepo_iconCarrier">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM16.0303 8.96967C16.3232 9.26256 16.3232 9.73744 16.0303 10.0303L11.0303 15.0303C10.7374 15.3232 10.2626 15.3232 9.96967 15.0303L7.96967 13.0303C7.67678 12.7374 7.67678 12.2626 7.96967 11.9697C8.26256 11.6768 8.73744 11.6768 9.03033 11.9697L10.5 13.4393L12.7348 11.2045L14.9697 8.96967C15.2626 8.67678 15.7374 8.67678 16.0303 8.96967Z" fill="currentColor">
                                        </path>
                                    </g>
                                </svg> */}


                                <span className=''>{active.code}</span>
                                <span className=''>{active.name}</span>
                                <span className=''>{active.type}</span>
                                <div className="buttons">
                                    <button
                                        className='primary-button'
                                        onClick={() => handleRemoveActive(active.id)}
                                    >
                                        Eliminar
                                    </button>
                                    <button
                                        className='primary-button'
                                        onClick={() => {
                                            setIdActive(active.id);
                                            setModalConfigStatus(true);
                                        }}
                                    >
                                        Detalles
                                    </button>
                                </div>
                            </section>
                        ))
                }
            </section>
            <section className='footer-buttons-section'>
                <button
                    className='primary-button'
                    style={{ alignSelf: 'flex-start' }}
                    onClick={() => handleCloseMaintenance()}
                    disabled
                >
                    Finalizar
                </button>
            </section>
            {modalActivesStatus &&
                <ActiveSelectionModal
                    isOpen={modalActivesStatus}
                    setIsOpen={setModalActivesStatus}
                    handleSelectedActivos={handleAddActives}
                />
            }
            {modalConfigStatus &&
                <ConfigureActiveModal
                    idActive={idActive}
                    isOpen={modalConfigStatus}
                    setIsOpen={setModalConfigStatus}
                    handleAddDetails={handleAddDetail}
                    details={details}
                />}
        </section>
    )
}

export default MantenimientosPage;