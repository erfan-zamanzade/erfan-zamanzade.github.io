// Replace the static pipeline outline with the latest real run of the
// laravel-cicd-pipeline workflow on main. Without JavaScript, or when the
// GitHub API is unavailable, the outline and a link to the runs stay.
(() => {
  const repo = "erfan-zamanzade/laravel-cicd-pipeline";
  const api = `https://api.github.com/repos/${repo}/actions`;
  const list = document.querySelector("[data-stages]");
  const meta = document.querySelector("[data-run-meta]");
  if (!list || !meta || !window.fetch) return;

  const getJson = async (url) => {
    const response = await fetch(url, { headers: { Accept: "application/vnd.github+json" } });
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    return response.json();
  };

  const timeAgo = (iso) => {
    const seconds = Math.max(0, (Date.now() - Date.parse(iso)) / 1000);
    const units = [["day", 86400], ["hour", 3600], ["minute", 60]];
    for (const [unit, size] of units) {
      if (seconds >= size) {
        return new Intl.RelativeTimeFormat("en", { numeric: "auto" }).format(-Math.floor(seconds / size), unit);
      }
    }
    return "just now";
  };

  const stateOf = (job) => (job.status === "completed" ? job.conclusion || "neutral" : "running");

  const stateLabel = {
    success: "Passed",
    failure: "Failed",
    cancelled: "Cancelled",
    skipped: "Skipped",
    running: "Running",
    neutral: "Finished",
  };

  const link = (href, text) => {
    const a = document.createElement("a");
    a.href = href;
    a.textContent = text;
    return a;
  };

  (async () => {
    try {
      const runs = await getJson(`${api}/workflows/ci.yml/runs?branch=main&event=push&per_page=1`);
      const run = runs.workflow_runs && runs.workflow_runs[0];
      if (!run) return;
      const { jobs } = await getJson(`${api}/runs/${run.id}/jobs?per_page=20`);
      if (!jobs || jobs.length === 0) return;

      const items = jobs
        .sort((a, b) => a.id - b.id)
        .map((job) => {
          const state = stateOf(job);
          const li = document.createElement("li");
          li.className = "stage";
          li.dataset.state = state;
          const dot = document.createElement("span");
          dot.className = "dot";
          dot.setAttribute("aria-hidden", "true");
          const label = document.createElement("span");
          label.className = "state";
          label.textContent = stateLabel[state] || state;
          li.append(dot, job.name, label);
          return li;
        });
      list.replaceChildren(...items);
      list.style.setProperty("--count", String(items.length));
      list.classList.add("is-loaded");

      const code = document.createElement("code");
      code.textContent = run.head_sha.slice(0, 7);
      meta.replaceChildren(
        link(run.html_url, `Run #${run.run_number}`),
        " on main, commit ",
        code,
        `, ${timeAgo(run.updated_at)}`,
      );
    } catch (error) {
      const note = document.querySelector(".pipeline-note");
      if (note) note.textContent = "Live status is unavailable right now. The link above opens every run on GitHub.";
    }
  })();
})();
