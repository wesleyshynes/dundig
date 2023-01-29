import { Ground } from "../../types/ground.model";
import { Sentient } from "../../types/sentient.model";

class GroundEffectService {
    getEffectDetails(effectId: string) {
        return groundEffectList[effectId] ? groundEffectList[effectId] : null;
    }
}

interface GroundEffect {
    id: string;
    name: string;
    description: string;
    effect: (requirements: any) => any;
    requirements: any;
    cleanupEffect?: (requirements: any) => any;
}

const groundEffectList: {
    [key: string]: GroundEffect
} = {
    doNothing: {
        id: 'doNothing',
        name: 'Do Nothing',
        description: 'Do nothing',
        effect: (_: any) => {
            return {
                success: true,
                // moveTo: 'discard'
            };
        },
        requirements: {}
    },
    modifySentientStats: {
        id: 'modifySentientStats',
        name: 'Modify Sentient Stats',
        description: `Modify a sentient's stats`,
        effect: (requirements: {
            target: Sentient,
            groundInfo: Ground,
            friendlyAmount: any,
            enemyAmount: any,
        }) => {

            const {
                target,
                friendlyAmount,
                enemyAmount,
                groundInfo
            } = requirements;

            if (friendlyAmount && target.owner === groundInfo.owner) {
                const { health, attack, speed } = friendlyAmount;
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
            }

            if (enemyAmount && target.owner !== groundInfo.owner) {
                const { health, attack, speed } = enemyAmount;
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
            }

            return {
                success: true,
            }
        },
        requirements: {
            target: {
                type: 'sentient',
                source: 'selectedTarget',
                location: 'field',
            },
            friendlyAmount: {
                type: 'object',
                source: 'effectArgs.friendlyAmount'
            },
            enemyAmount: {
                type: 'object',
                source: 'effectArgs.enemyAmount'
            },
            groundInfo: {
                type: 'ground',
                source: 'groundInfo'
            }
        },
        cleanupEffect: (requirements: {
            target: Sentient,
            groundInfo: Ground,
            friendlyAmount: any,
            enemyAmount: any,
        }) => {
            const {
                target,
                friendlyAmount,
                enemyAmount,
                groundInfo
            } = requirements;

            if (friendlyAmount && target.owner === groundInfo.owner) {
                const { health, attack, speed } = friendlyAmount;
                if (attack) {
                    target.attack -= attack;
                    target.modifiers.attack -= attack;
                }
                if (health) {
                    target.health -= health;
                    target.modifiers.health -= health;
                }
                if (speed) {
                    target.speed -= speed;
                    target.modifiers.speed -= speed;
                }
            }

            if (enemyAmount && target.owner !== groundInfo.owner) {
                const { health, attack, speed } = enemyAmount;
                if (attack) {
                    target.attack -= attack;
                    target.modifiers.attack -= attack;
                }
                if (health) {
                    target.health -= health;
                    target.modifiers.health -= health;
                }
                if (speed) {
                    target.speed -= speed;
                    target.modifiers.speed -= speed;
                }
            }

            return {
                success: true,
            }
        }
    }
}


const groundEffectService = new GroundEffectService();
export default groundEffectService;