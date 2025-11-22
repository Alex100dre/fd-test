import { calculateDiscount } from './pricing';

describe('calculateDiscount', () => {
    describe('Type 1 - Aucune remise', () => {
        it("devrait retourner le montant complet avec 0 année de fidélité", () => {
            expect(calculateDiscount(100, 1, 0)).toBe(100);
        });

        it("devrait retourner le montant complet avec 1 année de fidélité", () => {
            expect(calculateDiscount(100, 1, 1)).toBe(100);
        });

        it("devrait retourner le montant complet avec 3 années de fidélité", () => {
            expect(calculateDiscount(100, 1, 3)).toBe(100);
        });

        it("devrait retourner le montant complet avec 5 années de fidélité", () => {
            expect(calculateDiscount(100, 1, 5)).toBe(100);
        });

        it("devrait retourner le montant complet avec plus de 5 années de fidélité", () => {
            expect(calculateDiscount(100, 1, 10)).toBe(100);
            expect(calculateDiscount(100, 1, 20)).toBe(100);
        });
    });

    describe('Type 2 - Remise de base 10%', () => {
        it("devrait appliquer 10% de remise avec 0 année de fidélité", () => {
            expect(calculateDiscount(100, 2, 0)).toBe(90);
        });

        it("devrait appliquer 10% + 1% avec 1 année de fidélité", () => {
            // 100 (prix de base) - 10% (car type 2) = 90, puis 90 - 1% (car 1 année) = 89.1
            expect(calculateDiscount(100, 2, 1)).toBe(89.1);
        });

        it("devrait appliquer 10% + 3% avec 3 années de fidélité", () => {
            // 100 - 10% = 90, puis 90 - 3% (car 3 années) = 87.3
            expect(calculateDiscount(100, 2, 3)).toBe(87.3);
        });

        it('devrait appliquer 10% + 5% avec 5 années de fidélité', () => {
            // 100 - 10% = 90, puis 90 - 5% (car 5 années) = 85.5
            expect(calculateDiscount(100, 2, 5)).toBe(85.5);
        });

        it('devrait plafonner la remise fidélité à 5% avec plus de 5 années', () => {
            // 100 - 10% = 90, puis 90 - 5% (car plafond 5 années même si 10) = 85.5
            expect(calculateDiscount(100, 2, 10)).toBe(85.5);
        });

        it('devrait fonctionner avec des montants différents', () => {
            expect(calculateDiscount(200, 2, 2)).toBe(176.4);
        });
    });

    describe('Type 3 - Remise de base 30%', () => {
        it("devrait appliquer 30% de remise avec 0 année de fidélité", () => {
            expect(calculateDiscount(100, 3, 0)).toBe(70);
        });

        it("devrait appliquer 30% + 1% avec 1 année de fidélité", () => {
            // 100 (prix de base) - 30% (car type 3) = 70, puis 70 - 1% (car 1 année) = 69.3
            expect(calculateDiscount(100, 3, 1)).toBe(69.3);
        });

        it("devrait appliquer 30% + 3% de fidélité avec 3 années", () => {
            expect(calculateDiscount(100, 3, 3)).toBe(67.9);
        });

        it('devrait plafonner la remise fidélité à 5% avec 5 années', () => {
            expect(calculateDiscount(100, 3, 5)).toBe(66.5);
        });

        it('devrait plafonner la remise fidélité à 5% avec plus de 5 années', () => {
            expect(calculateDiscount(100, 3, 10)).toBe(66.5);
        });

        it('devrait fonctionner avec des montants différents', () => {
            expect(calculateDiscount(200, 3, 2)).toBe(137.2);
        });
    });

    describe('Type 4 - Remise de base 50%', () => {
        it("devrait appliquer 50% de remise avec 0 année de fidélité", () => {
            expect(calculateDiscount(100, 4, 0)).toBe(50);
        });

        it("devrait appliquer 50% + 1% de fidélité avec 1 année", () => {
            // 100 (prix de base) - 50% (car type 4) = 50, puis 50 - 1% (car 1 année) = 49.5
            expect(calculateDiscount(100, 4, 1)).toBe(49.5);
        });

        it("devrait appliquer 50% + 3% de fidélité avec 3 années", () => {
            expect(calculateDiscount(100, 4, 3)).toBe(48.5);
        });

        it('devrait plafonner la remise fidélité à 5% avec 5 années', () => {
            expect(calculateDiscount(100, 4, 5)).toBe(47.5);
        });

        it('devrait plafonner la remise fidélité à 5% avec plus de 5 années', () => {
            expect(calculateDiscount(100, 4, 10)).toBe(47.5);
        });

        it('devrait fonctionner avec des montants différents', () => {
            expect(calculateDiscount(200, 4, 2)).toBe(98);
        });
    });

    describe('Cas limites et types invalides', () => {
        it('devrait retourner 0 pour un type invalide', () => {
            expect(calculateDiscount(100, 0, 0)).toBe(0);
            expect(calculateDiscount(100, 5, 0)).toBe(0);
            expect(calculateDiscount(100, -1, 0)).toBe(0);
        });

        it('devrait gérer les montants à 0', () => {
            expect(calculateDiscount(0, 1, 0)).toBe(0);
            expect(calculateDiscount(0, 2, 5)).toBe(0);
            expect(calculateDiscount(0, 3, 3)).toBe(0);
            expect(calculateDiscount(0, 4, 1)).toBe(0);
        });

        it('devrait gérer les années négatives', () => {
            // Avec years négatif, disc sera négatif/100, donc on ajoute au lieu de soustraire
            // Type 1 retourne juste amount donc pas d'effet
            expect(calculateDiscount(100, 1, -1)).toBe(100);
            // Type 2: 100 - 10% - (-0.01 (car -1/100) * 90) = 90 + 0.9 (car --0.9) = 90.9
            expect(calculateDiscount(100, 2, -1)).toBe(90.9);
        });

        it('devrait gérer les montants décimaux', () => {
            // Type 1 retourne juste le montant
            expect(calculateDiscount(99.99, 1, 1)).toBeCloseTo(99.99, 2);
            expect(calculateDiscount(50.50, 2, 2)).toBeCloseTo(44.541, 2);
        });

        it('devrait gérer les années de fidélité décimales', () => {
            // Type 2 avec 2.5 années: 100 - 10% = 90, puis 90 - 2.5% = 87.75
            expect(calculateDiscount(100, 2, 2.5)).toBeCloseTo(87.75, 2);
            // Type 3 avec 3.7 années: 100 - 30% = 70, puis 70 - 3.7% = 67.41
            expect(calculateDiscount(100, 3, 3.7)).toBeCloseTo(67.41, 2);
            // Type 4 avec 1.5 années: 100 - 50% = 50, puis 50 - 1.5% = 49.25
            expect(calculateDiscount(100, 4, 1.5)).toBeCloseTo(49.25, 2);
        });

        it('devrait plafonner correctement avec des années décimales au-delà de 5', () => {
            // Type 2 avec 5.8 années: plafond à 5%, donc 100 - 10% = 90, puis 90 - 5% = 85.5
            expect(calculateDiscount(100, 2, 5.8)).toBeCloseTo(85.5, 2);
            // Type 3 avec 7.3 années: plafond à 5%, donc 100 - 30% = 70, puis 70 - 5% = 66.5
            expect(calculateDiscount(100, 3, 7.3)).toBeCloseTo(66.5, 2);
        });

        it('devrait gérer la combinaison de montants et années décimaux', () => {
            // 99.99 avec type 2 et 2.5 années: 99.99 - 10% = 89.991, puis 89.991 - 2.5% = 87.74
            expect(calculateDiscount(99.99, 2, 2.5)).toBeCloseTo(87.74, 2);
            // 150.75 avec type 4 et 3.2 années: 150.75 - 50% = 75.375, puis 75.375 - 3.2% = 72.96
            expect(calculateDiscount(150.75, 4, 3.2)).toBeCloseTo(72.96, 2);
        });

        it('devrait gérer de grands montants', () => {
            // Type 1 retourne juste le montant
            expect(calculateDiscount(10000, 1, 5)).toBe(10000);
            expect(calculateDiscount(10000, 4, 5)).toBe(4750);
        });
    });
});
