import BasePage from './BasePage.js'
import {By} from "selenium-webdriver";
class GoogleFinanceDataPage extends BasePage{
    URL = 'https://www.google.com/finance/quote/BTC-USD';
    USD_BTC_PRICE_LOCATOR = 'div[data-source="BTC"] div[jsname="ip75Cb"]'
    ACCEPT_ALL_BTN = 'button[aria-label="Accept all"]'

    async navigateToGoogleFinance(){
        await this.navigate(this.URL)
    }

    async getUsdBtcPriceByCss(){
        let price = await this.getElementTextByCss(this.USD_BTC_PRICE_LOCATOR);
        return parseFloat(price.replace(',', ''));
    }

    async handleCookiesScreen() {
        await this.driver.findElement(By.css(this.ACCEPT_ALL_BTN)).click();
    }


}

export default GoogleFinanceDataPage;