#!/usr/bin/env node

import { readFileSync, existsSync } from "node:fs";
import { randomUUID, randomInt } from "node:crypto";
import { resolve } from "node:path";

// ─── ANSI Colors ────────────────────────────────────────────────────────────
const c = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  bgGreen: "\x1b[42m",
};

const VERSION = "1.0.0";

// ─── Data dictionaries ─────────────────────────────────────────────────────
const DATA: Record<string, { firstNames: string[]; lastNames: string[]; cities: string[]; streets: string[]; domains: string[]; companies: string[] }> = {
  en: {
    firstNames: [
      "James", "Mary", "Robert", "Patricia", "John", "Jennifer", "Michael", "Linda",
      "David", "Elizabeth", "William", "Barbara", "Richard", "Susan", "Joseph", "Jessica",
      "Thomas", "Sarah", "Christopher", "Karen", "Daniel", "Lisa", "Matthew", "Nancy",
      "Anthony", "Betty", "Mark", "Margaret", "Donald", "Sandra", "Steven", "Ashley",
      "Andrew", "Dorothy", "Paul", "Kimberly", "Joshua", "Emily", "Kenneth", "Donna",
      "Kevin", "Michelle", "Brian", "Carol", "George", "Amanda", "Timothy", "Melissa",
      "Ronald", "Deborah", "Edward", "Stephanie", "Jason", "Rebecca", "Jeffrey", "Sharon",
      "Ryan", "Laura", "Jacob", "Cynthia", "Gary", "Kathleen", "Nicholas", "Amy",
      "Eric", "Angela", "Jonathan", "Shirley", "Stephen", "Anna", "Larry", "Brenda",
      "Justin", "Pamela", "Scott", "Emma", "Brandon", "Nicole", "Benjamin", "Helen",
      "Samuel", "Samantha", "Raymond", "Katherine", "Gregory", "Christine", "Frank", "Debra",
      "Alexander", "Rachel", "Patrick", "Carolyn", "Jack", "Janet", "Dennis", "Catherine",
      "Jerry", "Maria", "Tyler", "Heather", "Aaron", "Diane", "Jose", "Ruth",
    ],
    lastNames: [
      "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis",
      "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson",
      "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee", "Perez", "Thompson",
      "White", "Harris", "Sanchez", "Clark", "Ramirez", "Lewis", "Robinson", "Walker",
      "Young", "Allen", "King", "Wright", "Scott", "Torres", "Nguyen", "Hill",
      "Flores", "Green", "Adams", "Nelson", "Baker", "Hall", "Rivera", "Campbell",
      "Mitchell", "Carter", "Roberts", "Gomez", "Phillips", "Evans", "Turner", "Diaz",
      "Parker", "Cruz", "Edwards", "Collins", "Reyes", "Stewart", "Morris", "Morales",
    ],
    cities: [
      "New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia",
      "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville",
      "Fort Worth", "Columbus", "Indianapolis", "Charlotte", "San Francisco",
      "Seattle", "Denver", "Nashville", "Portland", "Las Vegas", "Memphis",
      "Louisville", "Baltimore", "Milwaukee", "Albuquerque", "Tucson", "Fresno",
      "Sacramento", "Kansas City", "Mesa", "Atlanta", "Omaha", "Colorado Springs",
      "Raleigh", "Long Beach", "Virginia Beach", "Miami", "Oakland", "Minneapolis",
    ],
    streets: [
      "Main St", "Oak Ave", "Maple Dr", "Cedar Ln", "Pine St", "Elm St",
      "Washington Ave", "Lake Dr", "Hill Rd", "Park Ave", "River Rd",
      "Sunset Blvd", "Broadway", "Market St", "Church St", "Highland Ave",
      "Meadow Ln", "Forest Dr", "Spring St", "Valley Rd", "Garden Way",
      "Cherry Ln", "Walnut St", "Birch Dr", "Willow Way", "Aspen Ct",
    ],
    domains: [
      "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "proton.me",
      "icloud.com", "mail.com", "fastmail.com", "zoho.com", "aol.com",
    ],
    companies: [
      "Acme Corp", "Globex Inc", "Initech", "Umbrella Corp", "Stark Industries",
      "Wayne Enterprises", "Cyberdyne Systems", "Soylent Corp", "Massive Dynamic",
      "Hooli", "Pied Piper", "Dunder Mifflin", "Sterling Cooper", "Wonka Industries",
      "InGen", "Tyrell Corp", "Weyland Corp", "Oscorp", "LexCorp", "Aperture Science",
    ],
  },
  ja: {
    firstNames: [
      "Haruto", "Yuto", "Sota", "Haruki", "Riku", "Minato", "Aoi", "Hinata",
      "Yui", "Mei", "Sakura", "Hana", "Koharu", "Rin", "Mio", "Yuna",
      "Akari", "Himari", "Rio", "Ichika", "Tsubasa", "Ren", "Kaito", "Sora",
      "Takumi", "Yuki", "Ryo", "Daiki", "Kento", "Shun", "Ayaka", "Nana",
    ],
    lastNames: [
      "Sato", "Suzuki", "Takahashi", "Tanaka", "Watanabe", "Ito", "Yamamoto",
      "Nakamura", "Kobayashi", "Kato", "Yoshida", "Yamada", "Sasaki", "Yamaguchi",
      "Matsumoto", "Inoue", "Kimura", "Hayashi", "Shimizu", "Yamazaki", "Mori",
      "Abe", "Ikeda", "Hashimoto", "Yamashita", "Ishikawa", "Nakajima", "Maeda",
      "Fujita", "Ogawa", "Goto", "Okada",
    ],
    cities: [
      "Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Fukuoka", "Kobe",
      "Kawasaki", "Kyoto", "Saitama", "Hiroshima", "Sendai", "Chiba", "Kitakyushu",
      "Sakai", "Niigata", "Hamamatsu", "Shizuoka", "Sagamihara", "Okayama",
    ],
    streets: [
      "Chuo-dori", "Omotesando", "Meiji-dori", "Yasukuni-dori", "Aoyama-dori",
      "Sotobori-dori", "Uchibori-dori", "Hakusan-dori", "Kasuga-dori", "Hongo-dori",
    ],
    domains: [
      "gmail.com", "yahoo.co.jp", "outlook.jp", "docomo.ne.jp", "softbank.ne.jp",
      "ezweb.ne.jp", "icloud.com", "nifty.com", "biglobe.ne.jp", "ocn.ne.jp",
    ],
    companies: [
      "Toyota", "Sony", "Nintendo", "Honda", "Panasonic", "Mitsubishi",
      "Hitachi", "Toshiba", "Canon", "Fujitsu", "Sharp", "NEC",
      "Yamaha", "Nikon", "Olympus", "Casio", "Suzuki", "Mazda",
    ],
  },
};

