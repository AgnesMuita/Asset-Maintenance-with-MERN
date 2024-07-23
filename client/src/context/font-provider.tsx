import { createContext, useContext, useEffect, useState } from "react";

type Font =
    | "inter"
    | "manrope"
    | "System"
    | "roboto"
    | "roboto-mono"
    | "ubuntu"
    | "ubuntu-mono"
    | "titillium-web"
    | "quicksand"
    | "poppins"
    | "montserrat"
    | "rubik"
    | "merriweather"
    | "inconsolata"
    | "pt-sans"
    | "open-sans";

type FontProviderProps = {
    children: React.ReactNode;
    defaultFont?: Font;
    storageKey?: string;
};

type FontProviderState = {
    font: Font;
    setFont: (font: Font) => void;
};

const initialState: FontProviderState = {
    font: "System",
    setFont: () => null,
};

const FontProviderContext = createContext<FontProviderState>(initialState);

export function FontProvider({
    children,
    defaultFont = "System",
    storageKey = "deer-ui-font",
    ...props
}: FontProviderProps) {
    const [font, setFont] = useState<Font>(
        () => (localStorage.getItem(storageKey) as Font) || defaultFont
    );

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove(
            "font-inter",
            "font-manrope",
            "font-roboto",
            "font-robotomono",
            "font-ubuntu",
            "font-ubuntumono",
            "font-opensans",
            "font-titillium",
            "font-quicksand",
            "font-inconsolata",
            "font-merriweather",
            "font-ptsans",
            "font-rubik",
            "font-poppins",
            "font-montserrat",
            "font-sans"
        );

        const systemFont =
            font === "System"
                ? "font-sans"
                : font === "inter"
                    ? "font-inter"
                    : font === "manrope"
                        ? "font-manrope"
                        : font === "roboto"
                            ? "font-roboto"
                            : font === "roboto-mono"
                                ? "font-robotomono"
                                : font === "ubuntu"
                                    ? "font-ubuntu"
                                    : font === "ubuntu-mono"
                                        ? "font-ubuntumono"
                                        : font === "open-sans"
                                            ? "font-opensans"
                                            : font === "pt-sans"
                                                ? "font-ptsans"
                                                : font === "montserrat"
                                                    ? "font-montserrat"
                                                    : font === "poppins"
                                                        ? "font-poppins"
                                                        : font === "inconsolata"
                                                            ? "font-inconsolata"
                                                            : font === "quicksand"
                                                                ? "font-quicksand"
                                                                : font === "merriweather"
                                                                    ? "font-merriweather"
                                                                    : font === "rubik"
                                                                        ? "font-rubik"
                                                                        : font === "titillium-web"
                                                                            ? "font-titillium"
                                                                            : "font-sans";
        root.classList.add(systemFont);
    }, [font]);

    const value = {
        font,
        setFont: (font: Font) => {
            localStorage.setItem(storageKey, font);
            setFont(font);
        },
    };

    return (
        <FontProviderContext.Provider {...props} value={value}>
            {children}
        </FontProviderContext.Provider>
    );
}

export const useFont = () => {
    const context = useContext(FontProviderContext);

    if (context === undefined)
        throw new Error("useFont must be used within a FontProvider");

    return context;
};
