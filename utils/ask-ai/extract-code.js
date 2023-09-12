/**
 * Extract code from between backticks
 * @param {string} input
 * @returns {string}
 */
export function extractTextBetweenBackticks(input) {
    const regex = /```(.*?)```/s;
    const match = input.match(regex);
    return match ? match[1].trim() : input;
}
