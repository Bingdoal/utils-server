const fs = require('fs');

// ======= 輸入參數 =======
const inputFile = process.argv[2] || "/Users/brucelin/Downloads/log (10).txt";  // 輸入檔案
const outputFile = process.argv[3] || "output.csv"; // 輸出檔案
const filterString = "Time elapsed:";  // 根據關鍵字先篩選出需要的行內容
const regexPattern = /.*?\[(.+?)\] Tests run: (.+?), Failures: (.+?), Errors: (.+?), Skipped: (.+?), Time elapsed: (.+?)s .+ in (.+)/;
const csvHeader = "Log level, Tests run, Failures, Errors, Skipped, Time elapsed(s), Run Class";
// ========================

// 讀取檔案
const fileContent = fs.readFileSync(inputFile, "utf8");

// 分行處理
const lines = fileContent.split(/\r?\n/);

// 篩選符合字串的行
const matchedLines = lines.filter(line => line.includes(filterString));

// 解析 regex
const results = [];
for (const line of matchedLines) {
  const match = regexPattern.exec(line);
  if (match) {
    results.push(match.slice(1));
  }
}

// 匯出 CSV
if (results.length > 0) {
  const rows = results.map(obj => Object.values(obj).join(","));
  const csvContent = [csvHeader, ...rows].join("\n");

  fs.writeFileSync(outputFile, csvContent, "utf8");
  console.log(`✅ 匯出完成：${outputFile}`);
} else {
  console.log("⚠️ 沒有找到任何符合的結果。");
}