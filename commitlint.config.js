export default {
    extends: ['@commitlint/config-conventional'],
    ignores: [(message) => /chore/m.test(message)],
};