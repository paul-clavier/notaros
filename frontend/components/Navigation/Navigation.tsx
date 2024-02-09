import {
    BookIcon,
    BulbIcon,
    CogIcon,
    DropIcon,
    HomeIcon,
    LightningIcon,
    MagicIcon,
    MapIcon,
    SinusoidIcon,
    SwitchIcon,
} from "@nw-tech/joule-spin";
import classNames from "classnames";
import styles from "./Navigation.module.css";
import Link from "next/link";
import { useTranslation } from "react-i18next";

const NAVIGATION_MENU = [
    {
        name: "general",
        label: "navigation.general",
        link: "",
        icon: <HomeIcon />,
    },
    {
        name: "unifilaire",
        label: "navigation.unifilaire",
        link: "unifilaire",
        icon: <SwitchIcon />,
    },
    {
        name: "sequence",
        label: "navigation.sequence",
        link: "sequence",
        icon: <MagicIcon />,
    },
    {
        name: "afe",
        label: "navigation.afe",
        link: "afe",
        icon: <SinusoidIcon />,
    },
    {
        name: "batteries",
        label: "navigation.batteries",
        link: "batteries",
        icon: <LightningIcon />,
    },
    {
        name: "hvac",
        label: "navigation.hvac",
        link: "hvac",
        icon: <DropIcon />,
    },
    {
        name: "alarms",
        label: "navigation.alarms",
        link: "alarms",
        icon: <BulbIcon />,
    },
    {
        name: "historic",
        label: "navigation.historic",
        link: "historic",
        icon: <BookIcon />,
    },
    {
        name: "roundtrip",
        label: "navigation.roundtrip",
        link: "roundtrip",
        icon: <MapIcon />,
    },
    {
        name: "settings",
        label: "navigation.settings",
        link: "settings",
        icon: <CogIcon />,
    },
];

interface NavigationProps {
    className?: string;
}

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
