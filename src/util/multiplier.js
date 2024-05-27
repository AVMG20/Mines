/**
 * Calculate the mines multiplier based on the number of gems uncovered and bombs.
 *
 * @param {number} gemsUncovered - The number of gems uncovered.
 * @param {number} bombs - The number of bombs present.
 * @returns {number} The calculated multiplier.
 * @throws {Error} If the input values are invalid.
 */
export function calcMultiplier(gemsUncovered, bombs) {
  const totalTiles = 25;
  const baseMultiplier = 0.97;

  if (
    bombs >= totalTiles ||
    bombs < 1 ||
    gemsUncovered < 1 ||
    gemsUncovered > totalTiles - bombs
  ) {
    throw new Error("Invalid input values.");
  }

  let multiplier = 1.0;

  for (let i = 0; i < gemsUncovered; i++) {
    const safeTiles = totalTiles - bombs - i;
    const totalRemainingTiles = totalTiles - i;
    const oddsOfUncoveringGem = safeTiles / totalRemainingTiles;
    multiplier *= 1 / oddsOfUncoveringGem;
  }

  multiplier *= baseMultiplier;

  return multiplier;
}

export function calcEarnings(bet, gemsCollected, totalBombs) {
  let reward = bet * calcMultiplier(gemsCollected, totalBombs);
  return round(reward);
}

export function round(num) {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

export function addCommas(num) {
  return num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