// ─── Types for schema ───────────────────────────────────────────────────────
type FieldType =
  | "name" | "firstName" | "lastName" | "email" | "phone"
  | "address" | "city" | "street" | "zip" | "country"
  | "date" | "datetime" | "timestamp" | "uuid" | "id"
  | "boolean" | "int" | "float" | "text" | "paragraph"
  | "url" | "ip" | "ipv6" | "company" | "title" | "color"
  | "username" | "password" | "age" | "latitude" | "longitude";

interface FieldDef {
  name: string;
  type: FieldType;
  nullable?: boolean;
  min?: number;
  max?: number;
}

interface Schema {
  table: string;
  fields: FieldDef[];
}

// ─── Help ───────────────────────────────────────────────────────────────────
function printHelp(): void {
  console.log(`
${c.bold}${c.cyan}  data-seed${c.reset} ${c.dim}v${VERSION}${c.reset}
${c.dim}  Generate realistic fake data for database seeding${c.reset}

${c.bold}USAGE${c.reset}
  ${c.green}$ npx @lxgicstudios/data-seed${c.reset} [options]

${c.bold}OPTIONS${c.reset}
  ${c.yellow}--help${c.reset}                Show this help message
  ${c.yellow}--json${c.reset}                Output as JSON (default)
  ${c.yellow}--format${c.reset} <fmt>         Output format: json, csv, sql (default: json)
  ${c.yellow}--count${c.reset} <n>            Number of records (default: 10)
  ${c.yellow}--locale${c.reset} <code>        Locale: en, ja (default: en)
  ${c.yellow}--schema${c.reset} <file>        Schema file (YAML-like format)
  ${c.yellow}--table${c.reset} <name>         Table name for SQL output (default: users)
  ${c.yellow}--fields${c.reset} <defs>        Inline field definitions
                        Example: --fields "id:uuid,name:name,email:email"
  ${c.yellow}--seed${c.reset} <n>             Random seed for reproducible output
  ${c.yellow}--no-color${c.reset}            Disable colored output
  ${c.yellow}--pretty${c.reset}              Pretty-print JSON output

${c.bold}FIELD TYPES${c.reset}
  ${c.cyan}name${c.reset}         Full name          ${c.cyan}firstName${c.reset}    First name
  ${c.cyan}lastName${c.reset}     Last name           ${c.cyan}email${c.reset}        Email address
  ${c.cyan}phone${c.reset}        Phone number        ${c.cyan}address${c.reset}      Full address
  ${c.cyan}city${c.reset}         City name           ${c.cyan}street${c.reset}       Street address
  ${c.cyan}zip${c.reset}          ZIP code            ${c.cyan}country${c.reset}      Country name
  ${c.cyan}date${c.reset}         Date (YYYY-MM-DD)   ${c.cyan}datetime${c.reset}     ISO datetime
  ${c.cyan}timestamp${c.reset}    Unix timestamp      ${c.cyan}uuid${c.reset}         UUID v4
  ${c.cyan}id${c.reset}           Auto-increment ID   ${c.cyan}boolean${c.reset}      true/false
  ${c.cyan}int${c.reset}          Integer (1-1000)     ${c.cyan}float${c.reset}        Float (0-1000)
  ${c.cyan}text${c.reset}         Short text          ${c.cyan}paragraph${c.reset}    Longer text
  ${c.cyan}url${c.reset}          URL                 ${c.cyan}ip${c.reset}           IPv4 address
  ${c.cyan}company${c.reset}      Company name        ${c.cyan}username${c.reset}     Username
  ${c.cyan}age${c.reset}          Age (18-90)         ${c.cyan}latitude${c.reset}     GPS latitude
  ${c.cyan}longitude${c.reset}    GPS longitude       ${c.cyan}color${c.reset}        Hex color

${c.bold}EXAMPLES${c.reset}
  ${c.dim}# Generate 100 user records${c.reset}
  $ npx @lxgicstudios/data-seed --count 100

  ${c.dim}# Custom schema with SQL output${c.reset}
  $ npx @lxgicstudios/data-seed --fields "id:uuid,name:name,email:email,age:int" --format sql

  ${c.dim}# CSV output for import${c.reset}
  $ npx @lxgicstudios/data-seed --count 500 --format csv > users.csv

  ${c.dim}# Japanese locale${c.reset}
  $ npx @lxgicstudios/data-seed --locale ja --count 50

  ${c.dim}# Load schema from file${c.reset}
  $ npx @lxgicstudios/data-seed --schema schema.yml --count 1000 --format sql
`);
}

