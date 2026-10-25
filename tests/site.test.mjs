import { test } from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { runInNewContext } from "node:vm";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const html = await readFile(join(root, "index.html"), "utf8");
const css = await readFile(join(root, "style.css"), "utf8");
const js = await readFile(join(root, "script.js"), "utf8");

test("Главная страница содержит обязательные секции и контакты", () => {
  for (const id of ["about", "portfolio", "certificates", "contacts"]) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /MagistrDev/);
  assert.match(html, /contact@magistr\.dev/);
  assert.match(html, /@magistr_dev/);
});

test("Тема переключается JavaScript и имеет стили для тёмного режима", () => {
  assert.match(html, /id="theme-toggle"/);
  assert.match(js, /addEventListener\("click"/);
  assert.match(js, /localStorage/);
  assert.match(css, /:root\[data-theme="dark"\]/);
});

test("Все семь локальных JPG-изображений существуют", async () => {
  const paths = [...html.matchAll(/src="\.\/(images\/[^"]+\.jpg)"/g)].map(match => match[1]);
  assert.equal(paths.length, 7);
  for (const path of paths) {
    await access(join(root, path));
  }
});


test("Кнопка действительно переключает тему, текст, aria-pressed и localStorage", () => {
  const attributes = new Map();
  const saved = new Map();
  const icon = { textContent: "" };
  const label = { textContent: "" };
  const year = { textContent: "" };
  let onClick;
  const button = {
    querySelector: () => icon,
    setAttribute: (name, value) => attributes.set(name, value),
    addEventListener: (_event, callback) => { onClick = callback; }
  };
  const document = {
    documentElement: {
      setAttribute: (name, value) => attributes.set(name, value),
      getAttribute: name => attributes.get(name)
    },
    getElementById: id => ({
      "theme-toggle": button,
      "theme-label": label,
      "year": year
    })[id]
  };
  const window = {
    localStorage: {
      getItem: key => saved.get(key) ?? null,
      setItem: (key, value) => saved.set(key, value)
    }
  };

  runInNewContext(js, { document, window, Date, String });
  assert.equal(attributes.get("data-theme"), "light");
  assert.equal(label.textContent, "Тёмная тема");
  onClick();
  assert.equal(attributes.get("data-theme"), "dark");
  assert.equal(attributes.get("aria-pressed"), "true");
  assert.equal(saved.get("magistrdev-theme"), "dark");
  assert.equal(label.textContent, "Светлая тема");
  onClick();
  assert.equal(attributes.get("data-theme"), "light");
  assert.equal(saved.get("magistrdev-theme"), "light");
});
