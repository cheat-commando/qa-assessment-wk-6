import { Builder, Capabilities, By } from "selenium-webdriver"

const chromedriver = require('chromedriver')

const driver = new Builder().withCapabilities(Capabilities.chrome()).build()

beforeAll(async () => {
    await driver.get('http://localhost:4000')
})

afterAll(async () => {
    await driver.quit()
})

// beforeEach( async () => {
//     await driver.sleep(1000)
// })

test('I can start a game', async () => {

    let button = await (await driver).findElement(By.id('start-game'));
    await button.click();
    
});

test("I can place a X on any available space on the board", async () => {
    for (let i = 0; i < 9; i++) {
        await driver.get('http://localhost:4000');
        let button = await (await driver).findElement(By.id('start-game'));
        await button.click();
        let availSquare = await driver.findElement(By.id(`cell-${i}`));
        await availSquare.click();
        expect(await availSquare.getText()).toBe('X')
    }
});

test("I cannot place an 'X' on an space occupied by an 'O'", async () => {
    await driver.get('http://localhost:4000');
    let button = await (await driver).findElement(By.id('start-game'));
    await button.click();
    const firstSpace = await driver.findElement(By.id('cell-0'));
    await firstSpace.click();
    const secondSpace = await driver.findElement(By.id('cell-1'));
    await secondSpace.click();
    expect((await secondSpace.getText()).toLowerCase()).toBe('o')
})

test("I win if I have 3 'X's in a row, column, or diagonal", async () => {
    await driver.get('http://localhost:4000');
    let button = await (await driver).findElement(By.id('start-game'));
    await button.click();
    for (let i = 0; i < 9; i += 4) {
        const nextClick = await driver.findElement(By.id(`cell-${i}`))
        await nextClick.click()
        await driver.sleep(1000)
    }
    const winText = await (await driver).findElement(By.xpath('//h1[1]')).getText();
    expect(winText).toBe('X won');
});

test("The computer plays in an available space after each of my turns.", async () => {
    await driver.get('http://localhost:4000');
    let button = await (await driver).findElement(By.id('start-game'));
    await button.click();
    for (let i = 0; i < 9; i += 2) {
        let myMove = await driver.findElement(By.id(`cell-${i}`))
        await myMove.click();
        await driver.sleep(500);
        let xCount = 0
        let oCount = 0
        for (let j = 0; j < 9; j++) {
            const currentCellText = await (await driver).findElement(By.id(`cell-${j}`)).getText()
            if (currentCellText == null) {
                continue
            } else if (currentCellText.toLowerCase() === 'x') {
                xCount++
            } else if (currentCellText.toLowerCase() === 'o') {
                oCount++
            }
        }
        await driver.sleep(500)
        expect(xCount===oCount).toEqual(true)
    }
})