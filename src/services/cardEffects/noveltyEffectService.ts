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
            alert('do nothing')
            return true;
        },
        requirements: {}
    },
    dealDamagetoTargetSentient: {
        id: 'dealDamagetoTargetSentient',
        name: 'Deal Damage to Target Sentient',
        description: 'Deal damage to a target sentient on the field',
        effect: (requirements: { target: Sentient, amount: number }) => {
            const { target, amount } = requirements;
            console.log('Dealing damage to', target.name);
            target.health -= amount
            return true
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
}



const noveltyEffectService = new NoveltyEffectService();
export default noveltyEffectService;