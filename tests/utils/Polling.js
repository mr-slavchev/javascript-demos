/**
 * Custom class for polling resources
 * @author Viktor Slavchev
 */
class Polling{

    static sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))

    /**
     * Polling function that records values and breaks ONLY at timeout, returning array of values.
     * @param interval in seconds
     * @param timeout in minutes
     * @param callback function to be executed each interval until mins
     * @returns {Promise<any[]>}
     */
    static async recordActivity(interval, timeout, callback){
        let rec_values = []
        let initial = timeout
        timeout = timeout * 60 * 1000 // to ms
        interval *= 1000 //ms
        while(timeout > 0){
            let val = await callback()
            rec_values.push(val);
            await Polling.sleep(interval);
            timeout -= interval;
            await console.log(`Recording activity for ${initial} mins, ${Math.floor(timeout / 1000)} secs remaining`);
        }

        return rec_values
    }
}

export default Polling;