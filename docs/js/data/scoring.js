/**
 * Scoring rules for Bolão Brasil Copa 2026
 * @module data/scoring
 */

/**
 * @typedef {Object} ScoringRules
 * @property {number} correctResult - Points for correct result (win/draw/loss)
 * @property {number} exactScore - Points for exact score match
 */

/**
 * Scoring configuration
 * @type {ScoringRules}
 */
const SCORING = {
  correctResult: 1,
  exactScore: 3
};

/**
 * Calculate outcome of a match
 * @param {number} homeScore - Home team score
 * @param {number} awayScore - Away team score
 * @returns {'WIN'|'DRAW'|'LOSS'|null} Outcome from home team perspective
 */
export function getOutcome(homeScore, awayScore) {
  if (homeScore === null || awayScore === null) return null;
  if (homeScore === undefined || awayScore === undefined) return null;
  if (homeScore > awayScore) return 'WIN';
  if (homeScore < awayScore) return 'LOSS';
  return 'DRAW';
}

/**
 * Calculate points for a prediction
 * @param {Object} prediction - User's prediction
 * @param {number} prediction.home - Predicted home score
 * @param {number} prediction.away - Predicted away score
 * @param {Object} result - Actual match result
 * @param {number} result.home - Actual home score
 * @param {number} result.away - Actual away score
 * @returns {number} Points earned
 */
export function calculatePoints(prediction, result) {
  // Exact score match
  if (prediction.home === result.home && prediction.away === result.away) {
    return SCORING.exactScore;
  }

  // Correct result (win/draw/loss)
  const predictionOutcome = getOutcome(prediction.home, prediction.away);
  const resultOutcome = getOutcome(result.home, result.away);

  if (predictionOutcome === resultOutcome) {
    return SCORING.correctResult;
  }

  return 0;
}

/**
 * Calculate maximum possible points
 * @param {number} matchCount - Number of matches
 * @returns {number} Maximum points possible
 */
export function calculateMaxPoints(matchCount) {
  return matchCount * SCORING.exactScore;
}

export default SCORING;
