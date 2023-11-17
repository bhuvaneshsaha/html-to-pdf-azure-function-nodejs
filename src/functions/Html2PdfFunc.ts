import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { chromium } from "playwright-chromium";

export async function Html2PdfFunc(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

  try {

    const htmlContentFromBody = await request.text();

    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.setContent(htmlContentFromBody);

    const pdfBuffer = await page.pdf({ format: "a4" });
    // const screenshotBuffer = 
    //     await page.screenshot({ fullPage: true });
    await browser.close();

    return {
      body: pdfBuffer,
      headers: {
        "content-type": "application/pdf",
      }
    };
  } catch (error) {
    return {
      status: 500,
      body: error.message,
    };
  }

};

app.http('Html2PdfFunc', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: Html2PdfFunc
});
