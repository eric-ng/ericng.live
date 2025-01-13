/**
 * Convert seconds to minutes
 * Rounded
 */
export const StoM = (s) => {
    const m = Math.floor(s / 60);
    if (m === 0) {
        return 1;
    } else {
        if (s % 60 < 30) {
            return m;
        } else {
            return m + 1;
        }
    }
}