// ─── Parse args ─────────────────────────────────────────────────────────────
function parseArgs(argv: string[]) {
  const args = {
    help: false,
    json: false,
    format: "json" as "json" | "csv" | "sql",
    count: 10,
    locale: "en",
    schemaFile: null as string | null,
    table: "users",
    fields: null as string | null,
    seed: null as number | null,
    noColor: false,
    pretty: false,
  };

  for (let i = 2; i < argv.length; i++) {
    const arg = argv[i];
    switch (arg) {
      case "--help":
      case "-h":
        args.help = true;
        break;
      case "--json":
        args.json = true;
        args.format = "json";
        break;
      case "--format":
        args.format = (argv[++i] || "json") as "json" | "csv" | "sql";
        break;
      case "--count":
        args.count = parseInt(argv[++i] || "10", 10);
        break;
      case "--locale":
        args.locale = argv[++i] || "en";
        break;
      case "--schema":
        args.schemaFile = argv[++i] || null;
        break;
      case "--table":
        args.table = argv[++i] || "users";
        break;
      case "--fields":
        args.fields = argv[++i] || null;
        break;
      case "--seed":
        args.seed = parseInt(argv[++i] || "0", 10);
        break;
      case "--no-color":
        args.noColor = true;
        break;
      case "--pretty":
        args.pretty = true;
        break;
    }
  }
  return args;
}

