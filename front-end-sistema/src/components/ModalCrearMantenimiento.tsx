import React, { FC, useState, useEffect, useCallback, JSX } from 'react';
import { getActivesPerUbication, getActivo, getLastIdMaintenance, getUbicaciones } from '../services/ActiveService';
import { ComboBoxInput } from './Input';
import { Activo, Ubicacion } from '../models/Active';
import styles from '../styles/modules/modal.module.css';
import clsx from 'clsx';

interface ModalCrearProviderProps {
    isOpen: boolean;
    setIsOpen: ((isOpen: boolean) => void) | null;
}

interface Componente {
    name: string;
    type_mant: string;
}

const ModalCrearMantenimiento: FC<ModalCrearProviderProps> = ({ isOpen, setIsOpen }) => {
    const [ubications, setUbications] = useState<Ubicacion[]>([]);
    const [actives, setActives] = useState<Activo[]>([]);
    const [lastId, setLastId] = useState<string>('');

    const [maintenanceCode, setMaintenanceCode] = useState<string>('');
    const [ubication, setUbication] = useState<number>(0);
    const [activeMaintenance, setActiveMaintenance] = useState<number>(0);
    const [activesToSave, setActivesToSave] = useState<{ id: number, code: string, state: string }[]>([]);

    // Puedo mejorarle 

    const [openSubGroupActive, setOpenSubGroupActive] = useState<boolean>(false);

    // ========================

    const [message, setMessage] = useState<JSX.Element | null>(null);

    const codeClass = clsx(styles.detail, styles.detailReadOnly);
    const textAreaClass = clsx(styles.detail, styles.detailTextArea);

    // Fetchs

    const fetchLastId = useCallback(async () => {
        const { data } = await getLastIdMaintenance();

        const lastId = (data + 1).toString();

        setLastId(lastId);
    }, [])

    const fetchUbicaciones = useCallback(async () => {
        const { data } = await getUbicaciones()

        setUbications(data);
    }, [])

    const fetchActives = useCallback(async (id_ubi: number) => {
        const { data } = await getActivesPerUbication(id_ubi);

        setActives(data);
    }, [])

    // Handlers

    const handleClose = useCallback(() => {
        if (setIsOpen) {
            setIsOpen(false);
        }
    }, [setIsOpen])

    const handleUbication = (value: Ubicacion) => {
        setUbication(value.id_ubi);
        fetchActives(value.id_ubi);
    }

    const handleActive = (value: Activo | null) => {
        console.log(value)
        setOpenSubGroupActive(!(value === null));
        if (!value) { return }

        setActiveMaintenance(value.id_act);
    }

    const handleSubmit = async () => {
        if (ubication === 0) {
            createMessage(true, 'Seleccione una ubicación para iniciar el mantenimiento');
            return;
        }

        console.log(activeMaintenance)
    }

    const handleSaveActive = (id: number, code: string, state: string) => {
        const activeToSave = {
            id: id,
            code: code,
            state: state
        }

        setActivesToSave([...activesToSave, activeToSave]);
        setOpenSubGroupActive(false);
    }

    // Create Code

    useEffect(() => {
        fetchUbicaciones();
        fetchLastId();

        const code = `MAN${lastId.padStart(4, '0')}`;
        setMaintenanceCode(code);
    }, [fetchActives, fetchLastId, fetchUbicaciones, lastId])

    const createMessage = (isError: boolean, message: string) => {
        const messageClass = clsx(styles.sectionPart, styles.sectionMessage, isError ? styles.sectionError : styles.sectionSuccess);
        const messageSection = (
            <section className={messageClass}>
                <span>{message}</span>
            </section>
        )
        setMessage(messageSection);
    }

    return (
        <dialog
            className={styles.dialog}
            open={isOpen}
        >
            <div className={styles.modalContent}>
                <button className={styles.closeIcon} onClick={handleClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                    </svg>
                </button>
                <section className={styles.sectionPart}>
                    <header className={styles.modalHeader}>
                        <h2>Crear mantenimiento</h2>
                        <p>
                            Complete los detalles del mantenimiento en el formulario a continuación.
                            Asegúrese de que toda la información sea precisa antes de enviarla.
                        </p>
                    </header>
                    {message}
                    <div className={styles.mainSection}>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Código del mantenimiento</span>
                            <span className={codeClass}>{maintenanceCode}</span>
                        </div>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Ubicación</span>
                            <ComboBoxInput
                                setOption={(value) => console.log(value)}
                                placeholder='Seleccione una ubicación'
                                className={styles.comboBox}
                            >
                                <span>Ninguna</span>
                                {ubications.map((ubication, index) => (
                                    <span
                                        key={index}
                                        onClick={() => handleUbication(ubication)}
                                    >
                                        {`${ubication.edificio.name_edi} - ${ubication.name_ubi}`}
                                    </span>
                                ))}
                            </ComboBoxInput>
                        </div>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Activos</span>
                            <ComboBoxInput
                                placeholder='Agregue activos al mantenimiento'
                                className={styles.comboBox}
                            >
                                <span onClick={() => handleActive(null)}>Ninguno</span>
                                {actives.map((active, index) => (
                                    <span
                                        key={index}
                                        onClick={() => handleActive(active)}
                                    >
                                        {`${active.code_act} - ${active.name_act}`}
                                    </span>
                                ))}
                            </ComboBoxInput>
                        </div>
                        {openSubGroupActive &&
                            <SubGroupActive
                                open={openSubGroupActive}
                                saveActive={handleSaveActive}
                                id_active={activeMaintenance}
                            />
                        }
                        {activesToSave.length > 0 && (
                            <ModalTable>
                                <div className={styles.modalTableHeader}>
                                    <div className={styles.modalTableHead}>
                                        <span>Activo</span>
                                    </div>
                                    <div className={styles.modalTableHead}>
                                        <span>Estado</span>
                                    </div>
                                </div>
                                <div className={styles.modalTableBody}>
                                    {activesToSave.map((active, index) => (
                                        <div className={styles.modalTableRow} key={index}>
                                            <div className={styles.modalTableItem}>
                                                <span>{active.code}</span>
                                            </div>
                                            <div className={styles.modalTableItem}>
                                                <span>{active.state}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ModalTable>
                        )}
                        <div className={styles.groupDetail}>
                            <span className={styles.infoLabel}>Descripción</span>
                            <textarea
                                className={textAreaClass}
                                placeholder='Descripción del mantenimiento'
                            />
                        </div>
                    </div>
                </section>
                <footer>
                    <button
                        className='primary-button'
                        onClick={() => handleSubmit()}
                    >
                        Guardar
                    </button>
                </footer>
            </div>
        </dialog>
    )
}


const SubGroupActive = ({ open, saveActive, id_active }: {
    open: boolean, saveActive: (id: number, code: string, state: string) => void, id_active: number
}) => {
    const [componentes, setComponentes] = useState<Componente[]>([]);
    const [active, setActive] = useState<Activo>();
    const [stateActive, setStateActive] = useState<string>('');
    const [nameComponent, setNameComponent] = useState<string>('');
    const [typeMantenimiento, setTypeMantenimiento] = useState<string>('');

    const codeClass = clsx(styles.detail, styles.detailReadOnly);
    const textAreaClass = clsx(styles.detail, styles.detailTextArea);

    const handleAddComponent = () => {
        const component: Componente = {
            name: nameComponent,
            type_mant: typeMantenimiento
        }

        setComponentes([...componentes, component]);
    }

    const handleSaveActive = () => {
        saveActive(active!.id_act, active!.code_act, stateActive)
        setComponentes([]);
    }

    const fetchActive = useCallback(async () => {
        const { data } = await getActivo({ id_activo: id_active });

        if (data) { setActive(data) }
    }, [id_active])

    useEffect(() => {
        fetchActive();
    }, [fetchActive])

    return (
        <SubGroup
            open={open}
        >
            <div className={styles.groupInfo}>
                <span className={styles.infoLabel}>Activo:</span>
                <span className={codeClass}>{active?.code_act}</span>
            </div>
            <div className={styles.groupInfo}>
                <span className={styles.infoLabel}>Estado:</span>
                <ComboBoxInput
                    setOption={(value) => setStateActive(value)}
                    placeholder='En que estado se encuentra el activo'
                    className={styles.comboBox}
                >
                    <span>Ninguno</span>
                    <span>Reparado</span>
                    <span>Averiado</span>
                </ComboBoxInput>
            </div>
            <SubGroup>
                <div className={styles.groupInfo}>
                    <span className={styles.infoLabel}>Tipo :</span>
                    <ComboBoxInput
                        setOption={(value) => setTypeMantenimiento(value)}
                        placeholder='Seleccione un tipo de mantenimiento'
                        className={styles.comboBox}
                    >
                        <span>Ninguno</span>
                        <span>Reparo</span>
                        <span>Cambio</span>
                        <span>Limpieza</span>
                    </ComboBoxInput>
                </div>
                <div className={styles.groupInfo}>
                    <span className={styles.infoLabel}>Componentes:</span>
                    <ComboBoxInput
                        setOption={(value) => setNameComponent(value)}
                        placeholder='Seleccione un componente'
                        className={styles.comboBox}
                    >
                        <span>Ninguno</span>
                        <span>CPU</span>
                        <span>RAM</span>
                        <span>Grafica</span>
                    </ComboBoxInput>
                </div>
                <button
                    className='primary-button'
                    onClick={() => handleAddComponent()}
                >
                    Guardar componente
                </button>
            </SubGroup>
            {componentes.length > 0 && (
                <ModalTable>
                    <div className={styles.modalTableHeader}>
                        <div className={styles.modalTableHead}>
                            <span>Componente</span>
                        </div>
                        <div className={styles.modalTableHead}>
                            <span>Tipo</span>
                        </div>
                    </div>
                    <div className={styles.modalTableBody}>
                        {componentes.map((componente, index) => (
                            <div className={styles.modalTableRow} key={index}>
                                <div className={styles.modalTableItem}>
                                    <span>{componente.name}</span>
                                </div>
                                <div className={styles.modalTableItem}>
                                    <span>{componente.type_mant}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </ModalTable>
            )}
            <div className={styles.groupDetail}>
                <span className={styles.infoLabel}>Comentario</span>
                <textarea
                    className={textAreaClass}
                    placeholder='Comentario del mantenimiento que se le dará'
                />
            </div>
            <button
                className='primary-button'
                onClick={() => handleSaveActive()}
            >
                Guardar activo
            </button>
        </SubGroup>
    )
}


// Componentes GENERICOS

interface SubGroupProps {
    open?: boolean;
    children?: React.ReactNode;
}

const SubGroup: FC<SubGroupProps> = ({ children, open = true }) => {
    if (!children || !open) { return null }

    return <div className={styles.subGroup}>{children}</div>
}

interface ModalTableProps {
    children?: React.ReactNode;
}

const ModalTable: FC<ModalTableProps> = ({ children }) => {
    if (!children) { return null }

    return (
        <div className={styles.modalTable}>
            {children}
        </div>
    )
}


export { ModalCrearMantenimiento }