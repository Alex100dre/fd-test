//#region Constants & enums
export enum DiscountType {
    BRONZE = 1,
    SILVER = 2,
    GOLD = 3,
    PLATINUM = 4
}
const DISCOUNT_RATE_BY_TYPE: Record<DiscountType, number> = {
    [DiscountType.BRONZE]: 0,
    [DiscountType.SILVER]: 0.1,  // 10%
    [DiscountType.GOLD]: 0.3,    // 30%
    [DiscountType.PLATINUM]: 0.5 // 50%
};

const LOYALTY_DISCOUNT_RATE_PER_YEAR = 0.01; // 1%
const MAX_LOYALTY_YEARS = 5;

//#endregion

// Simplify / Refactorize this function
export const calculateDiscount = (amount: number, type: DiscountType, years: number): number => {
    let result = 0;
    const discountByLoyaltyYears = calculateDiscountRateByLoyaltyYears(years)
    const discountRateByType = getDiscountRateByType(type)

    // TODO: Il va certainement falloir ajouter des exceptions ou autre au lieu de renvoyer 0 car ça n'a pas de sens d'avoir un article gratuit si on envoie un mauvais type de reduc
    if(!checkIfTypeExist(type)) return result;

    if (type === DiscountType.BRONZE) {
        return amount;
    }

    result = applyDiscount(amount, discountRateByType, discountByLoyaltyYears)

    return result;
}

export const calculateDiscountRateByLoyaltyYears = (years: number) => {
    const cappedYears = Math.min(years, MAX_LOYALTY_YEARS);
    return cappedYears * LOYALTY_DISCOUNT_RATE_PER_YEAR;
}

export const getDiscountRateByType = (type: DiscountType): number => {
    return DISCOUNT_RATE_BY_TYPE[type] ?? 0;
};

export const applyDiscount = (amount: number, discountRateByType: number, discountByLoyaltyYears: number): number => {
    // On a besoin d'arrondir car le calcul renvoi plusieurs décimales après la virgule et ça casse les tests. Puis c'est pas logique d'avoir un prix avec plus de 2 décimales (cf: https://stackoverflow.com/questions/3163070/javascript-displaying-a-float-to-2-decimal-places)
    return round(amount * (1 - discountByLoyaltyYears) * (1 - discountRateByType));
}

export const checkIfTypeExist = (type: DiscountType): boolean => {
    return Object.values(DiscountType).includes(type)
}

export const round = (amount: number): number => {
    return parseFloat(amount.toFixed(2))
}

// const assert = (expected: number, actual: number): void => {
//     if (expected !== actual)
//         console.warn(`${actual} is not equal to ${expected}`);
// }
// assert(99, calculateDiscount(100, 1, 1));
