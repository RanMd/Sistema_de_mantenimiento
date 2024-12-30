import { ChangeEvent, FC, ReactNode, useEffect, useRef, useState } from 'react';
import styles from '../styles/modules/input.module.css';

interface InputBaseProps {
    type?: string;
    value?: string;
    onChange?: (e: ChangeEvent) => void;
}

interface InputProps extends InputBaseProps {
    textFloating?: string;
    required?: boolean;
    disabled?: boolean;
    mayus?: boolean;
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

const arrowIcon = (
    <svg fill="currentColor"
        className={styles.ComboBoxIcon}
        height="200px"
        width="200px"
        version="1.1" id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 55.752 55.752" xmlSpace="preserve">
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
            <g>
                <path d="M43.006,23.916c-0.28-0.282-0.59-0.52-0.912-0.727L20.485,1.581c-2.109-2.107-5.527-2.108-7.637,0.001 c-2.109,2.108-2.109,5.527,0,7.637l18.611,18.609L12.754,46.535c-2.11,2.107-2.11,5.527,0,7.637c1.055,1.053,2.436,1.58,3.817,1.58 s2.765-0.527,3.817-1.582l21.706-21.703c0.322-0.207,0.631-0.444,0.912-0.727c1.08-1.08,1.598-2.498,1.574-3.912 C44.605,26.413,44.086,24.993,43.006,23.916z"></path>
            </g>
        </g>
    </svg>
)

interface ComboBoxInputProps extends InputBaseProps {
    placeholder?: string,
    children: ReactNode,
}

const ComboBoxInput: FC<ComboBoxInputProps> = ({ children }) => {
    const [option, setOption] = useState<string>('');
    const divRef = useRef<HTMLDivElement>(null);

    const handleChangeOption = (newOption: EventTarget) => {
        const element = (newOption as HTMLLIElement)
        setOption(element.textContent!)
    }

    useEffect(() => {
        const elementReference = divRef.current;
        if (elementReference) {
            elementReference.style.minWidth = `${elementReference.clientWidth}px`;
        }
    }, [])

    return (
        <div className={styles.inputBox} ref={divRef}>
            <input
                className={styles.ComboBoxCheck}
                type='checkbox'
                id='filterType'
            />
            <label
                htmlFor="filterType"
                className={styles.ComboBoxLabel}
            >
                {
                    option === '' ?
                        children :
                        <span className={styles.ComboBoxTag}>
                            {option}
                        </span>
                }
                {arrowIcon}
            </label>
            <ul className={styles.ComboBoxData}>
                <li
                    className={styles.ComboBoxItem}
                    onClick={({ target }) => handleChangeOption(target)}
                >
                    <span>Monitor</span>
                </li>
                <li
                    className={styles.ComboBoxItem}
                    onClick={({ target }) => handleChangeOption(target)}
                >
                    <span>PC</span>
                </li>
            </ul>
        </div>
    )
}



export { InputFloatingWithIcon, InputFloating, ComboBoxInput };