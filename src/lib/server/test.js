import { createPDF } from "./pdf-generator.js";
import fs from "fs";

(async () => {
  const pdf = await createPDF({
    url: "https://www.openfusionapi.com/",
  });

  fs.writeFileSync("salida2.pdf", pdf);
})();
