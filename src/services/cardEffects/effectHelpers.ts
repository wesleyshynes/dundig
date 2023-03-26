export const statModText = (stats: {
    attack?: number,
    health?: number,
    speed?: number,
}): string => {
    const { health, attack, speed } = stats;
    let moddedStats = '';
    if (attack) {
        moddedStats += `${attack > 0 ? '+' : ''}${attack} ⚔️`;
    }
    if (health) {
        if (moddedStats) {
            moddedStats += ', ';
        }
        moddedStats += `${health > 0 ? '+' : ''}${health} 🛡️`;
    }
    if (speed) {
        if (moddedStats) {
            moddedStats += ' and ';
        }
        moddedStats += `${speed > 0 ? '+' : ''}${speed} 👟`;
    }
    return moddedStats;
}