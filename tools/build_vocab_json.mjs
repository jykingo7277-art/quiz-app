import fs from "fs";
import path from "path";

function pad4(n) {
  return String(n).padStart(4, "0");
}

// 第一行：word + 空格 + 中文
// 第二行：→ 例句（或 ->）
function parseVocabTxt(text) {
  let lines = text
  .split(/\r?\n/)
  .map(l => l.trim())
  .filter(l => l.length > 0);

// ✅ 自动跳过文件开头的标题行，例如：词汇补充例句 / vocab / 等
while (lines.length > 0) {
  const l1 = lines[0];
  const l2 = lines[1] ?? "";

  // 如果第一行不含空格（不像 "word cn"），并且第二行也不像例句行，
  // 就当成标题/说明行，直接跳过
  const looksLikeWordCn = l1.includes(" ");
  const looksLikeExample = l2.startsWith("→") || l2.startsWith("->");

  if (!looksLikeWordCn && !looksLikeExample) {
    lines.shift();
    continue;
  }
  break;
}

  const items = [];
  let i = 0;

  while (i < lines.length) {
    const line1 = lines[i];
    const line2 = lines[i + 1];

    if (!line2 || !(line2.startsWith("→") || line2.startsWith("->"))) {
      throw new Error(
        `格式错误：第 ${i + 1} 行后面找不到以 "→" 或 "->" 开头的例句行。\n` +
        `line1="${line1}"\nline2="${line2 ?? ""}"`
      );
    }

    const firstSpace = line1.indexOf(" ");

let word = "";
let cn = "";

if (firstSpace === -1) {
  // ✅ 容错：只有 word，没有中文解释
  word = line1.trim();
  cn = "";
} else {
  word = line1.slice(0, firstSpace).trim();
  cn = line1.slice(firstSpace + 1).trim();
}
    const example = line2.replace(/^→\s*/, "").replace(/^->\s*/, "").trim();

    items.push({ word, cn, example });
    i += 2;
  }

  return items.map((it, idx) => ({
    id: pad4(idx),
    ...it,
  }));
}

function main() {
  const projectRoot = process.cwd();

  // 你 txt 文件的真实位置（你提供的）
  const inputPath = "C:\\Users\\johnn\\vocab_mp3\\词汇补充例句.txt";

  const outputPath = path.join(projectRoot, "public", "vocab.json");

  if (!fs.existsSync(inputPath)) {
    console.error(`找不到输入文件：${inputPath}`);
    process.exit(1);
  }

  const text = fs.readFileSync(inputPath, "utf8");
  const vocab = parseVocabTxt(text);

  fs.writeFileSync(outputPath, JSON.stringify(vocab, null, 2), "utf8");

  console.log(`✅ 已生成 ${outputPath}`);
  console.log(`词条数：${vocab.length}`);
  console.log(`示例：`, vocab.slice(0, 3));
}

main();