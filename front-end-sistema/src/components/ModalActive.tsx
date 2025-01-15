import { FC, useCallback, useEffect, useState } from 'react'
import { Activo } from '../models/Active';
import { getActivo, getComponentsPerActive, getMantenimientosPerActive } from '../services/ActiveService';
import styles from '../styles/modules/modal.module.css';
import { ModalTable } from './ModalConfigureActive';


interface ModalProps {
    id_activo: number | null;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const ModalActive: FC<ModalProps> = ({ id_activo, isOpen, setIsOpen }) => {
    const [activo, setActivo] = useState<Activo>()
    const [components, setComponents] = useState<{
        name_comp: string,
        state_component: string,
    }[]>([]);
    const [mantenimientos, setMantenimientos] = useState<{
        code_mant: string,
        state_mant: number,
    }[]>([]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen])

    useEffect(() => {
        if (!id_activo) { return; }

        const fetchActivo = async () => {
            const { data } = await getActivo({ id_activo });

            if (data) setActivo(data);
        }

        const fetchComponents = async () => {
            const { data } = await getComponentsPerActive(id_activo);

            if (data) setComponents(data);
        }

        const fetchMantenimientos = async () => {
            const { data } = await getMantenimientosPerActive(id_activo);

            console.log(data);
            if (data) setMantenimientos(data);
        }

        fetchActivo();
        fetchComponents();
        fetchMantenimientos();
    }, [id_activo])

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
                        <h2>Ficha de Activo</h2>
                        <p>El presente documento detalla las características y el estado actual del activo registrado en el inventario.</p>
                    </header>
                    <div className={styles.mainSection}>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Código del activo</span>
                            <span className={styles.detail}>{activo?.code_act}</span>
                        </div>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Categoria</span>
                            <span className={styles.detail}>{activo?.category.category_type}</span>
                        </div>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Tipo</span>
                            <span className={styles.detail}>{activo?.type_act}</span>
                        </div>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Marca</span>
                            <span className={styles.detail}>{activo?.brand_act}</span>
                        </div>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Nombre</span>
                            <span className={styles.detail}>{activo?.name_act}</span>
                        </div>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Estado</span>
                            <span className={styles.detail}>{activo?.state_act}</span>
                        </div>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Ubicación</span>
                            <span className={styles.detail}>
                                {activo?.ubication.edificio.name_edi} - Piso {activo?.ubication.floor_ubi} - {activo?.ubication.name_ubi}
                            </span>
                        </div>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Fecha de adquisición</span>
                            <span className={styles.detail}>
                                {activo?.buy_process.date_proc}
                            </span>
                        </div>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Proceso de compra</span>
                            <span className={styles.detail}>
                                {activo?.buy_process.code_proc}
                            </span>
                        </div>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Se encuentra en mantenimiento?</span>
                            <span className={styles.detail}>
                                {activo?.in_maintenance ? 'Si' : 'No'}
                            </span>
                        </div>
                    </div>
                </section>
                {activo?.category.category_type !== 'Oficina' && (
                    <section className={styles.sectionPart}>
                        <header className={styles.modalHeader}>
                            <h2>Componentes</h2>
                            <p>En esta parte se reflejan los componentes que pertenecen al activo.</p>
                        </header>
                        <div className={styles.mainSection}>
                            <ModalTable>
                                <div className={styles.modalTableHeader}>
                                    <span>Componente</span>
                                    <span>Tipo de mantenimiento</span>
                                </div>
                                <div className={styles.modalTableBody}>
                                    {components.map((component, index) => (
                                        <div key={index} className={styles.modalTableRow}>
                                            <span>{component.name_comp}</span>
                                            <span>{component.state_component}</span>
                                        </div>
                                    ))}
                                </div>
                            </ModalTable>
                        </div>
                    </section>
                )}
                <section className={styles.sectionPart}>
                    <header className={styles.modalHeader}>
                        <h2>Historial de mantenimientos</h2>
                        <p>A continuación se muestra el historial de mantenimientos realizados en el activo.</p>
                    </header>
                    <div className={styles.mainSection}>
                        {mantenimientos.length > 0
                            ? (
                                <ModalTable>
                                    <div className={styles.modalTableHeader}>
                                        <span>Mantenimiento</span>
                                        <span>Estado</span>
                                    </div>
                                    <div className={styles.modalTableBody}>
                                        {mantenimientos.map((component, index) => (
                                            <div key={index} className={styles.modalTableRow}>
                                                <span>{component.code_mant}</span>
                                                <span>{component.state_mant === 1 ? 'Abierto' : 'Cerrado'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </ModalTable>
                            )
                            : (
                                <p
                                    className={styles.detail}
                                    style={{ textAlign: 'center' }}
                                >
                                    No se han registrado mantenimientos con este activo.
                                </p>
                            )
                        }
                    </div>
                </section>
            </div>
        </dialog>
    )
}

export { ModalActive };