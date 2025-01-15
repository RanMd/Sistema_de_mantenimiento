import { FC, useCallback, useEffect, useState } from 'react'
import { getDetailsReport, getMaintenance, reOpenMaintenance } from '../services/ActiveService';
import { DetailsReportType, Maintenance } from '../models/Maintenance';
import styles from '../styles/modules/modal.module.css';
import { DataTableReport } from '../tables/data-table';
import { columnsMaintenanceReport } from '../tables/columns';
import { Row } from '@tanstack/react-table';


interface ModalProps {
    id_maintenance: number;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const ModalMaintenance: FC<ModalProps> = ({ id_maintenance, isOpen, setIsOpen }) => {
    const [maintenance, setMaintenance] = useState<Maintenance>()
    const [details, setDetails] = useState<DetailsReportType[]>([]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen])

    const handleReopenMaintenance = async () => {
        const opt = confirm('¿Está seguro de reabrir el mantenimiento?');

        if (!opt) { return }

        setIsOpen(false);
        await reOpenMaintenance(id_maintenance);
        window.location.reload();
    }

    const renderSubComponent = ({ row }: { row: Row<DetailsReportType> }) => {
        const detail = row.original;
        console.log(detail);

        return (
            <div className={styles.subComponent}>
                {detail.actividades.length > 0
                    ? (
                        <div>
                            <h3>Actividades</h3>
                            <ul>
                                {detail.actividades.map((act, index) => (
                                    <li key={index}>{act.activity_act}</li>
                                ))}
                            </ul>
                        </div>
                    )
                    : <p>No se han registrado actividades en el activo</p>
                }
                {detail.componentes.length > 0
                    ? (
                        <div>
                            <h3>Componentes</h3>
                            <ul>
                                {detail.componentes.map((comp, index) => (
                                    <li key={index}>{comp.name_comp_mant} - {comp.type_mant}</li>
                                ))}
                            </ul>
                        </div>
                    )
                    : <p>No se han registrado componentes en el activo</p>
                }
            </div>
        )
    }

    useEffect(() => {
        if (id_maintenance === 0) { return }

        const fetchMaintenance = async () => {
            const { data } = await getMaintenance(id_maintenance);

            if (data) setMaintenance(data);
        }

        const fetchDetails = async () => {
            const { data } = await getDetailsReport(id_maintenance);

            if (data) {
                data.forEach((detail) => {
                    detail.actividades = detail.actividades.filter((act) => act.activity_act !== null)
                    detail.componentes = detail.componentes.filter((comp) => comp.name_comp_mant !== null)
                })

                setDetails(data)
            };
        }

        fetchMaintenance();
        fetchDetails();
    }, [id_maintenance])

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
                        <h2>Ficha del Mantenimiento</h2>
                        <p>El presente documento detalla los atributos y el estado actual del mantenimiento registrado en el sistema.</p>
                    </header>
                    <div className={styles.mainSection}>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Código del mantenimiento</span>
                            <span className={styles.detail}>{maintenance?.code_mant}</span>
                        </div>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Personal</span>
                            <span className={styles.detail}>{maintenance?.type_attendant_mant}</span>
                        </div>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Encargado</span>
                            <span className={styles.detail}>{maintenance?.attendant_mant}</span>
                        </div>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Fecha inicio</span>
                            <span className={styles.detail}>{maintenance?.date_start_mant}</span>
                        </div>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Fecha fin</span>
                            <span className={styles.detail}>{maintenance?.date_end_mant ? maintenance?.date_end_mant : 'Sin fecha'}</span>
                        </div>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Estado</span>
                            <span className={styles.detail}>{maintenance?.state_mant === 1 ? 'Abierto' : 'Cerrado'}</span>
                        </div>
                    </div>
                </section>
                {maintenance?.state_mant !== 1 &&
                    <button
                        className='primary-button'
                        onClick={() => handleReopenMaintenance()}
                    >
                        Reabrir mantenimiento
                    </button>
                }
                <section className={styles.sectionPart}>
                    <header className={styles.modalHeader}>
                        <h2>Historial de Mantenimiento</h2>
                        <p>Esta parte refleja el historial completo de acciones y cambios realizados sobre el mantenimiento.</p>
                    </header>
                    <div className={styles.mainSection}>
                        <DataTableReport
                            columns={columnsMaintenanceReport()}
                            data={details}
                            getRowCanExpand={() => true}
                            renderSubComponent={renderSubComponent}
                        />
                    </div>
                </section>
            </div>
        </dialog>
    )
}

export { ModalMaintenance };