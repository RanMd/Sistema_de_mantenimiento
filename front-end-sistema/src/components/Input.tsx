import { ChangeEvent } from 'react';
import styles from '../styles/modules/input.module.css';

interface InputProps {
    text?: string;
    required?: boolean;
    disabled?: boolean;
    value?: string;
    icon?: string;
    type?: string;
    onChange?: (e: ChangeEvent) => void;
    handleIcon?: () => void;
    mayus?: boolean;
}


const Input = ({ text, required, disabled, value, icon, handleIcon, type, onChange, mayus }: InputProps) => {
    return <div className={styles.inputBox}>
        <input
            type={type}
            name="user"
            id="user"
            onChange={onChange}
            required={required}
            disabled={disabled}
            value={value}
            className={mayus ? styles.mayus : 'rojo'}
        />
        <span className={styles.label}>{text}</span>
        {icon && <img src={icon} alt='icon' onClick={handleIcon}/>}
    </div>
}

export default Input;