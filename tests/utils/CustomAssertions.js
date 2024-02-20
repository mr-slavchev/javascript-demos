import {expect} from "chai";

class CustomAssertions{
    /**
     * Custom assertion that fails if number a and b vay with more than expected percentage
     * @param a
     * @param b
     * @param expected_percentage
     */
    static doNotVaryByPercentage(a, b, expected_percentage){
        const percentage_difference = CustomAssertions.#calculatePercentageDiff(a, b);
        console.log(`Values ${a} and ${b} vary with ${percentage_difference}%`) // for visibility of results
        expect(percentage_difference).to.be.below(expected_percentage, `Values ${a} and ${b} vary with ${percentage_difference}%`)
    }

    /**
     * Performs doNotVaryByPercentage to array members with O(n^2) complexity
     * @param arr
     * @param expected_percentage
     */
    static arrayValuesDoNotVaryByPercentage(arr, expected_percentage){
        while (arr.length > 1){
            let comp = arr.pop()
            arr.forEach((el)=>{
                const percentage_difference = CustomAssertions.#calculatePercentageDiff(comp, el);
                console.log(`Values ${comp} and ${el} vary with ${percentage_difference}%`) // for visibility of results
                CustomAssertions.doNotVaryByPercentage(comp, el, expected_percentage, `Values ${comp} and ${el} vary with ${percentage_difference}%`)
            })
        }
    }

    static #calculatePercentageDiff(a, b){
        const absolute_difference = Math.abs(a - b);
        const percentage_difference = (absolute_difference / Math.max(a, b)) * 100;
        return  Math.round((percentage_difference + Number.EPSILON)*100) / 100; // rounding to x.xx
    }
}

export default CustomAssertions;