import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";

const GENERATED_DIR = path.resolve("src/generated");
const SOURCE_FILE_EXTENSIONS = new Set([".js", ".mjs", ".cjs", ".json"]);

async function walk(dir) {
	const entries = await readdir(dir, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			files.push(...(await walk(fullPath)));
			continue;
		}

		if (entry.isFile() && fullPath.endsWith(".ts")) {
			files.push(fullPath);
		}
	}

	return files;
}

function shouldAppendJs(specifier) {
	if (!specifier.startsWith("./") && !specifier.startsWith("../")) {
		return false;
	}

	return !SOURCE_FILE_EXTENSIONS.has(path.extname(specifier));
}

function rewriteRelativeSpecifiers(source) {
	return source.replace(
		/\b(from\s+["'])(\.{1,2}\/[^"'?\n]+)(["'])/g,
		(_, prefix, specifier, suffix) => `${prefix}${shouldAppendJs(specifier) ? `${specifier}.js` : specifier}${suffix}`,
	);
}

async function main() {
	const dirStats = await stat(GENERATED_DIR).catch(() => null);

	if (!dirStats?.isDirectory()) {
		console.log(`Skipping import fix: ${GENERATED_DIR} does not exist.`);
		return;
	}

	const files = await walk(GENERATED_DIR);
	let changedFiles = 0;

	for (const filePath of files) {
		const original = await readFile(filePath, "utf8");
		const updated = rewriteRelativeSpecifiers(original);

		if (updated === original) {
			continue;
		}

		await writeFile(filePath, updated, "utf8");
		changedFiles += 1;
	}

	console.log(`Updated relative imports in ${changedFiles} generated file(s).`);
}

await main();
