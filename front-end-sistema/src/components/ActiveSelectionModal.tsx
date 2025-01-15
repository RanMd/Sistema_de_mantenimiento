import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { TableComponent } from '../pages/Actives';
import { columnsActive } from '../tables/columns';
import { Row, Table } from '@tanstack/react-table';
import { ActiveToTable } from '../models/Active';
import { getActivesFree } from '../services/ActiveService';
import styles from '../styles/modules/modal.module.css';

interface AddActivesModalProps {
    isOpen: boolean;
    setIsOpen: ((isOpen: boolean) => void) | null;
    handleSelectedActivos?: (actives: Row<ActiveToTable>[]) => void;
}

const ActiveSelectionModal: FC<AddActivesModalProps> = ({ isOpen, setIsOpen, handleSelectedActivos }) => {
    const [countRowsSelected, setCountRowsSelected] = useState(0);
    const tableRef = useRef<Table<ActiveToTable>>(null);
    const [actives, setActives] = useState<ActiveToTable[]>([]);

    const fetchActives = useCallback(async () => {
        const { data } = await getActivesFree()

        if (data) { setActives(data) }
    }, [])

    const handleClose = useCallback(() => {
        if (setIsOpen) {
            setIsOpen(false);
        }
    }, [setIsOpen])

    const handleAddActivos = useCallback(() => {
        handleSelectedActivos!(tableRef.current?.getFilteredSelectedRowModel().rows || []);
        handleClose();
    }, [handleClose, handleSelectedActivos])

    useEffect(() => {
        fetchActives();
    }, [fetchActives])

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
                        <h2>Buscar activos</h2>
                        <p>Selecciona todos los activos que deseas agregar al mantenimiento</p>
                    </header>
                </section>
                <section className={styles.sectionPart}>
                    <TableComponent
                        columns={columnsActive(false, undefined, true, setCountRowsSelected)}
                        pageSize={5}
                        ref={tableRef}
                        data={actives}
                    />
                    <button
                        className='primary-button'
                        style={{ alignSelf: 'end' }}
                        disabled={countRowsSelected === 0}
                        onClick={() => {
                            if (handleSelectedActivos) {
                                handleAddActivos();
                            }
                        }}
                    >
                        Añadir {countRowsSelected} activos
                    </button>
                </section>
            </div>
        </dialog>
    )
}

export { ActiveSelectionModal }