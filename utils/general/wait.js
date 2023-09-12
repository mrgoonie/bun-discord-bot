/**
 * Delay/wait a specific miliseconds
 * @param i - waiting time in miliseconds
 * @param exec - callback function
 */
export const wait = async function (miliseconds = 100, exec = undefined) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                if (exec) exec();
                resolve(true);
            } catch (e) {
                reject(e);
            }
        }, miliseconds);
    });
};
