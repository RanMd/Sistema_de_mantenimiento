import styles from '../styles/modules/serchingOverlay.module.css';

const SearchingOverlay = () => {
    const searchIcon = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" width="200" height="200"
                xmlnsXlink="http://www.w3.org/1999/xlink">
                <circle
                    stroke-dasharray="164.93361431346415 56.97787143782138"
                    r="35"
                    stroke-width="10"
                    stroke="#fff"
                    fill='none'
                    cy="50"
                    cx="50"
                    transform="matrix(1,0,0,1,0,0)">
                </circle>
            </svg>
        )
    }

    return (
        <div className={styles.searching}>
            {searchIcon()}
        </div>
    )
}

export { SearchingOverlay };