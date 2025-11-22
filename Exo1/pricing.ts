//#region Constants & enums
export enum DiscountType {
    BRONZE = 1,
    SILVER = 2,
    GOLD = 3,
    PLATINUM = 4
}
const DISCOUNT_BY_TYPE: Record<DiscountType, number> = {
    [DiscountType.BRONZE]: 0,
    [DiscountType.SILVER]: 0.1,  // 10%
    [DiscountType.GOLD]: 0.3,    // 30%
    [DiscountType.PLATINUM]: 0.5 // 50%
};

//#endregion

// Simplify / Refactorize this function
export const calculateDiscount = (amount: number, type: DiscountType, years: number): number => {
    let result = 0;
    const discountByLoyaltyYears = (years > 5) ? 5 / 100 : years / 100;
    const discountByType = DISCOUNT_BY_TYPE[type]

    // TODO: Il va certainement falloir ajouter des exceptions ou autre au lieu de renvoyer 0 car ça n'a pas de sens d'avoir un article gratuit si on envoie un mauvais type de reduc
    if(!checkIfTypeExist(type)) return result;

    if (type === DiscountType.BRONZE) {
        return amount;
    }

    result = computeDiscount(amount, discountByType, discountByLoyaltyYears)

    return result;
}

const computeDiscount = (amount: number, discountByType: number, discountByLoyaltyYears: number): number => {
    return (amount - (discountByType * amount)) - discountByLoyaltyYears * (amount - (discountByType * amount));
}

const checkIfTypeExist = (type: DiscountType): boolean => {
    return Object.values(DiscountType).includes(type)
}

// const assert = (expected: number, actual: number): void => {
//     if (expected !== actual)
//         console.warn(`${actual} is not equal to ${expected}`);
// }
// assert(99, calculateDiscount(100, 1, 1));
