import currency from "currency.js";

class Rpc_Utils{
    static extractBtcUsdPrice(input){
        const regex = /(\[null\,\[)(\d+(?:\.\d+)?)(.+)(\[\"BTC\"\,)/
        const matches = input.match(regex)
        const price = matches[2]

        return currency(price).value
    }
}

export default Rpc_Utils;