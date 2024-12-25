import { useState } from 'react'
import styles from '../styles/modules/modal.module.css'

const Modal = () => {
    const [isOpen, setIsOpen] = useState<boolean>(true)

    const handleClose = () => {
        setIsOpen(!isOpen);
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
                        <h2>Ficha de Activo</h2>
                        <p>El presente documento detalla las características y el estado actual del activo registrado en el inventario.</p>
                    </header>
                    <div className={styles.mainSection}>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Código del activo</span>
                            <span className={styles.detail}>MON00000012DEL</span>
                        </div>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Nombre</span>
                            <span className={styles.detail}>Monitor01</span>
                        </div>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Ubicación</span>
                            <span className={styles.detail}>FISEI - Piso2 - Laboratorio CTT</span>
                        </div>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Tipo</span>
                            <span className={styles.detail}>Monitor</span>
                        </div>
                        <div className={styles.groupInfo}>
                            <span className={styles.infoLabel}>Marca</span>
                            <span className={styles.detail}>DELL</span>
                        </div>
                    </div>
                </section>
                <section className={styles.sectionPart}>
                    <header className={styles.modalHeader}>
                        <h2>Historial de Activos</h2>
                        <p>Esta parte refleja el historial completo de acciones y cambios realizados sobre el activo.</p>
                    </header>
                    <div className={styles.mainSection}>
                    </div>
                </section>
                <footer className={styles.modalFooter}>
                    <button className='primary-button'>Save changes</button>
                </footer>
            </div>
        </dialog>
    )
}

export default Modal;

// import React, { useState } from 'react';

// const Modal = () => {
//   // Estado para controlar si el modal está abierto o cerrado
//   const [isOpen, setIsOpen] = useState(false);

//   // Función para abrir el modal
//   const openModal = () => {
//     setIsOpen(true);
//   };

//   // Función para cerrar el modal
//   const closeModal = () => {
//     setIsOpen(false);
//   };

//   return (
//     <div>
//       <button onClick={openModal}>Abrir Modal</button>

//       {/* El elemento dialog que será el modal */}
//       <dialog open={isOpen}>
//         <div>
//           <h2>Este es un modal</h2>
//           <p>Puedes poner el contenido que quieras aquí.</p>
//           <button onClick={closeModal}>Cerrar Modal</button>
//         </div>
//       </dialog>
//     </div>
//   );
// };

// export default Modal;