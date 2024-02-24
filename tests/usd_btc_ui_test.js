import GoogleFinanceDataPage from '../pages/GoogleFinanceDataPage.js'
import {Builder} from 'selenium-webdriver'
import Polling from "./utils/Polling.js";
import CustomAssertions from "./utils/CustomAssertions.js";


let test_data = [
    {'n' : 1, 'm' : 10},
    {'n' : 3, 'm' : 10},
    {'n' : 5, 'm' : 10}
]

describe('USD-BTC comparison in UI', ()=> {

    let driver = null;

    before('Initial setup', async ()=> {
        driver = await new Builder().forBrowser('chrome').build();
        await driver.manage().window().maximize();
    })

    test_data.forEach(({n, m})=>{
        it(`should run in UI for ${n}, check each ${m} secs and not vary by percentage`, async () => {
            const googleFinancePage = new GoogleFinanceDataPage(driver);
            await googleFinancePage.navigateToGoogleFinance()

            // Handle the Google cookie policy screen
            const title = await driver.getTitle();
            if (title === 'Before you continue'){
                await googleFinancePage.handleCookiesScreen();
            }

            const _get_price = async (driver, page_object) => {
                driver.navigate().refresh();
                return await page_object.getUsdBtcPriceByCss();
            }



            const prices = await Polling.recordActivity(
                m,
                n,
                async ()=>{
                    return await _get_price(driver, googleFinancePage)
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

    after('Quit the driver', async ()=> {
        await driver.quit();
    })

})


