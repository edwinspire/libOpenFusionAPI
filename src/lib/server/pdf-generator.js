import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";
import * as ChromeLauncher from "chrome-launcher";

// Set global executable path when using Sparticuz
process.env.PUPPETEER_EXECUTABLE_PATH = await chromium.executablePath();

let browserInstance = null;
let activeWorkers = 0;
const MAX_WORKERS = 5;

/**
 * Resolve executable path for different environments
 */
async function resolveExecutablePath() {
  if (process.platform === "win32") {
    // ChromeLauncher can cause lingering handles, so DO NOT log installations.
    const installs = ChromeLauncher.Launcher.getInstallations();
    return installs && installs.length > 0
      ? installs[0]
      : "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
  }

  // Linux / Heroku / Docker use Sparticuz Chromium
  return chromium.executablePath();
}

/**
 * Reuse browser to save resources
 */
async function getBrowser() {
  if (browserInstance) return browserInstance;

  browserInstance = await puppeteer.launch({
    executablePath: await resolveExecutablePath(),
    args: chromium.args,
    headless: chromium.headless,
    defaultViewport: chromium.defaultViewport,
  });

  return browserInstance;
}

/**
 * Close browser when no workers remain
 */
async function tryCloseBrowser() {
  if (browserInstance && activeWorkers === 0) {
    console.log("Cerrando navegador (no hay workers activos)…");
    try {
      await browserInstance.close();
    } catch (e) {
      console.error("Error al cerrar navegador:", e);
    }
    browserInstance = null;
  }
}

/**
 * Worker control
 */
async function waitForWorker() {
  while (activeWorkers >= MAX_WORKERS) {
    await new Promise((r) => setTimeout(r, 50));
  }
  activeWorkers++;
}

function releaseWorker() {
  activeWorkers = Math.max(0, activeWorkers - 1);
  setTimeout(tryCloseBrowser, 20); // graceful browser cleanup
}

/**
 * Load HTML or URL into a page
 */
async function loadPage({ page, html, url, baseUrl }) {
  if (html) {
    await page.setContent(html, {
      waitUntil: "networkidle0",
      url: baseUrl || "http://localhost",
    });
  }

  if (url) {
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 60000,
    });
  }
}

/**
 * Create PDF
 */
export const createPDF = async ({
  html = null,
  url = null,
  baseUrl = null,
  format = "A4",
  landscape = false,
  margin = "10mm",
  printBackground = true,
}) => {
  if (!html && !url) throw new Error("Debes pasar 'html' o 'url'");

  await waitForWorker();
  const browser = await getBrowser();

  try {
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 900 });

    await loadPage({ page, html, url, baseUrl });

    const pdf = await page.pdf({
      format,
      landscape,
      margin,
      printBackground,
      preferCSSPageSize: true,
    });

    // Cleanup internal Puppeteer connections
    try {
      await page._client().send("Network.clearBrowserCache");
      await page._client().send("Network.clearBrowserCookies");
    } catch {}

    await page.close();

    return pdf;
  } catch (err) {
    console.error("Error generando PDF:", err);
    throw err;
  } finally {
    releaseWorker();
  }
};

/**
 * Create image from HTML or URL
 */
export const createImage = async ({
  html = null,
  url = null,
  baseUrl = null,
  type = "png",
  quality = 90,
  fullPage = true,
}) => {
  if (!html && !url) throw new Error("Debes pasar 'html' o 'url'");

  await waitForWorker();
  const browser = await getBrowser();

  try {
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 900 });

    await loadPage({ page, html, url, baseUrl });

    const screenshot = await page.screenshot({
      type,
      quality: type === "jpeg" ? quality : undefined,
      fullPage,
    });

    // Cleanup connections
    try {
      await page._client().send("Network.clearBrowserCache");
      await page._client().send("Network.clearBrowserCookies");
    } catch {}

    await page.close();

    return screenshot;
  } catch (err) {
    console.error("Error generando imagen:", err);
    throw err;
  } finally {
    releaseWorker();
  }
};
