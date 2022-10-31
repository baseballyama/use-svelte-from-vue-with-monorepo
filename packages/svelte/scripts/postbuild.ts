import { emitDts } from "svelte2tsx";
import {
  mkdtempSync,
  rmSync,
  readdirSync,
  statSync,
  copyFileSync,
  constants,
} from "node:fs";

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

(async () => {
  const tempDir = mkdtempSync("./");
  try {
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
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
})();
