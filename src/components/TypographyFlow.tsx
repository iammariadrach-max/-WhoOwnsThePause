import { useEffect } from "react";

// Keep short Russian prepositions and conjunctions with the following word,
// including labels and prose inserted by interactive scenes.
const shortWord = /(^|[\s«„(—])((?:в|во|на|к|ко|с|со|о|об|обо|у|по|из|из-за|из-под|от|до|за|под|над|при|для|без|про|перед|через|между|и|а|но|не|ни|или)) +(?=\S)/giu;
export function bindPrepositions(text: string) {
  let result = text;
  for (let pass = 0; pass < 3; pass++) result = result.replace(shortWord, "$1$2\u00a0");
  return result;
}
export default function TypographyFlow() {
  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    const update = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        if (node.parentElement?.closest("script,style,pre,code,textarea,svg")) return;
        const before = node.nodeValue ?? "";
        const after = bindPrepositions(before);
        if (before !== after) node.nodeValue = after;
      } else {
        const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) update(walker.currentNode);
      }
    };
    const revealSource = () => {
      if (!/^#source-\d+$/.test(location.hash)) return;
      const sources = document.querySelector<HTMLDetailsElement>("details#sources");
      if (sources) sources.open = true;
    };
    revealSource();
    window.addEventListener("hashchange", revealSource);
    update(root);
    const observer = new MutationObserver(records => {
      for (const record of records) {
        if (record.type === "characterData") update(record.target);
        else record.addedNodes.forEach(update);
      }
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    return () => { observer.disconnect(); window.removeEventListener("hashchange", revealSource); };
  }, []);
  return null;
}
