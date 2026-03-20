import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT = path.join(__dirname, "CreatorHouse_PitchDeck.pdf");

const TOTAL_SLIDES = 13; // 13 slides in the deck
const VIEWPORT = { width: 1920, height: 1080, deviceScaleFactor: 2 }; // 2x for high quality

(async () => {
    console.log("🚀 Launching browser...");
    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);

    console.log("📄 Loading pitch deck...");
    await page.goto("http://localhost:8080/pitchdeck", {
        waitUntil: "networkidle0",
        timeout: 30000,
    });

    // Wait a bit for fonts and images to fully render
    await new Promise((r) => setTimeout(r, 2000));

    // Hide navigation UI elements for clean screenshots
    await page.evaluate(() => {
        // Hide nav arrows, dots, top bar, progress bar, and "press arrows" hint
        const selectors = [
            // Left/right nav arrow buttons
            'button[disabled], button:not([disabled])',
        ];
        // Hide all buttons (nav arrows)
        document.querySelectorAll('button').forEach(el => {
            if (el.closest('.absolute')) el.style.display = 'none';
        });
        // Hide top bar (back link + slide counter)
        document.querySelectorAll('.absolute.top-0').forEach(el => el.style.display = 'none');
        // Hide dot navigation
        const dots = document.querySelector('.absolute.bottom-4, .absolute.bottom-6');
        if (dots) dots.style.display = 'none';
    });

    // Collect screenshots as buffers
    const screenshots = [];

    for (let i = 0; i < TOTAL_SLIDES; i++) {
        console.log(`📸 Capturing slide ${i + 1}/${TOTAL_SLIDES}...`);
        await new Promise((r) => setTimeout(r, 600)); // Let transitions settle

        const screenshot = await page.screenshot({
            type: "png",
            clip: { x: 0, y: 0, width: 1920, height: 1080 },
        });
        screenshots.push(screenshot);

        // Go to next slide
        if (i < TOTAL_SLIDES - 1) {
            await page.keyboard.press("ArrowRight");
        }
    }

    // Now create a PDF by building an HTML page with all screenshots embedded
    console.log("📑 Generating PDF...");

    const pdfPage = await browser.newPage();
    await pdfPage.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });

    const imagesHTML = screenshots
        .map(
            (buf, i) =>
                `<div class="slide" style="page-break-after: always; width: 1920px; height: 1080px; overflow: hidden;">
                    <img src="data:image/png;base64,${buf.toString("base64")}" 
                         style="width: 1920px; height: 1080px; display: block;" />
                </div>`
        )
        .join("\n");

    await pdfPage.setContent(
        `<!DOCTYPE html>
        <html>
        <head>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { background: #0a0a0f; }
                @page { size: 1920px 1080px; margin: 0; }
                .slide:last-child { page-break-after: avoid; }
            </style>
        </head>
        <body>${imagesHTML}</body>
        </html>`,
        { waitUntil: "load" }
    );

    await pdfPage.pdf({
        path: OUTPUT,
        width: "1920px",
        height: "1080px",
        printBackground: true,
        preferCSSPageSize: false,
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    console.log(`\n✅ PDF saved to: ${OUTPUT}`);
    console.log(`📐 Resolution: 1920×1080 @2x (3840×2160 effective)`);
    console.log(`📄 Slides: ${TOTAL_SLIDES}`);

    await browser.close();
})();
