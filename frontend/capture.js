const { execFileSync } = require("child_process");
const http = require("http");

// Take screenshot of landing page scrolled down to anomaly section
try {
  execFileSync(
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    [
      "--headless=new",
      "--disable-gpu",
      "--window-size=1440,1200",
      "--screenshot=C:\\Users\\pallavi\\.gemini\\antigravity\\brain\\c2fc3daa-1063-4a27-8922-5901d0d31668\\shot_anomaly_fixed.png",
      "http://localhost:3000/#anomaly"
    ]
  );
  console.log("Screenshot taken successfully!");
} catch (e) {
  console.error("Screenshot error:", e.message);
}