// ─── Random helpers ─────────────────────────────────────────────────────────
function pick<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length)];
}

function randInt(min: number, max: number): number {
  return randomInt(min, max + 1);
}

function randFloat(min: number, max: number, precision = 2): number {
  const val = Math.random() * (max - min) + min;
  return parseFloat(val.toFixed(precision));
}

// ─── Text generators ────────────────────────────────────────────────────────
const WORDS = [
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "it",
  "for", "not", "on", "with", "he", "as", "you", "do", "at", "this",
  "but", "his", "by", "from", "they", "we", "say", "her", "she", "or",
  "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know",
  "take", "people", "into", "year", "your", "good", "some", "could",
  "them", "see", "other", "than", "then", "now", "look", "only", "come",
  "its", "over", "think", "also", "back", "after", "use", "two", "how",
  "our", "work", "first", "well", "way", "even", "new", "want", "because",
  "any", "these", "give", "day", "most", "us", "great", "data", "system",
  "server", "cloud", "network", "deploy", "build", "test", "code", "api",
];

const COUNTRIES = [
  "United States", "United Kingdom", "Canada", "Australia", "Germany",
  "France", "Japan", "South Korea", "Brazil", "India", "Mexico",
  "Spain", "Italy", "Netherlands", "Sweden", "Norway", "Denmark",
  "Finland", "Switzerland", "Austria", "Portugal", "Ireland",
  "New Zealand", "Singapore", "Belgium", "Poland", "Czech Republic",
];

const TITLES = [
  "Software Engineer", "Product Manager", "Data Scientist", "DevOps Engineer",
  "Full Stack Developer", "Frontend Developer", "Backend Developer",
  "UX Designer", "QA Engineer", "Site Reliability Engineer",
  "Machine Learning Engineer", "Security Analyst", "Technical Lead",
  "Engineering Manager", "Solutions Architect", "Cloud Engineer",
  "Database Administrator", "System Administrator", "Network Engineer",
  "Mobile Developer",
];

