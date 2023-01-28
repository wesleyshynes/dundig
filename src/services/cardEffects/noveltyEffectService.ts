import { Sentient } from "../../types/sentient.model";

class NoveltyEffectService {
    getEffectDetails(effectId: string) {
        return noveltyEffectList[effectId] ? noveltyEffectList[effectId] : null;
    }
}


const noveltyEffectList: any = {
    doNothing: {
        id: 'doNothing',
        name: 'Do Nothing',
        description: 'Do nothing',
        effect: (_: any) => {
            return {
                success: true,
                moveTo: 'discard'
            };
        },
        requirements: {}
    },
    dealDamagetoTargetSentient: {
        id: 'dealDamagetoTargetSentient',
        name: 'Deal Damage to Target Sentient',
        description: 'Deal damage to a target sentient on the field',
        effect: (requirements: { target: Sentient, amount: number }) => {
            const { target, amount } = requirements;
            target.health -= amount
            return {
                success: true,
                moveTo: 'discard'
            }
        },
        requirements: {
            target: {
                type: 'sentient',
                source: 'selectedTarget',
                location: 'field',
            },
            amount: {
                type: 'number',
                source: 'effectArgs.amount'
            }
        }
    },
    modifySentientStats: {
        id: 'modifySentientStats',
        name: 'Modify Sentient Stats',
        description: `Modify a sentient's stats`,
        effect: (requirements: { target: Sentient, amount: any, cardId: string }) => {
            const {
                target,
                amount,
                // cardId,
            } = requirements;
            const {
                attack,
                health,
                speed,
            } = amount

            if (attack) {
                target.attack += attack;
                target.modifiers.attack += attack;
            }
            if (health) {
                target.health += health;
                target.modifiers.health += health;
            }
            if (speed) {
                target.speed += speed;
                target.modifiers.speed += speed;
            }

            return {
                success: true,
                moveTo: `cardRef.${target.id}.novelties`
            };
        },
        requirements: {
            target: {
                type: 'sentient',
                source: 'selectedTarget',
                location: 'field',
            },
            amount: {
                type: 'object',
                source: 'effectArgs.amount'
            },
        },
        cleanupEffect: (requirements: { target: Sentient, cardId: string, amount: any }) => {
            const {
                target,
                // cardId,
                amount,
            } = requirements;
            const {
                attack,
                health,
                speed,
            } = amount

            if(attack) {
                target.attack -= attack;
                target.modifiers.attack -= attack;
            }
            if(health) {
                target.health -= health;
                target.modifiers.health -= health;
            }
            if(speed) {
                target.speed -= speed;
                target.modifiers.speed -= speed;
            }

            return {
                success: true
            }
        },
    }
}



const noveltyEffectService = new NoveltyEffectService();
export default noveltyEffectService;