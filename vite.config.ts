import { defineConfig, Plugin, ResolvedConfig } from 'vite'
import { createFilter } from "@rollup/pluginutils";
import react from '@vitejs/plugin-react'
import { JSDOM } from 'jsdom';
import prettier from 'prettier';
import { join, resolve } from 'path'
import type { Options as PrettierOptions } from 'prettier';

const createDom = (source: string | Uint8Array): JSDOM =>
  new JSDOM(source);

const createModulePreloadLinkElement = (dom: JSDOM, path: string) => {
  const link = dom.window.document.createElement("link");
  link.rel = "modulepreload";
  link.href = path;
  return link;
};

const createPrefetchLinkElement = (dom: JSDOM, path: string) => {
  const link = dom.window.document.createElement("link");
  link.rel = "prefetch";
  link.href = path;
  return link;
};

const createStylesheetLinkElement = (dom: JSDOM, path: string) => {
  const link = dom.window.document.createElement("link");
  link.rel = "stylesheet";
  link.href = path;
  return link;
};

const getExistingLinks = (dom: JSDOM): string[] => {
  const existingLinks: string[] = [];

  dom.window.document
    .querySelectorAll<HTMLScriptElement>("script")
    .forEach((s) => {
      if (!s.src) {
        return;
      }
      existingLinks.push(s.src);
    });

  dom.window.document
    .querySelectorAll<HTMLLinkElement>("link")
    .forEach((l) => existingLinks.push(l.href));

  return existingLinks;
};

const appendToDom = (dom: JSDOM, link: HTMLElement) =>
  dom.window.document.head.appendChild(link);
  
interface PreloadOptions {
  /**
   * @default true
   */
  includeJs: boolean;
  /**
   * @default true
   */
  includeCss: boolean;
  /**
   * @default true
   */
  format?: boolean | Omit<PrettierOptions, "parser">;
  /**
   * @default modulepreload
   */
  rel?: 'modulepreload' | 'prefetch';
}

const defaultOptions: PreloadOptions = {
  includeJs: true,
  includeCss: true,
  format: true,
  rel: 'modulepreload',
};

const jsFilter = createFilter(["**/*-*.js"]);
const cssFilter = createFilter(["**/*-*.css"]);

function VitePluginPreloadAll(
  options?: Partial<PreloadOptions>
): Plugin {
  let viteConfig: ResolvedConfig;
  const mergedOptions = { ...defaultOptions, ...options };

  return {
    name: "vite:vite-plugin-preload",
    enforce: "post",
    apply: "build",
    configResolved(config) {
      viteConfig = config;
    },
    transformIndexHtml: {
      enforce: "post",
      transform: (html, ctx) => {
        if (!ctx.bundle) {
          return html;
        }

        const base = viteConfig.base ?? "";
        const dom = createDom(html);
        const existingLinks = getExistingLinks(dom);
        let additionalModules: string[] = [];
        let additionalStylesheets: string[] = [];

        for (const bundle of Object.values(ctx.bundle)) {
          const path = join(base, bundle.fileName).split('\\').join('/');

          if (existingLinks.includes(path)) {
            continue;
          }

          if (
            mergedOptions.includeJs &&
            bundle.type === "chunk" &&
            jsFilter(bundle.fileName)
          ) {
            additionalModules.push(path);
          }

          if (
            mergedOptions.includeCss &&
            bundle.type === "asset" &&
            cssFilter(bundle.fileName)
          ) {
            additionalStylesheets.push(path);
          }
        }

        additionalModules = additionalModules.sort((a, z) =>
          a.localeCompare(z)
        );

        additionalStylesheets = additionalStylesheets.sort((a, z) =>
          a.localeCompare(z)
        );

        if (mergedOptions.rel === 'modulepreload') {
          for (const additionalModule of additionalModules) {
            const element = createModulePreloadLinkElement(dom, additionalModule);
            appendToDom(dom, element);
          }

          for (const additionalStylesheet of additionalStylesheets) {
            const element = createStylesheetLinkElement(
              dom,
              additionalStylesheet
            );
            appendToDom(dom, element);
          }
        } else if (mergedOptions.rel === 'prefetch') {
          for (const additionalModule of additionalModules) {
            const element = createPrefetchLinkElement(dom, additionalModule);
            appendToDom(dom, element);
          }

          for (const additionalStylesheet of additionalStylesheets) {
            const element = createPrefetchLinkElement(
              dom,
              additionalStylesheet
            );
            appendToDom(dom, element);
          }
        } else {
          throw new Error(`Unsupported "rel" option: ${mergedOptions.rel}`);
        }

        const unformattedHtml = dom.serialize();

        if (mergedOptions.format === false) {
          return unformattedHtml;
        }

        return prettier.format(unformattedHtml, {
          ...(typeof mergedOptions.format === "object"
            ? mergedOptions.format
            : {}),
          parser: "html",
        });
      },
    },
  };
}



// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      src: resolve(__dirname, './src')
    },
  },
  plugins: [react(), VitePluginPreloadAll({
    rel: 'prefetch',
  })],
})
