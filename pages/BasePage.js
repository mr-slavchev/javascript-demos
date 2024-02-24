import {By, until} from "selenium-webdriver"

const DEFAUTL_WAITING_TIME = 3000;


class BasePage{
    constructor(driver) {
        this.driver = driver;
    }

    async navigate(URL){
        await this.driver.get(URL)
    }

    async getElementTextByCss(css){
        const element = await this.driver.wait(until.elementLocated(By.css(css)), DEFAUTL_WAITING_TIME);
        await this.driver.wait(until.elementIsVisible(element), DEFAUTL_WAITING_TIME);
        await this.driver.wait(until.elementIsEnabled(element), DEFAUTL_WAITING_TIME);

        return element.getText();

    }
}

export default BasePage;