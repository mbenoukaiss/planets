export function within(val, base, variation) {
    if (val > base + variation) {
        return base + variation;
    } else if (val < base - variation) {
        return base - variation;
    }

    return val;
}
