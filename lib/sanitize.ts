import sanitizeHtml from "sanitize-html";

export function sanitizeJD(dirtyHtmlOrText: string): string {
  if (!dirtyHtmlOrText) return "";

  // If text doesn't contain HTML tags, convert newlines to paragraphs
  if (!dirtyHtmlOrText.includes("<") || !dirtyHtmlOrText.includes(">")) {
    return dirtyHtmlOrText
      .split(/\n{2,}/)
      .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
      .join("");
  }

  return sanitizeHtml(dirtyHtmlOrText, {
    allowedTags: [
      "h1", "h2", "h3", "h4", "h5", "h6",
      "p", "b", "i", "strong", "em", "strike",
      "ul", "ol", "li", "br", "hr",
      "span", "blockquote", "code", "pre"
    ],
    allowedAttributes: {
      span: ["class"],
      p: ["class"],
      li: ["class"],
      ul: ["class"],
      ol: ["class"],
    },
  });
}

