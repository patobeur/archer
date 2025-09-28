import asyncio
from playwright.async_api import async_playwright, expect

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        await page.goto('http://localhost:8000')

        # Wait for the Start button and click it
        start_button = page.get_by_role("button", name="Start")
        await expect(start_button).to_be_visible()
        await start_button.click()

        # Wait for the bow selection screen and choose the medium bow
        bow_button = page.get_by_role("button", name="Moyen (Power: 1.5)")
        await expect(bow_button).to_be_visible()
        await bow_button.click()

        # Wait for the game to load by looking for the specific main canvas
        main_canvas = page.locator('canvas[data-engine="three.js r160"]')
        await expect(main_canvas).to_be_visible()

        # Add a delay to allow the 3D scene to render
        await page.wait_for_timeout(5000)

        # Take a screenshot
        await page.screenshot(path="jules-scratch/verification/verification.png")

        await browser.close()

asyncio.run(main())