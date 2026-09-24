import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateMakeCodeFile } from '../testing/makecode-validator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, '../..');
const projectsDir = path.resolve(workspaceRoot, 'projects');

describe('MakeCode Static TypeScript Compatibility Suite', () => {
    const projectEntries = fs.readdirSync(projectsDir, { withFileTypes: true });
    const projectDirs = projectEntries.filter(entry => entry.isDirectory()).map(entry => entry.name);

    it('has at least one project defined', () => {
        expect(projectDirs.length).toBeGreaterThan(0);
    });

    for (const projectName of projectDirs) {
        it(`verifies projects/${projectName}/main.ts complies with MakeCode rules`, () => {
            const mainPath = path.resolve(projectsDir, projectName, 'main.ts');
            expect(fs.existsSync(mainPath)).toBe(true);

            const result = validateMakeCodeFile(mainPath);
            if (!result.valid) {
                console.error(`\n❌ MakeCode compatibility errors in projects/${projectName}/main.ts:\n` + result.errors.join('\n'));
            }
            expect(result.errors).toEqual([]);
            expect(result.valid).toBe(true);
        });
    }
});
