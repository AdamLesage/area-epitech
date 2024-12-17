/*
** EPITECH PROJECT, 2024
** area-epitech
** File description:
** Worker
*/

/**
 * @class Worker class that sends a POST request to the callback URL every second.
 *
 * @param {string} name - The name of the worker.
 * @param {function} send - A function that sends a POST request to the callback URL.
 * @param {function} sleepNow - A function that sleeps for a given delay.
 * @param {function} repeatedGreetingsLoop - A function that sends a POST request to the callback URL every second.
 * @returns {Worker} - A Worker object
 * @author Adam Lesage && Romain Chevallier
 */
class Worker {
    /**
     * @brief Creates a Worker object with a given name.
     * @param {string} name - The name of the worker.
     * @returns {Worker} - A Worker object
     * @author Adam Lesage && Romain Chevallier
     */
    constructor(name) {
        this.name = name;

        this.send = this.send.bind(this);
        this.sleepNow = this.sleepNow.bind(this);
        this.repeatedGreetingsLoop = this.repeatedGreetingsLoop.bind(this);
    }


    /**
     * @brief Sends a POST request to the callback URL.
     * @returns {void}
     * @throws {Error} - If the HTTP status is not OK.
     * @throws {Error} - If there is a fetch error.
     * @note This function is asynchronous.
     * @author Adam Lesage && Romain Chevallier
     */
    async send() {
        console.log("send from " + this.name);
        try {
            const response = await fetch(process.env.CALL_BACK, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: process.env.DATA
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
    }

    /**
     * @brief Sleeps for a given delay.
     * @param {number} delay - The delay to sleep for.
     * @returns {Promise<void>} - A promise that resolves after the delay.
     * @note This function is asynchronous.
     * @author Adam Lesage && Romain Chevallier
     */
    sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

    /**
     * @brief Sends a POST request to the callback URL every second.
     * @returns {void}
     * @note This function is asynchronous.
     * @author Adam Lesage && Romain Chevallier
     */
    async repeatedGreetingsLoop() {
        while (1) {
            await this.sleepNow(1000)
            await this.send();
        }
    }
}

module.exports = Worker;