// ─── Field generators ───────────────────────────────────────────────────────
function generateField(type: FieldType, locale: string, index: number): string | number | boolean {
  const dict = DATA[locale] || DATA["en"];

  switch (type) {
    case "id":
      return index + 1;
    case "uuid":
      return randomUUID();
    case "firstName":
      return pick(dict.firstNames);
    case "lastName":
      return pick(dict.lastNames);
    case "name":
      return `${pick(dict.firstNames)} ${pick(dict.lastNames)}`;
    case "email": {
      const first = pick(dict.firstNames).toLowerCase();
      const last = pick(dict.lastNames).toLowerCase();
      const sep = pick([".", "_", ""]);
      const num = randInt(1, 99);
      return `${first}${sep}${last}${num}@${pick(dict.domains)}`;
    }
    case "username": {
      const first = pick(dict.firstNames).toLowerCase();
      const num = randInt(1, 9999);
      return `${first}${num}`;
    }
    case "password":
      return `${pick(WORDS)}${pick(WORDS)}${randInt(100, 999)}!`;
    case "phone": {
      const area = randInt(200, 999);
      const mid = randInt(200, 999);
      const last = randInt(1000, 9999);
      return `+1-${area}-${mid}-${last}`;
    }
    case "address": {
      const num = randInt(1, 9999);
      return `${num} ${pick(dict.streets)}, ${pick(dict.cities)}`;
    }
    case "street":
      return `${randInt(1, 9999)} ${pick(dict.streets)}`;
    case "city":
      return pick(dict.cities);
    case "zip":
      return String(randInt(10000, 99999));
    case "country":
      return pick(COUNTRIES);
    case "date": {
      const year = randInt(1990, 2026);
      const month = String(randInt(1, 12)).padStart(2, "0");
      const day = String(randInt(1, 28)).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    case "datetime": {
      const year = randInt(2020, 2026);
      const month = String(randInt(1, 12)).padStart(2, "0");
      const day = String(randInt(1, 28)).padStart(2, "0");
      const hour = String(randInt(0, 23)).padStart(2, "0");
      const min = String(randInt(0, 59)).padStart(2, "0");
      const sec = String(randInt(0, 59)).padStart(2, "0");
      return `${year}-${month}-${day}T${hour}:${min}:${sec}Z`;
    }
    case "timestamp":
      return randInt(1577836800, 1767225600); // 2020-2026
    case "boolean":
      return Math.random() > 0.5;
    case "int":
      return randInt(1, 1000);
    case "float":
      return randFloat(0, 1000);
    case "age":
      return randInt(18, 90);
    case "text": {
      const len = randInt(3, 8);
      return Array.from({ length: len }, () => pick(WORDS)).join(" ");
    }
    case "paragraph": {
      const sentences = randInt(3, 6);
      const parts: string[] = [];
      for (let s = 0; s < sentences; s++) {
        const len = randInt(5, 15);
        const words = Array.from({ length: len }, () => pick(WORDS));
        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
        parts.push(words.join(" ") + ".");
      }
      return parts.join(" ");
    }
    case "url":
      return `https://${pick(WORDS)}-${pick(WORDS)}.${pick(["com", "io", "dev", "app", "org"])}`;
    case "ip":
      return `${randInt(1, 255)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}`;
    case "ipv6": {
      const segments = Array.from({ length: 8 }, () =>
        randInt(0, 65535).toString(16).padStart(4, "0")
      );
      return segments.join(":");
    }
    case "company":
      return pick(dict.companies);
    case "title":
      return pick(TITLES);
    case "color":
      return `#${randInt(0, 16777215).toString(16).padStart(6, "0")}`;
    case "latitude":
      return randFloat(-90, 90, 6);
    case "longitude":
      return randFloat(-180, 180, 6);
    default:
      return pick(WORDS);
  }
}

// ─── Parse schema file (simple YAML-like) ───────────────────────────────────
function parseSchemaFile(filePath: string): Schema {
  const content = readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  let table = "data";
  const fields: FieldDef[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    // table: name
    if (trimmed.startsWith("table:")) {
      table = trimmed.split(":")[1].trim();
      continue;
    }

    // field definitions: name: type or - name: type
    const cleaned = trimmed.replace(/^-\s*/, "");
    const colonIdx = cleaned.indexOf(":");
    if (colonIdx !== -1) {
      const name = cleaned.slice(0, colonIdx).trim();
      const type = cleaned.slice(colonIdx + 1).trim() as FieldType;
      if (name && type && name !== "table") {
        fields.push({ name, type });
      }
    }
  }

  return { table, fields };
}

// ─── Parse inline fields ────────────────────────────────────────────────────
function parseInlineFields(fieldsStr: string): FieldDef[] {
  return fieldsStr.split(",").map((f) => {
    const [name, type] = f.trim().split(":");
    return { name: name.trim(), type: (type?.trim() || "text") as FieldType };
  });
}

// ─── Default schema ─────────────────────────────────────────────────────────
function defaultSchema(table: string): Schema {
  return {
    table,
    fields: [
      { name: "id", type: "uuid" },
      { name: "name", type: "name" },
      { name: "email", type: "email" },
      { name: "phone", type: "phone" },
      { name: "city", type: "city" },
      { name: "created_at", type: "datetime" },
    ],
  };
}

// ─── Generate records ───────────────────────────────────────────────────────
function generate(
  schema: Schema,
  count: number,
  locale: string
): Record<string, string | number | boolean>[] {
  const records: Record<string, string | number | boolean>[] = [];

  for (let i = 0; i < count; i++) {
    const record: Record<string, string | number | boolean> = {};
    for (const field of schema.fields) {
      record[field.name] = generateField(field.type, locale, i);
    }
    records.push(record);
  }

  return records;
}

// ─── Output: JSON ───────────────────────────────────────────────────────────
function outputJSON(records: Record<string, unknown>[], pretty: boolean): void {
  if (pretty) {
    console.log(JSON.stringify(records, null, 2));
  } else {
    console.log(JSON.stringify(records));
  }
}

// ─── Output: CSV ────────────────────────────────────────────────────────────
function outputCSV(records: Record<string, unknown>[]): void {
  if (records.length === 0) return;

  const headers = Object.keys(records[0]);
  console.log(headers.join(","));

  for (const record of records) {
    const values = headers.map((h) => {
      const val = record[h];
      if (typeof val === "string" && (val.includes(",") || val.includes('"') || val.includes("\n"))) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return String(val);
    });
    console.log(values.join(","));
  }
}

// ─── Output: SQL ────────────────────────────────────────────────────────────
function outputSQL(
  records: Record<string, unknown>[],
  table: string
): void {
  if (records.length === 0) return;

  const headers = Object.keys(records[0]);

  for (const record of records) {
    const values = headers.map((h) => {
      const val = record[h];
      if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
      if (typeof val === "number") return String(val);
      return `'${String(val).replace(/'/g, "''")}'`;
    });

    console.log(
      `INSERT INTO ${table} (${headers.join(", ")}) VALUES (${values.join(", ")});`
    );
  }
}

// ─── Output: Table preview ──────────────────────────────────────────────────
function outputPreview(
  records: Record<string, unknown>[],
  schema: Schema,
  count: number,
  locale: string,
  format: string
): void {
  const previewCount = Math.min(5, records.length);
  const preview = records.slice(0, previewCount);

  process.stderr.write(`\n${c.bold}${c.cyan}  data-seed${c.reset} ${c.dim}v${VERSION}${c.reset}\n\n`);
  process.stderr.write(`  ${c.dim}Table:${c.reset}   ${c.bold}${schema.table}${c.reset}\n`);
  process.stderr.write(`  ${c.dim}Records:${c.reset} ${c.bold}${count}${c.reset}\n`);
  process.stderr.write(`  ${c.dim}Locale:${c.reset}  ${locale}\n`);
  process.stderr.write(`  ${c.dim}Format:${c.reset}  ${format}\n`);
  process.stderr.write(
    `  ${c.dim}Fields:${c.reset}  ${schema.fields.map((f) => `${c.cyan}${f.name}${c.reset}:${c.dim}${f.type}${c.reset}`).join(", ")}\n`
  );

  // Preview table
  if (previewCount > 0) {
    process.stderr.write(`\n  ${c.bold}Preview (first ${previewCount} records):${c.reset}\n\n`);
    const headers = Object.keys(preview[0]);

    // Calculate column widths
    const widths: Record<string, number> = {};
    for (const h of headers) {
      widths[h] = Math.min(25, Math.max(h.length, ...preview.map((r) => String(r[h]).length)));
    }

    // Header row
    const headerRow = headers.map((h) => h.padEnd(widths[h])).join("  ");
    process.stderr.write(`  ${c.bold}${headerRow}${c.reset}\n`);
    process.stderr.write(`  ${c.dim}${headers.map((h) => "─".repeat(widths[h])).join("  ")}${c.reset}\n`);

    // Data rows
    for (const record of preview) {
      const row = headers
        .map((h) => {
          const val = String(record[h]);
          return val.length > widths[h] ? val.slice(0, widths[h] - 2) + ".." : val.padEnd(widths[h]);
        })
        .join("  ");
      process.stderr.write(`  ${row}\n`);
    }
  }

  process.stderr.write(`\n  ${c.bgGreen}${c.white} Generated ${count} records ${c.reset}\n\n`);
}

// ─── Main ───────────────────────────────────────────────────────────────────
function main(): void {
  const args = parseArgs(process.argv);

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  // Resolve schema
  let schema: Schema;

  if (args.schemaFile) {
    const schemaPath = resolve(args.schemaFile);
    if (!existsSync(schemaPath)) {
      console.error(`${c.red}Error:${c.reset} Schema file not found: ${schemaPath}`);
      process.exit(1);
    }
    schema = parseSchemaFile(schemaPath);
  } else if (args.fields) {
    schema = {
      table: args.table,
      fields: parseInlineFields(args.fields),
    };
  } else {
    schema = defaultSchema(args.table);
  }

  // Generate data
  const records = generate(schema, args.count, args.locale);

  // Check if output is being piped
  const isPiped = !process.stdout.isTTY;

  // Output
  switch (args.format) {
    case "csv":
      if (!isPiped) outputPreview(records, schema, args.count, args.locale, args.format);
      outputCSV(records);
      break;
    case "sql":
      if (!isPiped) outputPreview(records, schema, args.count, args.locale, args.format);
      outputSQL(records, schema.table);
      break;
    case "json":
    default:
      if (args.json || isPiped) {
        outputJSON(records, args.pretty || !isPiped);
      } else {
        outputPreview(records, schema, args.count, args.locale, args.format);
        outputJSON(records, true);
      }
      break;
  }
}

main();
