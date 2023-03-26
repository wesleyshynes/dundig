import { Sentient } from "../../types/sentient.model";
import { statModText } from "./effectHelpers";

class NoveltyEffectService {
    getEffectDetails(effectId: string) {
        return noveltyEffectList[effectId] ? noveltyEffectList[effectId] : null;
    }
}

interface NoveltyEffect {
    id: string;
    name: string;
    description: (a: any) => string;
    effect: (requirements: any) => any;
    requirements: any;
    cleanupEffect?: (requirements: any) => any;
}


const noveltyEffectList: {
    [key: string]: NoveltyEffect
} = {
    doNothing: {
        id: 'doNothing',
        name: 'Do Nothing',
        description: (a: any) => {
            return 'This does nothing. You should probably use it to pay for something.'
        },
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
        description: (a: any) => {
            return `Deal ${a.amount} damage to target Sentient.`
        },
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
        description: (a: any) => {
            return `Target Sentient gets ${statModText(a.amount)}.`
        },
        effect: (requirements: { target: Sentient, amount: any }) => {
            const {
                target,
                amount,
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
        cleanupEffect: (requirements: { target: Sentient, amount: any }) => {
            const {
                target,
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