(function () {
    const BIB_PATH = "/files/publications.bib";

    const CATEGORIES = [
        ["journal", "Journal papers"],
        ["conference", "Conference papers"],
        ["preprint", "Preprints"],
        ["thesis", "PhD thesis"],
    ];

    function parseBibtex(text) {
        const entries = [];
        let i = 0;
        while (i < text.length) {
            const at = text.indexOf("@", i);
            if (at === -1) break;
            const braceOpen = text.indexOf("{", at);
            if (braceOpen === -1) break;
            const type = text.slice(at + 1, braceOpen).trim().toLowerCase();
            let depth = 1;
            let j = braceOpen + 1;
            while (j < text.length && depth > 0) {
                if (text[j] === "{") depth++;
                else if (text[j] === "}") depth--;
                j++;
            }
            const body = text.slice(braceOpen + 1, j - 1);
            if (type !== "comment") {
                entries.push(parseEntryBody(type, body));
            }
            i = j;
        }
        return entries;
    }

    function parseEntryBody(type, body) {
        let depth = 0, k = 0;
        for (; k < body.length; k++) {
            if (body[k] === "{") depth++;
            else if (body[k] === "}") depth--;
            else if (body[k] === "," && depth === 0) break;
        }
        const key = body.slice(0, k).trim();
        const rest = body.slice(k + 1);
        const fields = {};
        let pos = 0;
        while (pos < rest.length) {
            while (pos < rest.length && /[\s,]/.test(rest[pos])) pos++;
            if (pos >= rest.length) break;
            const eq = rest.indexOf("=", pos);
            if (eq === -1) break;
            const fname = rest.slice(pos, eq).trim().toLowerCase();
            let vpos = eq + 1;
            while (vpos < rest.length && /\s/.test(rest[vpos])) vpos++;
            let value = "";
            if (rest[vpos] === "{") {
                let d = 1, vs = vpos + 1, ve = vs;
                while (ve < rest.length && d > 0) {
                    if (rest[ve] === "{") d++;
                    else if (rest[ve] === "}") d--;
                    if (d > 0) ve++;
                }
                value = rest.slice(vs, ve);
                pos = ve + 1;
            } else {
                let ve = vpos, d = 0;
                while (ve < rest.length && !(rest[ve] === "," && d === 0)) {
                    if (rest[ve] === "{") d++;
                    else if (rest[ve] === "}") d--;
                    ve++;
                }
                value = rest.slice(vpos, ve).trim();
                pos = ve;
            }
            fields[fname] = value.replace(/\s+/g, " ").trim();
            pos++;
        }
        return { type, key, fields };
    }

    function escapeHtml(s) {
        return s
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function renderAuthors(authorField) {
        if (!authorField) return "";
        return authorField
            .split(/\s+and\s+/)
            .map((n) => escapeHtml(n.trim()))
            .join(", ");
    }

    const NAME_PARTICLES = ["de", "van", "von", "der", "den", "du", "la", "le", "del", "dos", "das", "di", "da"];

    function surnameOf(fullName) {
        const tokens = fullName.replace(/\*/g, "").trim().split(/\s+/);
        if (tokens.length <= 1) return tokens[0] || "";
        const secondLast = tokens[tokens.length - 2].toLowerCase();
        if (NAME_PARTICLES.includes(secondLast)) {
            return tokens.slice(-2).join(" ");
        }
        return tokens[tokens.length - 1];
    }

    function renderAuthorsShort(authorField) {
        if (!authorField) return "";
        const names = authorField.split(/\s+and\s+/).map((n) => n.trim());
        if (names.length === 1) return escapeHtml(surnameOf(names[0]));
        if (names.length === 2) {
            return `${escapeHtml(surnameOf(names[0]))} and ${escapeHtml(surnameOf(names[1]))}`;
        }
        return `${escapeHtml(surnameOf(names[0]))} et al.`;
    }

    function renderLinks(linksField) {
        if (!linksField) return "";
        return linksField
            .split(";")
            .map((pair) => pair.trim())
            .filter(Boolean)
            .map((pair) => {
                const idx = pair.indexOf("::");
                if (idx === -1) return "";
                const label = escapeHtml(pair.slice(0, idx).trim());
                const url = escapeHtml(pair.slice(idx + 2).trim());
                return `<a class="btn-link" href="${url}">${label}</a>`;
            })
            .join("");
    }

    function fetchBib() {
        return fetch(BIB_PATH)
            .then((res) => res.text())
            .then((text) => parseBibtex(text));
    }

    /* ---- shared helpers: derive display text from whichever fields exist ---- */

    function paperUrl(entry) {
        const f = entry.fields;
        if (f.venue_url) return f.venue_url;
        if (f.doi) return `https://doi.org/${f.doi}`;
        if (f.url) return f.url;
        return "";
    }

    // Short "venue (year)" label, e.g. "arXiv (2026)" or, synthesized from
    // standard fields, "Journal of The Royal Society Interface (2025)".
    function shortVenueText(entry) {
        const f = entry.fields;
        if (f.venue) return f.venue;
        if (f.journal) return f.year ? `${f.journal} (${f.year})` : f.journal;
        return "";
    }

    /* ---- publications.html: categorized list ---- */

    function renderReferenceText(entry) {
        const text = entry.fields.reference || shortVenueText(entry);
        return `<span class="ref-text">${escapeHtml(text)}</span>`;
    }

    function renderLinksRow(entry) {
        const parts = [];
        const url = paperUrl(entry);
        if (url) {
            const label = (entry.fields.category || "").toLowerCase() === "thesis" ? "Full text" : "Paper";
            parts.push(`<a class="btn-link" href="${escapeHtml(url)}">${label}</a>`);
        }
        const extra = renderLinks(entry.fields.links);
        if (extra) parts.push(extra);
        return parts.join("");
    }

    function renderEntry(entry) {
        const title = escapeHtml(entry.fields.title || "");
        const authors = renderAuthors(entry.fields.author);
        const referenceText = renderReferenceText(entry);
        const linksRow = renderLinksRow(entry);
        return `<li>
            <p id="${entry.key}">
                <strong>${title}</strong><br />
                ${authors}<br />
                ${referenceText}${linksRow ? `<br />\n                ${linksRow}` : ""}
            </p>
        </li>`;
    }

    function renderPubList(container, entries) {
        const byCategory = {};
        entries.forEach((entry) => {
            const cat = (entry.fields.category || "").toLowerCase();
            if (!byCategory[cat]) byCategory[cat] = [];
            byCategory[cat].push(entry);
        });

        const html = CATEGORIES.filter(([cat]) => byCategory[cat] && byCategory[cat].length)
            .map(([cat, label]) => {
                const items = byCategory[cat].map(renderEntry).join("\n");
                return `<h2>${label}</h2>\n<ol>\n${items}\n</ol>`;
            })
            .join("\n");

        container.innerHTML = html;
    }

    function applyHashHighlight() {
        const hash = window.location.hash;
        if (!hash) return;
        const ids = hash.slice(1).split(",");

        ids.forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.classList.add("highlighted");
        });

        const firstEl = document.getElementById(ids[0]);
        if (firstEl) {
            const tempId = firstEl.id;
            firstEl.removeAttribute("id");

            window.scrollTo(0, 0);

            setTimeout(() => {
                firstEl.setAttribute("id", tempId);
                const headerOffset = 80;
                const y = Math.max(
                    0,
                    firstEl.getBoundingClientRect().top + window.pageYOffset - headerOffset
                );
                window.scrollTo({ top: y, behavior: "smooth" });
            }, 50);
        }
    }

    function initPubList() {
        const container = document.getElementById("pub-list");
        if (!container) return;

        fetchBib()
            .then((entries) => {
                renderPubList(container, entries);
                applyHashHighlight();
            })
            .catch((err) => {
                container.innerHTML = "<p>Could not load publications.</p>";
                console.error("Failed to load publications.bib:", err);
            });
    }

    /* ---- index.html: numbered citations + references list ---- */

    function renderReferenceItem(entry) {
        const title = escapeHtml(entry.fields.title || "");
        const authorsShort = renderAuthorsShort(entry.fields.author);
        const authorsPunct = `${authorsShort},`;
        const venueText = shortVenueText(entry);
        const venue = venueText ? `<span class="ref-text">${escapeHtml(venueText)}</span>` : "";
        const pubLink = `<a class="btn-link" href="/publications.html#${entry.key}">Publication</a>`;
        const tail = venue ? `${venue} <span class="sep">|</span> ${pubLink}` : pubLink;
        return `<li id="ref-${entry.key}">
            <p>
                ${authorsPunct} ${title}. ${tail}
            </p>
        </li>`;
    }

    function initCitations() {
        const markers = document.querySelectorAll(".cite-ref");
        if (!markers.length) return;

        fetchBib()
            .then((entries) => {
                const byKey = {};
                entries.forEach((e) => (byKey[e.key] = e));

                const order = [];
                const numberOf = {};
                markers.forEach((m) => {
                    const keys = (m.dataset.keys || "").split(",").map((s) => s.trim()).filter(Boolean);
                    keys.forEach((k) => {
                        if (!(k in numberOf)) {
                            numberOf[k] = order.length + 1;
                            order.push(k);
                        }
                    });
                });

                markers.forEach((m) => {
                    const keys = (m.dataset.keys || "").split(",").map((s) => s.trim()).filter(Boolean);
                    const parts = keys.map((k) => `<a href="#ref-${k}">${numberOf[k]}</a>`);
                    m.innerHTML = `[${parts.join(", ")}]`;
                });

                const list = document.getElementById("references-list");
                if (list) {
                    list.innerHTML = order.map((k) => renderReferenceItem(byKey[k])).join("\n");
                }
            })
            .catch((err) => {
                console.error("Failed to load publications.bib:", err);
            });
    }

    document.addEventListener("DOMContentLoaded", () => {
        initPubList();
        initCitations();
    });
})();
