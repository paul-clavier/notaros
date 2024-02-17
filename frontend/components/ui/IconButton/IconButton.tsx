import { LoadingIcon } from "@paul-clavier/mugiwara";
import classnames from "classnames";
import { ForwardedRef, forwardRef, ReactElement } from "react";
import styles from "./IconButton.module.css";

export interface IconButtonProps {
    className?: string;
    variant?: "outlined";
    disabled?: boolean;
    loading?: boolean;
    onClick?: () => void;
    submit?: boolean;
    ariaLabel?: string | undefined;
    ariaCurrent?: boolean; // Pagination
    children: ReactElement;
}

const IconButton = (
    {
        className,
        disabled = false,
        loading = false,
        onClick = () => {
            /* no-op */
        },
        submit = false,
        ariaLabel,
        ariaCurrent,
        children,
    }: IconButtonProps,
    ref: ForwardedRef<HTMLButtonElement>,
) => {
    return (
        <button
            ref={ref}
            type={submit ? "submit" : "button"}
            disabled={disabled || loading}
            onClick={onClick}
            className={classnames(className, styles.button)}
            aria-label={ariaLabel}
            aria-current={ariaCurrent}
        >
            {loading ? <LoadingIcon className={styles.loading} /> : children}
        </button>
    );
};

export default forwardRef(IconButton);
