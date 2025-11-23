//#region Constants & enums

/**
 * Type de réduction client
 * @enum {number}
 */
export enum DiscountType {
    BRONZE   = 1,
    SILVER   = 2,
    GOLD     = 3,
    PLATINUM = 4
}
const DISCOUNT_RATE_BY_TYPE: Record<DiscountType, number> = {
    [DiscountType.BRONZE]  : 0,
    [DiscountType.SILVER]  : 0.1, // 10%
    [DiscountType.GOLD]    : 0.3, // 30%
    [DiscountType.PLATINUM]: 0.5  // 50%
};

const LOYALTY_DISCOUNT_RATE_PER_YEAR = 0.01; // 1%
const MAX_LOYALTY_YEARS = 5;
const AMOUNT_FOR_INEXISTENT_DISCOUNT_TYPE = 0;

//#endregion

/**
 * Calcule le montant final après application des réductions
 *
 * @param {number} amount - Montant de base avant réduction
 * @param {DiscountType} type - Type de reduction (BRONZE, SILVER, GOLD, PLATINUM)
 * @param {number} years - Nombre d'années de fidélité (plafonné à 5 ans)
 * @returns {number} Montant final après application des réductions, arrondi à 2 décimales
 */
export const calculateDiscount = (amount: number, type: DiscountType, years: number): number => {
    const discountRateByLoyaltyYears = calculateDiscountRateByLoyaltyYears(years)
    const discountRateByType = getDiscountRateByType(type)

    // TODO: Il va certainement falloir ajouter des exceptions ou autre au lieu de renvoyer 0 car ça n'a pas de sens d'avoir un article gratuit si on envoie un mauvais type de reduc
    if(!checkIfTypeExist(type)) return AMOUNT_FOR_INEXISTENT_DISCOUNT_TYPE;

    if (type === DiscountType.BRONZE) {
        return amount;
    }

    // On a besoin d'arrondir car le calcul renvoi plusieurs décimales après la virgule et ça casse les tests. Puis c'est pas logique d'avoir un prix avec plus de 2 décimales (cf: https://stackoverflow.com/questions/3163070/javascript-displaying-a-float-to-2-decimal-places)
    return round(applyDiscounts(amount, discountRateByType, discountRateByLoyaltyYears));
}

/**
 * Calcule le taux de réduction en fonction du nombre d'années de fidélité
 *
 * @param {number} years - Nombre d'années de fidélité
 * @returns {number} Taux de réduction (1% par an, plafonné à 5% car seuil de 5 ans max comptabilisé)
 */
export const calculateDiscountRateByLoyaltyYears = (years: number) => {
    const cappedYears = Math.min(years, MAX_LOYALTY_YEARS);
    return cappedYears * LOYALTY_DISCOUNT_RATE_PER_YEAR;
}

/**
 * Récupère le taux de réduction associé à un type de réduction (à la manière d'un ranking)
 *
 * @param {DiscountType} type - Type de réduction (Rank)
 * @returns {number} Taux de réduction (0 pour BRONZE, 0.1 pour SILVER, 0.3 pour GOLD, 0.5 pour PLATINUM)
 */
export const getDiscountRateByType = (type: DiscountType): number => {
    return DISCOUNT_RATE_BY_TYPE[type] ?? 0;
};

/**
 * Applique les réductions de type et de fidélité sur un montant
 *
 * @param {number} amount - Montant de base
 * @param {number} discountRateByType - Taux de réduction selon le type
 * @param {number} discountRateByLoyaltyYears - Taux de réduction selon les années de fidélité
 * @returns {number} Montant après application des réductions
 */
export const applyDiscounts = (amount: number, discountRateByType: number, discountRateByLoyaltyYears: number): number => {
    const amountAfterTypeDiscount = applyDiscount(amount, discountRateByType)
    return applyDiscount(amountAfterTypeDiscount, discountRateByLoyaltyYears)
}

/**
 * Applique un taux de réduction sur un montant
 *
 * @param {number} amount - Montant de base
 * @param {number} discountRate - Taux de réduction à appliquer (0 pour 0%, 1 pour 100%)
 * @returns {number} Montant après application de la réduction
 */
export const applyDiscount = (amount: number, discountRate: number): number => {
    return amount * (1 - discountRate);
};

/**
 * Vérifie si un type de réduction est valide
 *
 * @param {DiscountType} type - Type de réduction à vérifier
 * @returns {boolean} true si le type existe, sinon false
 */
export const checkIfTypeExist = (type: DiscountType): boolean => {
    return Object.values(DiscountType).includes(type)
}

/**
 * Arrondit un montant à 2 décimales
 *
 * @param {number} amount - Montant à arrondir
 * @returns {number} Montant arrondi à 2 décimales
 */
export const round = (amount: number): number => {
    return parseFloat(amount.toFixed(2))
}

// const assert = (expected: number, actual: number): void => {
//     if (expected !== actual)
//         console.warn(`${actual} is not equal to ${expected}`);
// }
// assert(99, calculateDiscount(100, 1, 1));
