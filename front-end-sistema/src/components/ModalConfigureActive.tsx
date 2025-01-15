import { FC, useCallback, useEffect, useState } from 'react';
import styles from '../styles/modules/modal.module.css';
import { getActivo, getComponentsPerType } from '../services/ActiveService';
import { ComboBoxInput } from './Input';
import clsx from 'clsx';
import { DetailsType } from '../models/Maintenance';

interface ConfigureActiveModalProps {
    idActive: number;
    isOpen: boolean;
    setIsOpen: ((isOpen: boolean) => void);
    handleAddDetails: ((detail: DetailsType) => void);
    details: DetailsType[];
}

const ConfigureActiveModal: FC<ConfigureActiveModalProps> = ({ idActive, isOpen, setIsOpen, handleAddDetails, details }) => {
    const [components, setComponents] = useState<string[]>([]);
    const [codeActive, setCodeActive] = useState<string>('');

    const [activity, setActivity] = useState<string>('');
    const [activities, setActivities] = useState<string[]>([]);
    const [state = 'Nuevo', setState] = useState<string>('');
    const [hasUpdates, setHasUpdates] = useState<boolean>(false);

    const [message, setMessage] = useState<React.ReactNode | null>(null);

    const [actualComponent, setActualComponent] = useState<{
        name_comp: string;
        type_mant: string;
    }>({ name_comp: '', type_mant: '' });

    const [componentsDetails, setComponentsDetails] = useState<{
        name_comp: string;
        type_mant: string;
    }[]>([]);

    const [subGroupVisible, setSubGroupVisible] = useState<boolean>(false);

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen])

    const handleSave = useCallback(() => {
        if (!hasUpdates) {
            console.log('No hay cambios');
            handleClose();
            return;
        }

        if (activities.length === 0 && componentsDetails.length === 0) {
            createMessage(true, 'Debes agregar al menos una actividad o un componente');
            return;
        }

        const details: DetailsType = {
            id_act: idActive,
            state_act: state || 'Nuevo',
            activity_mant: activities,
            components: componentsDetails
        }

        handleAddDetails(details);
        handleClose();
    }, [activities, componentsDetails, handleAddDetails, handleClose, hasUpdates, idActive, state])

    const handleAddActivity = useCallback(() => {
        if (activity === '' || activities.includes(activity)) {
            return;
        }

        setActivities([...activities, activity])
        setHasUpdates(true);
    }, [activities, activity])

    const createMessage = (isError: boolean, message: string) => {
        const messageClass = clsx(styles.sectionPart, styles.sectionMessage, isError ? styles.sectionError : styles.sectionSuccess);
        const messageSection = (
            <section className={messageClass}>
                <span>{message}</span>
            </section>
        )
        setMessage(messageSection);
    }

    const fetchActive = useCallback(async () => {
        const { data } = await getActivo({ id_activo: idActive });

        if (!data) { return }

        setCodeActive(data.code_act);

        const { data: components } = await getComponentsPerType(data?.type_act);
        setComponents(components);
    }, [idActive])

    useEffect(() => {
        if (isOpen) {
            fetchActive();
        }
    }, [isOpen, fetchActive])

    useEffect(() => {
        if (details.length > 0) {
            const actualDetail = details.find(detail => detail.id_act === idActive);

            if (actualDetail) {
                setActivities(actualDetail.activity_mant);
                setComponentsDetails(actualDetail.components);
                if (actualDetail.components.length > 0) {
                    setSubGroupVisible(true);
                }
            }
        }
    }, [details, idActive])

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
                        <h2>Realizarle mantenimiento al activo</h2>
                        <p>Selecciona que actividades quieres realizarle al activo o a sus componentes, <br />además puedes actualizar el estado del componente si es necesario</p>
                    </header>
                </section>
                {message}
                <section className={styles.groupInfo}>
                    <span className={styles.infoLabel}>Activo:</span>
                    <span className={styles.detail}>{codeActive}</span>
                </section>
                <section className={styles.mainSection} style={{ padding: '0' }}>
                    <section className={styles.groupDetail}>
                        <span className={styles.infoLabel}>Estado:</span>
                        <ComboBoxInput
                            setOption={(option) => setState(option)}
                            placeholder='Seleccione el estado'
                        >
                            <span>Nuevo</span>
                            <span>Reparado</span>
                            <span>Averiado</span>
                        </ComboBoxInput>
                    </section>
                    <section className={styles.groupDetail}>
                        <span className={styles.infoLabel}>Actividades:</span>
                        <ComboBoxInput
                            setOption={(option) =>  setActivity(option)}
                            placeholder='Seleccione las actividades'
                        >
                            <span>Ninguno</span>
                            <span>Limpieza general</span>
                            <span>Mantenimiento preventivo</span>
                            <span>Mantenimiento correctivo</span>
                        </ComboBoxInput>
                    </section>
                </section>
                <button
                    className='primary-button'
                    onClick={() => handleAddActivity()}
                >
                    Agregar actividad
                </button>
                {activities.length > 0 && (
                    <ModalTable>
                        <div className={styles.modalTableHeader}>
                            <span>Actividades</span>
                        </div>
                        <div className={styles.modalTableBody}>
                            {activities.map((activity, index) => (
                                <div key={index} className={styles.modalTableRow}>
                                    <span>{activity}</span>
                                </div>
                            ))}
                        </div>
                    </ModalTable>
                )}
                {components.length > 0 && (
                    <button
                        className='primary-button'
                        disabled={subGroupVisible}
                        onClick={() => setSubGroupVisible(true)}
                    >
                        Agregar componentes al mantenimiento
                    </button>
                )}
                <SubGroup
                    open={subGroupVisible}
                >
                    <section className={styles.groupInfo}>
                        <span className={styles.infoLabel}>Componentes:</span>
                        <ComboBoxInput
                            setOption={(option) => setActualComponent({ ...actualComponent, name_comp: option })}
                            placeholder='Seleccione el componente'
                        >
                            <span>Ninguno</span>
                            {components.map((component, index) => (
                                <span key={index}>{component}</span>
                            ))}
                        </ComboBoxInput>
                    </section>
                    <section className={styles.groupInfo}>
                        <span className={styles.infoLabel}>Tipo de mantenimiento:</span>
                        <ComboBoxInput
                            setOption={(option) => setActualComponent({ ...actualComponent, type_mant: option })}
                            placeholder='Seleccione un mantenimiento'
                        >
                            <span>Ninguno</span>
                            <span>Cambio</span>
                            <span>Reparación</span>
                            <span>Limpieza</span>
                        </ComboBoxInput>
                    </section>
                    <button
                        className='primary-button'
                        onClick={() => {
                            if (actualComponent.name_comp === '' || actualComponent.type_mant === '') {
                                return;
                            }
                            setComponentsDetails([...componentsDetails, actualComponent]);
                            setHasUpdates(true);
                        }}
                    >
                        Agregar componente al mantenimiento
                    </button>
                    {componentsDetails.length > 0 && (
                        <ModalTable>
                            <div className={styles.modalTableHeader}>
                                <span>Componente</span>
                                <span>Tipo de mantenimiento</span>
                            </div>
                            <div className={styles.modalTableBody}>
                                {componentsDetails.map((component, index) => (
                                    <div key={index} className={styles.modalTableRow}>
                                        <span>{component.name_comp}</span>
                                        <span>{component.type_mant}</span>
                                    </div>
                                ))}
                            </div>
                        </ModalTable>
                    )}
                </SubGroup>
                <section className={styles.sectionPart}>
                    <button
                        className='primary-button'
                        style={{ alignSelf: 'end' }}
                        onClick={handleSave}
                    >
                        Continuar
                    </button>
                </section>
            </div>
        </dialog>
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

export default ConfigureActiveModal;
export { SubGroup, ModalTable };
