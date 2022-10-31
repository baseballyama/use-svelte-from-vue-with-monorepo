import { emitDts } from "svelte2tsx";
import {
  mkdtempSync,
  rmSync,
  readdirSync,
  statSync,
  copyFileSync,
  writeFileSync,
  readFileSync,
  constants,
} from "node:fs";
import { entry } from "./constants.js";
import * as ts from "typescript";

const createTypes = async (tempDir: string) => {
  await emitDts({
    declarationDir: tempDir,
    svelteShimsPath: "svelte2tsx/svelte-shims.d.ts",
    libRoot: "./",
  });
};

const getFiles = (dir: string) => {
  const result: string[] = [];
  const files = readdirSync(dir);
  files.forEach((f) => {
    const path = `${dir}/${f}`;
    statSync(path).isDirectory()
      ? result.push(...getFiles(path))
      : result.push(path);
  });
  return result;
};

const createEntryFile = () => {
  const entryFile = Object.keys(entry).map((key) => {
    return `export { default as ${key} } from "./${key}";`;
  });
  const str = entryFile.join("\r");
  writeFileSync("./dist/main.js", str);
  writeFileSync("./dist/main.d.ts", str);
};

(async () => {
  const tempDir = mkdtempSync("./");
  try {
    // Generate types for Svelte components
    await createTypes(tempDir);
    const distFiles = getFiles("./dist");
    const distJsFiles = distFiles.filter((f) => f.endsWith(".js"));
    const tempFiles = getFiles(tempDir);
    const tempTypeFiles = tempFiles.filter((f) => f.endsWith(".d.ts"));
    distJsFiles.forEach((distJsFile) => {
      const jsFileName = distJsFile.split("/").pop()?.split(".")[0];
      const tempTypeFile = tempTypeFiles.find((f) =>
        f.endsWith(`${jsFileName}.svelte.d.ts`)
      );
      if (!tempTypeFile) {
        throw Error(`'${jsFileName}.svelte.d.ts' is not found.`);
      }
      copyFileSync(
        tempTypeFile,
        distJsFile.replace(".js", ".d.ts"),
        constants.COPYFILE_FICLONE
      );
    });

    createEntryFile();
  } catch (e) {
    console.error(e);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
})();
