# erfan-zamanzade.github.io

Source of my personal site: https://erfan-zamanzade.github.io/

Plain HTML, CSS and a few lines of JavaScript, with no build step and no third-party requests except the GitHub API.
The "Latest pipeline run" panel reads the most recent `main` run of
[laravel-cicd-pipeline](https://github.com/erfan-zamanzade/laravel-cicd-pipeline) from the public GitHub API in the
visitor's browser; without JavaScript it falls back to a link to the runs.

## How it is checked and deployed

[`.github/workflows/pages.yml`](.github/workflows/pages.yml) runs on every push and pull request:

1. `html-validate` checks the markup.
2. `lychee` checks every link (LinkedIn is excluded because it rejects automated requests).
3. On `main` only, the site files are uploaded and deployed with GitHub Pages.

Actions are pinned to commit SHAs and Dependabot proposes updates.

## Run it locally

```bash
python3 -m http.server 8000
```

## Credits

The [Schibsted Grotesk](https://github.com/schibsted/schibsted-grotesk) font is self-hosted under the SIL Open Font
License 1.1 (see [`assets/fonts/OFL.txt`](assets/fonts/OFL.txt)).
