# @lxgicstudios/data-seed

[![npm version](https://img.shields.io/npm/v/@lxgicstudios/data-seed.svg)](https://www.npmjs.com/package/@lxgicstudios/data-seed)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18-brightgreen.svg)](https://nodejs.org)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-0-blue.svg)](https://www.npmjs.com/package/@lxgicstudios/data-seed)

Generate realistic fake data for database seeding. Names, emails, addresses, dates, UUIDs, and more. Output JSON, CSV, or SQL. Zero dependencies.

## Install

```bash
# Run directly
npx @lxgicstudios/data-seed

# Or install globally
npm install -g @lxgicstudios/data-seed
```

## Usage

```bash
# Generate 10 user records (default)
data-seed

# Generate 1000 records
data-seed --count 1000

# Custom fields with SQL output
data-seed --fields "id:uuid,name:name,email:email,age:int" --format sql

# CSV for import
data-seed --count 500 --format csv > users.csv

# Japanese locale
data-seed --locale ja --count 50

# Load schema from file
data-seed --schema schema.yml --count 1000 --format sql
```

## Features

- 30+ field types (names, emails, phones, addresses, UUIDs, dates, and more)
- JSON, CSV, and SQL output formats
- Multi-locale support (English and Japanese built in)
- Schema files for repeatable data generation
- Inline field definitions for quick use
- TTY-aware output (preview table in terminal, raw data when piped)
- Built-in data dictionaries with hundreds of realistic values
- Zero external dependencies (uses Node's `crypto` module)

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--help` | Show help message | - |
| `--json` | Output as JSON | json |
| `--format <fmt>` | Output format: json, csv, sql | json |
| `--count <n>` | Number of records | 10 |
| `--locale <code>` | Locale: en, ja | en |
| `--schema <file>` | Schema file path | - |
| `--table <name>` | Table name for SQL | users |
| `--fields <defs>` | Inline fields (name:type,...) | - |
| `--pretty` | Pretty-print JSON | - |
| `--no-color` | Disable colors | - |

## Field Types

| Type | Example | Type | Example |
|------|---------|------|---------|
| `name` | Sarah Johnson | `email` | sarah_johnson42@gmail.com |
| `firstName` | Sarah | `lastName` | Johnson |
| `phone` | +1-555-234-5678 | `address` | 42 Oak Ave, Denver |
| `city` | Denver | `street` | 42 Oak Ave |
| `zip` | 80202 | `country` | United States |
| `date` | 2024-03-15 | `datetime` | 2024-03-15T14:30:00Z |
| `uuid` | a1b2c3d4-... | `id` | 1, 2, 3... |
| `boolean` | true | `int` | 42 |
| `float` | 3.14 | `age` | 28 |
| `url` | https://build-code.dev | `ip` | 192.168.1.42 |
| `company` | Acme Corp | `username` | sarah1234 |
| `latitude` | 39.739236 | `longitude` | -104.990251 |
| `color` | #ff5733 | `title` | Software Engineer |
| `text` | Short random text | `paragraph` | Multiple sentences. |

## Schema File Format

Create a simple YAML-like schema file:

```yaml
# schema.yml
table: employees
id: uuid
name: name
email: email
department: company
hire_date: date
salary: float
active: boolean
```

Then run:

```bash
data-seed --schema schema.yml --count 1000 --format sql
```

## License

MIT - [LXGIC Studios](https://lxgicstudios.com)
