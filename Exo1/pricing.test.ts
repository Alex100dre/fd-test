import {applyDiscount, calculateDiscount, calculateDiscountRateByLoyaltyYears, checkIfTypeExist, DiscountType, getDiscountRateByType, round} from './pricing';

describe('pricing', () => {
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
                expect(calculateDiscount(100, 0 as DiscountType, 0)).toBe(0);
                expect(calculateDiscount(100, 5 as DiscountType, 0)).toBe(0);
                expect(calculateDiscount(100, -1 as DiscountType, 0)).toBe(0);
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

    describe('getDiscountRateByType', () => {
        it('devrait retourner 0 pour le type BRONZE (1)', () => {
            expect(getDiscountRateByType(1)).toBe(0);
        });

        it('devrait retourner 0.1 pour le type SILVER (2)', () => {
            expect(getDiscountRateByType(2)).toBe(0.1);
        });

        it('devrait retourner 0.3 pour le type GOLD (3)', () => {
            expect(getDiscountRateByType(3)).toBe(0.3);
        });

        it('devrait retourner 0.5 pour le type PLATINUM (4)', () => {
            expect(getDiscountRateByType(4)).toBe(0.5);
        });

        it('devrait retourner 0 pour un type invalide', () => {
            expect(getDiscountRateByType(0 as DiscountType)).toBe(0);
            expect(getDiscountRateByType(5 as DiscountType)).toBe(0);
            expect(getDiscountRateByType(2.5 as DiscountType)).toBe(0);
            expect(getDiscountRateByType(-1 as DiscountType)).toBe(0);
            expect(getDiscountRateByType(999 as DiscountType)).toBe(0);
        });
    })

    describe('checkIfTypeExist', () => {
        it('devrait retourner true pour le type BRONZE (1)', () => {
            expect(checkIfTypeExist(1)).toBe(true);
        });

        it('devrait retourner true pour le type SILVER (2)', () => {
            expect(checkIfTypeExist(2)).toBe(true);
        });

        it('devrait retourner true pour le type GOLD (3)', () => {
            expect(checkIfTypeExist(3)).toBe(true);
        });

        it('devrait retourner true pour le type PLATINUM (4)', () => {
            expect(checkIfTypeExist(4)).toBe(true);
        });

        it('devrait retourner false pour un type invalide', () => {
            expect(checkIfTypeExist(0 as DiscountType)).toBe(false);
            expect(checkIfTypeExist(5 as DiscountType)).toBe(false);
            expect(checkIfTypeExist(-1 as DiscountType)).toBe(false);
            expect(checkIfTypeExist(999 as DiscountType)).toBe(false);
        });

        it('devrait retourner false pour des valeurs décimales', () => {
            expect(checkIfTypeExist(1.5 as DiscountType)).toBe(false);
            expect(checkIfTypeExist(2.7 as DiscountType)).toBe(false);
        });
    })

    describe('applyDiscount', () => {
        it('devrait appliquer uniquement la remise de type sans remise de fidélité', () => {
            expect(applyDiscount(100, 0.1, 0)).toBe(90);
            expect(applyDiscount(100, 0.3, 0)).toBe(70);
            expect(applyDiscount(100, 0.5, 0)).toBe(50);
        });

        it('devrait appliquer uniquement la remise de fidélité sans remise de type', () => {
            expect(applyDiscount(100, 0, 0.01)).toBe(99);
            expect(applyDiscount(100, 0, 0.05)).toBe(95);
        });

        it('devrait appliquer les deux remises combinées', () => {
            expect(applyDiscount(100, 0.1, 0.01)).toBe(89.1);
            expect(applyDiscount(100, 0.3, 0.03)).toBe(67.9);
            expect(applyDiscount(100, 0.5, 0.05)).toBe(47.5);
        });

        it('devrait arrondir à 2 décimales', () => {
            expect(applyDiscount(99.99, 0.1, 0.025)).toBeCloseTo(87.74, 2);
        });

        it('devrait retourner 0 pour un montant de 0 (pas de réduc sur le gratis)', () => {
            expect(applyDiscount(0, 0.1, 0.05)).toBe(0);
            expect(applyDiscount(0, 0, 0)).toBe(0);
        });

        it('devrait gérer les remises négatives', () => {
            // TODO: On devrait certainement gérer des exception car une reduction ne devrait pas être négativve et augmenter le prix
            expect(applyDiscount(100, 0.1, -0.01)).toBe(90.9);
        });

        it('devrait fonctionner avec différents montants', () => {
            expect(applyDiscount(200, 0.1, 0.02)).toBe(176.4);
            expect(applyDiscount(150.75, 0.5, 0.032)).toBeCloseTo(72.96, 2);
        });

        it("devrait retourner le montant complet si aucune remise n'est appliquée", () => {
            expect(applyDiscount(100, 0, 0)).toBe(100);
            expect(applyDiscount(250, 0, 0)).toBe(250);
        });
    })

    describe('round', () => {
        it('devrait arrondir à 2 décimales', () => {
            expect(round(99.999)).toBe(100);
            expect(round(99.991)).toBe(99.99);
            expect(round(99.995)).toBe(100);
        });

        it('devrait gérer les nombres entiers', () => {
            expect(round(100)).toBe(100);
            expect(round(0)).toBe(0);
            expect(round(50)).toBe(50);
        });

        it('devrait gérer les nombres avec 1 décimale', () => {
            expect(round(99.9)).toBe(99.9);
            expect(round(10.5)).toBe(10.5);
            expect(round(7.1)).toBe(7.1);
        });

        it('devrait gérer les nombres avec 2 décimales', () => {
            expect(round(99.99)).toBe(99.99);
            expect(round(10.50)).toBe(10.5);
            expect(round(7.25)).toBe(7.25);
        });

        it('devrait gérer les nombres avec plus de 2 décimales', () => {
            expect(round(3.14159)).toBe(3.14);
            expect(round(67.8999)).toBe(67.9);
            expect(round(47.5555)).toBe(47.56);
        });

        it('devrait gérer les nombres négatifs', () => {
            expect(round(-99.999)).toBe(-100);
            expect(round(-10.123)).toBe(-10.12);
            expect(round(-50.5)).toBe(-50.5);
        });

        it('devrait gérer 0 et les très petits nombres', () => {
            expect(round(0)).toBe(0);
            expect(round(0.001)).toBe(0);
            expect(round(0.005)).toBe(0.01);
        });

        it('devrait gérer les grands nombres', () => {
            expect(round(9999.999)).toBe(10000);
            expect(round(123456.789)).toBe(123456.79);
        });
    })

    describe('calculateDiscountRateByLoyaltyYears', () => {
        it('devrait retourner 0 pour 0 année de fidélité', () => {
            expect(calculateDiscountRateByLoyaltyYears(0)).toBe(0);
        });

        it('devrait retourner 0.01 pour 1 année de fidélité', () => {
            expect(calculateDiscountRateByLoyaltyYears(1)).toBe(0.01);
        });

        it('devrait retourner 0.02 pour 2 années de fidélité', () => {
            expect(calculateDiscountRateByLoyaltyYears(2)).toBe(0.02);
        });

        it('devrait retourner 0.03 pour 3 années de fidélité', () => {
            expect(calculateDiscountRateByLoyaltyYears(3)).toBe(0.03);
        });

        it('devrait retourner 0.05 pour 5 années de fidélité', () => {
            expect(calculateDiscountRateByLoyaltyYears(5)).toBe(0.05);
        });

        it('devrait plafonner à 0.05 pour plus de 5 années de fidélité', () => {
            expect(calculateDiscountRateByLoyaltyYears(6)).toBe(0.05);
            expect(calculateDiscountRateByLoyaltyYears(10)).toBe(0.05);
            expect(calculateDiscountRateByLoyaltyYears(100)).toBe(0.05);
        });

        it('devrait gérer les années décimales', () => {
            expect(calculateDiscountRateByLoyaltyYears(1.5)).toBe(0.015);
            expect(calculateDiscountRateByLoyaltyYears(2.5)).toBe(0.025);
            expect(calculateDiscountRateByLoyaltyYears(3.7)).toBe(0.037);
        });

        it('devrait plafonner les années décimales au-delà de 5', () => {
            expect(calculateDiscountRateByLoyaltyYears(5.5)).toBe(0.05);
            expect(calculateDiscountRateByLoyaltyYears(7.3)).toBe(0.05);
            expect(calculateDiscountRateByLoyaltyYears(10.9)).toBe(0.05);
        });

        it('devrait gérer les années négatives', () => {
            expect(calculateDiscountRateByLoyaltyYears(-1)).toBe(-0.01);
            expect(calculateDiscountRateByLoyaltyYears(-5)).toBe(-0.05);
        });
    })
})