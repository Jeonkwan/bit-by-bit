import fs from 'node:fs';

export interface ValidationResult {
    valid: boolean;
    errors: string[];
}

/**
 * Validates that source code adheres to MakeCode Static TypeScript constraints:
 * 1. No top-level `export` keywords (MakeCode top-level scope is already exported;
 *    `export` triggers: "all symbols in the top level scope are always exported.
 *    Please use a namespace if you want to export only some.")
 * 2. No `import` statements (MakeCode environment provides global ambient namespaces).
 * 3. No unsupported browser/Node.js host APIs (e.g., window, document, process, eval).
 */
export function validateMakeCodeSource(source: string, filename = 'main.ts'): ValidationResult {
    const errors: string[] = [];
    const lines = source.split('\n');

    lines.forEach((line, index) => {
        const lineNum = index + 1;
        const trimmed = line.trim();

        // Skip comments
        if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
            return;
        }

        // Check for top-level export
        if (/^export\s+/.test(trimmed)) {
            errors.push(
                `Line ${lineNum}: Top-level 'export' found: "${trimmed}". ` +
                `MakeCode compiles in a global project scope and rejects top-level exports with: ` +
                `"all symbols in the top level scope are always exported. Please use a namespace if you want to export only some." ` +
                `Remove the 'export' keyword.`
            );
        }

        // Check for import statements
        if (/^import\s+/.test(trimmed)) {
            errors.push(
                `Line ${lineNum}: 'import' statement found: "${trimmed}". ` +
                `MakeCode scripts run in an ambient environment with global namespaces. Do not use ES module imports.`
            );
        }

        // Check for forbidden browser / Node APIs
        if (/\b(window|document|eval\(|process\.env)\b/.test(trimmed)) {
            errors.push(
                `Line ${lineNum}: Unsupported environment global found: "${trimmed}". ` +
                `MakeCode Static TypeScript runs on bare-metal hardware and does not support browser/Node APIs.`
            );
        }

        // Check for non-literal basic.showLeds calls
        // In MakeCode STS, basic.showLeds only accepts literal string/template image blocks, not variable expressions
        if (/basic\.showLeds\s*\(\s*[^"`']/.test(trimmed)) {
            errors.push(
                `Line ${lineNum}: 'basic.showLeds()' only supports image string literals in MakeCode Static TypeScript. ` +
                `Found dynamic expression: "${trimmed}". Use template string literals \`... \` directly.`
            );
        }
    });

    return {
        valid: errors.length === 0,
        errors,
    };
}

export function validateMakeCodeFile(filePath: string): ValidationResult {
    if (!fs.existsSync(filePath)) {
        return {
            valid: false,
            errors: [`File does not exist: ${filePath}`],
        };
    }
    const source = fs.readFileSync(filePath, 'utf-8');
    return validateMakeCodeSource(source, filePath);
}
