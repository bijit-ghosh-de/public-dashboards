/* Freshness strip shared by the dashboards (no dependencies).
   FreshStrip.render(el, {generated, barDate}) shows when the data file was
   produced, which trading day its prices are from, and whether that is late.
   Prices are always the LAST COMPLETED session, so one trading day behind is
   normal during the day; two is a warning (late run or holiday); three or
   more is stale. */
(function (root) {
  function parseUtc(s) {                       // "2026-10-14T17:28:25" or "2026-10-14 17:40" (UTC, no zone)
    if (!s) return null;
    s = String(s).trim().replace(" ", "T");
    if (!/[zZ]|[+-]\d\d:?\d\d$/.test(s)) s += "Z";
    const d = new Date(s);
    return isNaN(d) ? null : d;
  }
  function ymd(d) {                            // local calendar date as a comparable number
    return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  }
  function weekdaysAfter(barDate, now) {       // Mon-Fri days after barDate, up to and including today
    const m = /^(\d{4})-(\d\d)-(\d\d)$/.exec(barDate || "");
    if (!m) return null;
    const d = new Date(+m[1], +m[2] - 1, +m[3]);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    let n = 0;
    for (d.setDate(d.getDate() + 1); d <= end; d.setDate(d.getDate() + 1)) {
      const wd = d.getDay();
      if (wd !== 0 && wd !== 6) n++;
    }
    return n;
  }
  function describe(opts, now) {
    now = now || new Date();
    const gen = parseUtc(opts.generated);
    const lag = weekdaysAfter(opts.barDate, now);
    let level = "ok";
    if (lag === null || !gen) level = "warn";
    else if (lag >= 3) level = "bad";
    else if (lag === 2) level = "warn";
    const genTxt = gen
      ? gen.toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" })
      : "unknown";
    let barTxt = "unknown";
    if (opts.barDate) {
      const [y, mo, da] = opts.barDate.split("-").map(Number);
      barTxt = new Date(y, mo - 1, da).toLocaleDateString([], { month: "short", day: "numeric" }) + " close";
    }
    const lagTxt = lag === null ? "" : lag === 0 ? " (current)" : ` (${lag} trading day${lag === 1 ? "" : "s"} behind)`;
    let flag = "";
    if (level === "bad") flag = " STALE: the daily job has not produced new prices for 3+ trading days.";
    else if (level === "warn" && lag === 2) flag = " Running late (or a market holiday).";
    else if (level === "warn") flag = " Date information is missing.";
    return {
      level,
      text: `Data generated ${genTxt} · prices as of ${barTxt}${lagTxt}.${flag}`,
      hint: "Updates once each weekday morning (GitHub often starts it late). Never intraday.",
    };
  }
  function render(el, opts) {
    if (!el) return;
    const r = describe(opts);
    const color = { ok: "var(--text-dim,#5a8a5a)", warn: "var(--warn,#e6b800)", bad: "var(--fail,#ff4444)" }[r.level];
    el.style.cssText = `margin:6px 0 12px;font-size:12px;border-left:3px solid ${color};padding:2px 0 2px 10px;color:${color}`;
    el.innerHTML = "";
    const a = document.createElement("div"); a.textContent = r.text;
    const b = document.createElement("div"); b.textContent = r.hint; b.style.opacity = "0.7";
    el.appendChild(a); el.appendChild(b);
  }
  const api = { render, describe, parseUtc, weekdaysAfter };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.FreshStrip = api;
})(typeof window !== "undefined" ? window : globalThis);
