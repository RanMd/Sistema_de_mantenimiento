import { FC, useState, useEffect, useCallback, JSX, ChangeEvent, useId } from 'react';
import { ActivoToSave, ProcesoCompra, Ubicacion } from '../models/Active';
import { getCategories, getTypesPerCategory, getBrandsPerCategory, getUbicaciones, getLastId, saveActive, getProcesses } from '../services/ActiveService';
import { ComboBoxInput } from './Input';
import styles from '../styles/modules/modal.module.css';
import clsx from 'clsx';
import readData from '../util/readFormat';

interface ModalCrearActivoProps {
    isOpen: boolean;
    setIsOpen: ((isOpen: boolean) => void) | null;
}

const ModalCrearActivo: FC<ModalCrearActivoProps> = ({ isOpen, setIsOpen }) => {
    const [categories, setCategories] = useState<string[]>([])
    const [types, setTypes] = useState<string[]>([]);
    const [brands, setBrands] = useState<string[]>([]);
    const [ubicaciones, setUbicaciones] = useState<Ubicacion[]>([]);
    const [processes, setProcesses] = useState<ProcesoCompra[]>([]);
    const [lastId, setLastId] = useState<string>('');

    const [activeCode, setActiveCode] = useState<string>('');
    const [categoryActive, setCategoryActive] = useState<string>('');
    const [typeActive, setTypeActive] = useState<string>('');
    const [nameActive, setNameActive] = useState<string>('');
    const [ubication, setUbication] = useState<number>(0);
    const [producerActive, setProducerActive] = useState<string>('');
    const [processActive, setProcessActive] = useState<string>('');

    const [file, setFile] = useState<File | null>(null);

    const [message, setMessage] = useState<JSX.Element | null>(null);

    const codeClass = clsx(styles.detail, styles.detailReadOnly);

    // Fetchs

    const fetchCategories = useCallback(async () => {
        const { data } = await getCategories();

        setCategories(data)
    }, [])

    const fetchTypes = useCallback(async (category: string) => {
        const { data } = await getTypesPerCategory(category);

        setTypes(data);
    }, [])

    const fetchBrands = useCallback(async (category: string) => {
        const { data } = await getBrandsPerCategory(category);

        setBrands(data);
    }, [])

    const fetchUbicaciones = useCallback(async () => {
        const { data } = await getUbicaciones()

        setUbicaciones(data);
    }, [])

    const fetchLastId = useCallback(async () => {
        let { data } = await getLastId();
        data += 1
        setLastId(data.toString());
    }, [])

    const fetchProcesses = useCallback(async () => {
        const { data } = await getProcesses();

        setProcesses(data);
    }, [])

    // Handlers

    const handleClose = useCallback(() => {
        if (setIsOpen) {
            setIsOpen(false);
        }
    }, [setIsOpen])

    const handleCategory = (value: string) => {
        const categoryCode = value.substring(0, 3).toUpperCase();

        if (categoryCode !== categoryActive) {
            setActiveCode('');
            setTypeActive('');
            fetchTypes(value);
            fetchBrands(value);
        }

        setCategoryActive(categoryCode);
    }

    const handleType = (value: string) => {
        setTypeActive(value);
    }

    const handleProducer = (value: string) => {
        setProducerActive(value);
    }

    const handleUbication = (value: number) => {
        setUbication(value);
    }

    const handleProcess = (value: number) => {
        setProcessActive(value.toString());
        console.log(value)
    }

    const handleSubmit = async () => {
        if (categoryActive === ''
            || typeActive === ''
            || nameActive === ''
            || ubication === 0
            || producerActive === ''
            || processActive === '') {
            if (!file) {
                createMessage(true, 'Por favor, complete todos los campos antes de enviar o suba un archivo.');
                return;
            }

            analyzeFile();
            return;
        }

        setMessage(null);

        const activeData: ActivoToSave = {
            name_act: nameActive,
            brand_act: producerActive,
            code_act: activeCode,
            type_act: typeActive,
            ubication_act: ubication,
            buy_process_act: processActive
        }

        const { success } = await saveActive(activeData);

        if (success) {
            createMessage(false, 'Activo creado exitosamente.');
        } else {
            createMessage(true, 'Hubo un error al crear el activo. Intente nuevamente.');
        }
    }

    const handleFile = (event: ChangeEvent) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) { setFile(file) };
    }

    const analyzeFile = async () => {
        if (!file) return;

        if (file.name.split('.').pop() !== 'xlsx') {
            createMessage(true, 'El archivo no sigue el formato correcto. Descargue el formato y vuelva a intentarlo.');
            return;
        }

        const data = await readData(file);

        const { actives, error, numActives } = analizeData(data);

        if (error) {
            createMessage(true, 'El archivo contiene errores o campos vacios. Corríjalos y vuelva a intentarlo.');
            return;
        }

        actives.forEach(async (active) => {
            await saveActive(active)
        })

        setFile(null);
        createMessage(false, 'Se crearon exitosamente ' + numActives + ' activos.');
    }

    type FormatData = {
        Categoria: string,
        Marca: string,
        Nombre: string,
        Proceso: string,
        Tipo: string,
        Ubicacion: string
    }

    const analizeData = (data: unknown[]) => {
        if (data.length === 0) { return { actives: [], error: true } }

        let numActives = 0
        const actives: ActivoToSave[] = [];

        data.forEach((row, index) => {
            const { Categoria, Marca, Nombre, Proceso, Tipo, Ubicacion } = row as FormatData;

            if (!Categoria || !Marca || !Nombre || !Proceso || !Tipo || !Ubicacion) {
                return;
            }

            numActives++;
            const categoryCode = Categoria.substring(0, 3).toUpperCase();
            const typeCode = Tipo.substring(0, 3).toUpperCase();
            const brandCode = Marca.substring(0, 3).toUpperCase();

            const id = parseInt(lastId) + (1 * index);
            const code = `${categoryCode}-${typeCode}${id.toString().padStart(4, '0')}${brandCode}`;

            const ubication = Ubicacion.split(' ')[0];
            const process = Proceso.split(' ')[0];

            actives.push({
                name_act: Nombre,
                brand_act: Marca,
                code_act: code,
                type_act: Tipo,
                ubication_act: parseInt(ubication),
                buy_process_act: process
            })
        })

        if (numActives === 0) {
            return { actives: [], error: true };
        }

        return { actives, error: false, numActives };
    }


    // Create Code

    useEffect(() => {
        if (categoryActive === '') return;
        let code = `${categoryActive}-`;

        if (typeActive !== '') {
            const typeCode = typeActive.substring(0, 3).toUpperCase();
            const id = lastId.padStart(4, '0');
            code += `${typeCode}${id}`;
        }

        if (producerActive !== '') {
            const producerCode = producerActive.substring(0, 3).toUpperCase();
            code += producerCode;
        }

        setActiveCode(code);
    }, [categoryActive, typeActive, producerActive, lastId])

    useEffect(() => {
        fetchCategories()
        fetchUbicaciones()
        fetchLastId()
        fetchProcesses()
    }, [fetchCategories, fetchLastId, fetchUbicaciones, fetchProcesses])

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
                        <h2>Crear activo</h2>
                        <p>Complete los detalles del activo en el formulario a continuación.
                            Asegúrese de que toda la información sea precisa antes de enviarla.
                        </p>
                    </header>
                    {message}
                    <div className={styles.mainSection}>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Código del activo</span>
                            <span className={codeClass}>{activeCode}</span>
                        </div>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Categoria</span>
                            <ComboBoxInput
                                setOption={(value) => handleCategory(value)}
                                placeholder='Seleccione una categoria'
                                className={styles.comboBox}
                            >
                                <span>Ninguna</span>
                                {categories.map((category, index) => (
                                    <span key={index}>{category}</span>
                                ))}
                            </ComboBoxInput>
                        </div>
                        {
                            categoryActive !== '' && <>
                                <div className={styles.groupInfo}>
                                    <span className={styles.infoLabel}>Tipo</span>
                                    <ComboBoxInput
                                        setOption={(value) => handleType(value)}
                                        placeholder='Seleccione un tipo'
                                        className={styles.comboBox}
                                    >
                                        <span>Ninguno</span>
                                        {types.map((type, index) => (
                                            <span key={index}>{type}</span>
                                        ))}
                                    </ComboBoxInput>
                                </div>
                                <div className={styles.groupInfo}>
                                    <span className={styles.infoLabel}>Marca</span>
                                    <ComboBoxInput
                                        setOption={(value) => handleProducer(value)}
                                        placeholder='Seleccione un proveedor'
                                        className={styles.comboBox}
                                    >
                                        <span>Ninguna</span>
                                        {brands.map((brand, index) => (
                                            <span key={index}>{brand}</span>
                                        ))}
                                    </ComboBoxInput>
                                </div>
                                <div className={styles.groupInfo}>
                                    <span className={styles.infoLabel}>Ubicación</span>
                                    <ComboBoxInput
                                        setOption={(value) => console.log(value)}
                                        placeholder='Seleccione una ubicación'
                                        className={styles.comboBox}
                                    >
                                        <span>Ninguna</span>
                                        {ubicaciones.map((ubicacion) => (
                                            <span
                                                key={ubicacion.id_ubi}
                                                onClick={() => handleUbication(ubicacion.id_ubi)}
                                            >
                                                {ubicacion.edificio.name_edi} - Piso {ubicacion.floor_ubi} - {ubicacion.name_ubi}
                                            </span>
                                        ))}
                                    </ComboBoxInput>
                                </div>
                                <div className={styles.groupInfo}>
                                    <span className={styles.infoLabel}>Proceso de compra</span>
                                    <ComboBoxInput
                                        setOption={(value) => console.log(value)}
                                        placeholder='Seleccione un proceso de compra'
                                        className={styles.comboBox}
                                    >
                                        <span>Ninguno</span>
                                        {processes.map((process) => (
                                            <span
                                                key={process.id_proc}
                                                onClick={() => handleProcess(process.id_proc)}
                                            >
                                                {process.code_proc}
                                            </span>
                                        ))}
                                    </ComboBoxInput>
                                </div>
                                <div className={styles.groupInfo}>
                                    <span className={styles.infoLabel}>Nombre</span>
                                    <input type="text" className={styles.inputModal} onChange={(e) => setNameActive(e.target.value)} />
                                </div>
                            </>
                        }
                    </div>
                </section>
                <section className={styles.sectionPart}>
                    <header className={styles.modalHeader}>
                        <h2>Crea activo por lotes</h2>
                        <span>Suba un archivo en formato CSV con los detalles de los activos.
                            Asegúrese de que el archivo siga el formato correcto antes de cargarlo.&nbsp;
                            <a
                                className={styles.linkFormat}
                                download={'Formato.xlsx'}
                                href='/Formato.xlsx'
                            >
                                Descarga aquí el formato.
                            </a>
                        </span>
                    </header>
                    <InputFile handleFile={handleFile} />
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

const InputFile = ({ handleFile }: { handleFile: (event: ChangeEvent) => void }) => {
    const uniqueId = useId();
    const [labelText, setLabelText] = useState('Seleccionar archivo');

    const handleFileChange = (event: ChangeEvent) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        setLabelText(file?.name || 'Seleccionar archivo');
        handleFile(event);
    }

    return (
        <div className={styles.mainSection}>
            <input
                type="file"
                accept=".xlsx"
                id={uniqueId}
                onChange={handleFileChange}
                className={styles.inputFile}
            />
            <label htmlFor={uniqueId} className={styles.fileInputLabel}>{labelText}</label>
        </div>
    )
}

export { ModalCrearActivo }