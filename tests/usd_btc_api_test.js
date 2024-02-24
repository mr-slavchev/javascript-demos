import Rpc_Utils from './utils/Rpc_Utils.js'
import pkg from 'pactum';
import Polling from "./utils/Polling.js";
import CustomAssertions from "./utils/CustomAssertions.js";

const {spec, request} = pkg;

let test_data = [
    {'n' : 1, 'm' : 10},
    {'n' : 3, 'm' : 10},
    {'n' : 5, 'm' : 10}
]

describe("USD-BTC compare", async () =>{

    // Set base URL for the test
    request.setBaseUrl('https://www.google.com/finance/');
    request.setDefaultTimeout(420000)

    const FINANCE_URL_PARTIAL = '_/GoogleFinanceUi/data/batchexecute';

    //Set headers
    const HEADERS = {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    };

    //Set query params
    const PARAMS = {
        'rpcids': 'Ba1tad', //comma separated list of ids, indicating what function we call - most important part of the req
        'source-path': '/finance/quote/BTC-USD',
        'f.sid': '-6003776348998740224', // signed 64 bit integer, XSRF deterrent
        'bl': 'boq_finance-ui_20240129.01_p0', // name and version of BE
        'hl': 'en-GB', // ISO language code
        // 'soc-app': 162, // all soc- params are optional
        // 'soc-platform': 1,
        // 'soc-device': 1,
        '_reqid': 354443,
        'rt': 'b' //returns standard response format, replace with b for protobuf and omit for json, json didn't work
    }

    // Payload params, long and ugly, but since they don't change it's Ok for them to be hardcoded in this file.
    const f_req = '[[["Ba1tad","[[[\\"/g/11bvvxp7st\\"],[\\"/m/0ckddth\\"],[\\"/m/07zm1xs\\"],[\\"/m/07zln7n\\"],[\\"/g/11bzt1mm0k\\"],[\\"/g/11bwyty7cv\\"],[\\"/m/07zm31w\\"],[\\"/g/11bv2m3_dt\\"],[\\"/m/07zm4wq\\"],[\\"/g/11c55jtt7d\\"],[\\"/g/1dtw_zn2\\"],[\\"/m/0clbf3b\\"],[\\"/g/1q67k66gt\\"],[\\"/m/07zlm7d\\"],[\\"/m/016yss\\"],[\\"/m/0cqyw\\"],[\\"/m/0ckhqlx\\"],[\\"/m/0rzsfnc\\"],[\\"/m/07zmbvf\\"],[\\"/g/11cjwh6kxy\\"],[\\"/g/11cs2x9b67\\"],[\\"/g/11tff3ltjy\\"],[\\"/m/07zkzx1\\"],[\\"/g/11flfmch44\\"],[\\"/g/11lkqrv00y\\"],[\\"/g/12fzdq9mn\\"],[\\"/m/07zm2vb\\"],[\\"/m/0s81cy6\\"],[\\"/m/0ckm4dg\\"],[\\"/m/07zm60s\\"],[\\"/g/11cfmwb6b\\"],[\\"/g/1hbvz3qc4\\"],[\\"/g/12b6lj495\\"],[\\"/m/07zlv08\\"],[\\"/m/07zlw9w\\"],[\\"/m/07zkx85\\"],[\\"/m/02853rl\\"],[\\"/m/04zvfw\\"],[\\"/m/09fld6\\"],[\\"/g/11l9rv6gfw\\"],[\\"/g/1dv4qcfk\\"],[\\"/m/07zk_ym\\"],[\\"/g/1ywbr0zk8\\"],[\\"/g/11mn14czyv\\"]]]",null,"generic"]]]'
    const at = `ANXCC_DjFGmKgu1BkTX4kkYTdboW:1708175242282`

    test_data.forEach(({n, m})=>{
        it(`should run in API for ${n}, check each ${m} secs and not vary by percentage`, async () => {
            const prices = await Polling.recordActivity(
                m, n, async ()=> {
                    const resp = await _spec(FINANCE_URL_PARTIAL, HEADERS, PARAMS, f_req, at);
                    return await Rpc_Utils.extractBtcUsdPrice(resp);
                }
            )

            // Check #1 assert average if prices doesn't differ the first recorded price by more than 1%
            let average = prices.reduce((a, b) => a + b, 0) / prices.length;
            average = Math.round((average + Number.EPSILON)*100) / 100;
            CustomAssertions.doNotVaryByPercentage(average, prices[0], 1);

            //Check #2 assert array values don't vary with more than 2%
            CustomAssertions.arrayValuesDoNotVaryByPercentage(prices, 2);

        }).timeout(420000)
    })
})

/**
 * Custom function that executes the request as a single piece of code
 * @param endpoint URL
 * @param headers HTTP headers
 * @param params Query params
 * @param _f_req f_req parameter
 * @param _at at parameter
 * @returns {Promise<String>}
 * @private
 */
const _spec = async (endpoint, headers, params, _f_req, _at)=> {
    const resp = await spec()
        .post(endpoint)
        .withHeaders(headers)
        .withQueryParams(params)
        .withForm({
            'f.req': _f_req,
            'at': _at
        })
        .toss()
    return resp.json;
}

