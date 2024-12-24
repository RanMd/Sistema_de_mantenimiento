import { ChangeEvent } from 'react';
import styles from '../styles/modules/input.module.css';

interface InputProps {
    textFloating?: string;
    type?: string;
    value?: string;
    required?: boolean;
    disabled?: boolean;
    mayus?: boolean;
    onChange?: (e: ChangeEvent) => void;
}

const InputFloating = ({ textFloating, required, disabled, value, type, onChange, mayus }: InputProps) => {
    return (
        <div className={styles.inputBox}>
            <input
                type={type}
                onChange={onChange}
                required={required}
                disabled={disabled}
                value={value}
                className={mayus ? styles.mayus : ''}
            />
            <span className={styles.label}>{textFloating}</span>
        </div>
    );
}

interface InputFloatingWithIconProps extends InputProps {
    handleIcon?: () => void;
    icon?: string;
}

const InputFloatingWithIcon = ({ textFloating,
    required,
    disabled,
    value,
    icon,
    handleIcon,
    type,
    onChange,
    mayus
}: InputFloatingWithIconProps) => {
    return (
        <div className={styles.inputBox}>
            <input
                type={type}
                onChange={onChange}
                required={required}
                disabled={disabled}
                value={value}
                className={mayus ? styles.mayus : ''}
            />
            <span className={styles.label}>{textFloating}</span>
            {icon && <img src={icon} alt='icon' onClick={handleIcon} />}
        </div>
    );
}

export { InputFloatingWithIcon, InputFloating };