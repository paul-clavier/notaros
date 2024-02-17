import {
    EditIcon,
    HomeIcon,
    MagicIcon,
    SendIcon,
} from "@paul-clavier/mugiwara";
import classNames from "classnames";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import styles from "./Navigation.module.css";

const NAVIGATION_MENU = [
    {
        name: "home",
        label: "navigation.home",
        link: "",
        icon: <HomeIcon />,
    },
    {
        name: "draft-registry",
        label: "navigation.draftRegistry",
        link: "draft-registry",
        icon: <EditIcon />,
    },
    {
        name: "raised-hand",
        label: "navigation.raisedHand",
        link: "raised-hand",
        icon: <SendIcon />,
    },
    {
        name: "taxes",
        label: "navigation.taxes",
        link: "taxes",
        icon: <MagicIcon />,
    },
];

interface NavigationProps {
    className?: string;
}

// TODO: Refactor using Shadcn side menu like here: https://ui.shadcn.com/examples/mail
const Navigation = ({ className }: NavigationProps) => {
    const { t } = useTranslation();
    return (
        <nav className={classNames(styles.root, className)}>
            {NAVIGATION_MENU.map((item) => (
                <Link
                    key={item.name}
                    href={`/${item.link}`}
                    className={styles.link}
                >
                    {item.icon}
                    <h3>{t(item.label)}</h3>
                </Link>
            ))}
        </nav>
    );
};

export default Navigation;
