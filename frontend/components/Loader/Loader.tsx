import { LoadingIcon } from "@nw-tech/joule-spin";
import styles from "./Loader.module.css";

const Loader = () => {
    return (
        <div className={styles.root}>
            <LoadingIcon className={styles.loadingIcon} />
        </div>
    );
};

export default Loader;
