import {
    CogIcon,
    MoonIcon,
    SunIcon,
    Theme,
    useTheme,
} from "@paul-clavier/mugiwara";
import IconButton from "../IconButton/IconButton";

const getNextTheme = (theme: Theme) => {
    switch (theme) {
        case "light":
            return "dark";
        case "dark":
            return "os";
        case "os":
            return "light";
    }
};

const IconFromTheme = ({ theme }: { theme: Theme }) => {
    switch (theme) {
        case "light":
            return <SunIcon />;
        case "dark":
            return <MoonIcon />;
        case "os":
            return <CogIcon />;
    }
};

const ThemeButton = ({ className }: { className?: string }) => {
    const { theme, setTheme } = useTheme();
    return (
        <IconButton
            className={className}
            onClick={() => setTheme((theme) => getNextTheme(theme))}
            variant="outlined"
        >
            <IconFromTheme theme={theme} />
        </IconButton>
    );
};

export default ThemeButton;
