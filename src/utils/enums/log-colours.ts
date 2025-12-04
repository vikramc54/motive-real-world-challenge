enum AnsiColour {
    Red = "\x1b[31m",
    Green = "\x1b[32m",
    Yellow = "\x1b[33m",
    Blue = "\x1b[34m",
    Magenta = "\x1b[35m",
    Cyan = "\x1b[36m",
    LightGray = "\x1b[37m",

    DarkGray = "\x1b[90m",
    LightRed = "\x1b[91m",
    LightGreen = "\x1b[92m",
    LightYellow = "\x1b[93m",
    LightBlue = "\x1b[94m",
    LightMagenta = "\x1b[95m",
    LightCyan = "\x1b[96m",
    White = "\x1b[97m",
}
export default AnsiColour;

export const AnsiReset = "\x1b[0m";
