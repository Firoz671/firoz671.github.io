import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const USERNAME = (process.env.GITHUB_USERNAME || 'firoz671').trim();
const API_BASE = (process.env.GITHUB_API_BASE || 'https://api.github.com').replace(/\/+$/, '');
const TOKEN = (process.env.GITHUB_TOKEN || '').trim();

const OUTPUT_PATH = fileURLToPath(new URL('../src/data/github.json', import.meta.url));
const PORTFOLIO_PATH = fileURLToPath(new URL('../src/data/portfolio.ts', import.meta.url));

function warn(message) {
  console.warn(`[github] ${message}`);
}

function headers(extra = {}) {
  const result = {
    Accept: 'application/vnd.github+json',
    'User-Agent': `${USERNAME}-portfolio-build`,
    'X-GitHub-Api-Version': '2022-11-28',
    ...extra,
  };

  if (TOKEN) {
    result.Authorization = `Bearer ${TOKEN}`;
  }

  return result;
}

async function getJson(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url, { headers: headers() });

  if (!response.ok) {
    let detail = '';

    try {
      const body = await response.json();
      detail = body && typeof body.message === 'string' ? `: ${body.message}` : '';
    } catch {
      detail = '';
    }

    throw new Error(`GitHub API ${response.status} ${response.statusText} for ${path}${detail}`);
  }

  return response.json();
}

function readStringArray(source, key) {
  const match = source.match(new RegExp(`${key}\\s*:\\s*\\[([\\s\\S]*?)\\]`));

  if (!match) {
    return [];
  }

  return [...match[1].matchAll(/["']([^"']+)["']/g)].map((item) => item[1]);
}

async function readRepoLists() {
  try {
    const source = await readFile(PORTFOLIO_PATH, 'utf8');
    const block = source.match(
      /export\s+const\s+github\s*:\s*GitHubContent\s*=\s*\{([\s\S]*?)\n\};/,
    );
    const content = block ? block[1] : source;

    return {
      pinned: readStringArray(content, 'pinned'),
      hidden: readStringArray(content, 'hidden'),
    };
  } catch (error) {
    warn(
      `Could not read pinned/hidden lists from portfolio.ts (${error.message}); using empty lists.`,
    );

    return { pinned: [], hidden: [] };
  }
}

async function fetchProfile() {
  const profile = await getJson(`/users/${encodeURIComponent(USERNAME)}`);

  if (!profile || typeof profile !== 'object' || typeof profile.public_repos !== 'number') {
    throw new Error('Unexpected profile response');
  }

  const createdAt = new Date(profile.created_at);
  const createdYear = Number.isNaN(createdAt.getTime()) ? null : createdAt.getUTCFullYear();

  return {
    login: typeof profile.login === 'string' ? profile.login : USERNAME,
    publicRepos: profile.public_repos,
    followers: typeof profile.followers === 'number' ? profile.followers : 0,
    createdYear,
    htmlUrl:
      typeof profile.html_url === 'string'
        ? profile.html_url
        : `https://github.com/${USERNAME}`,
  };
}

async function fetchRepositories() {
  const repositories = [];

  for (let page = 1; page <= 5; page += 1) {
    const batch = await getJson(`/users/${encodeURIComponent(USERNAME)}/repos`, {
      type: 'owner',
      sort: 'pushed',
      direction: 'desc',
      per_page: '100',
      page: String(page),
    });

    if (!Array.isArray(batch)) {
      throw new Error('Unexpected repositories response');
    }

    repositories.push(...batch);

    if (batch.length < 100) {
      break;
    }
  }

  return repositories.filter(
    (repository) => !repository.fork && !repository.archived && !repository.private,
  );
}

function orderRepositories(repositories, pinned, hidden) {
  const hiddenNames = new Set(hidden.map((name) => name.toLowerCase()));
  const byName = new Map(
    repositories.map((repository) => [String(repository.name).toLowerCase(), repository]),
  );
  const ordered = [];

  for (const name of pinned) {
    if (ordered.length >= 6) {
      break;
    }

    const repository = byName.get(name.toLowerCase());

    if (repository && !hiddenNames.has(String(repository.name).toLowerCase())) {
      ordered.push(repository);
    }
  }

  for (const repository of repositories) {
    if (ordered.length >= 6) {
      break;
    }

    const name = String(repository.name).toLowerCase();

    if (!hiddenNames.has(name) && !ordered.includes(repository)) {
      ordered.push(repository);
    }
  }

  return ordered.slice(0, 6);
}

function mapRepositories(repositories) {
  return repositories.map((repository) => ({
    name: String(repository.name || ''),
    description:
      typeof repository.description === 'string' && repository.description.trim()
        ? repository.description.trim()
        : null,
    language: typeof repository.language === 'string' ? repository.language : null,
    stars: typeof repository.stargazers_count === 'number' ? repository.stargazers_count : 0,
    forks: typeof repository.forks_count === 'number' ? repository.forks_count : 0,
    pushedAt: typeof repository.pushed_at === 'string' ? repository.pushed_at : null,
    url:
      typeof repository.html_url === 'string'
        ? repository.html_url
        : `https://github.com/${USERNAME}/${repository.name}`,
  }));
}

function aggregateLanguages(repositories) {
  const counts = new Map();

  for (const repository of repositories) {
    if (repository.language) {
      counts.set(repository.language, (counts.get(repository.language) || 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

function repoFullNameFromSearchItem(item) {
  if (typeof item.repository_url !== 'string') {
    return null;
  }

  const marker = '/repos/';
  const index = item.repository_url.indexOf(marker);

  return index === -1 ? null : item.repository_url.slice(index + marker.length);
}

async function fetchContributions() {
  const result = await getJson('/search/issues', {
    q: `author:${USERNAME} type:pr -user:${USERNAME}`,
    sort: 'created',
    order: 'desc',
    per_page: '5',
  });

  if (!result || !Array.isArray(result.items)) {
    throw new Error('Unexpected pull request search response');
  }

  return result.items
    .filter((item) => {
      const fullName = repoFullNameFromSearchItem(item);
      return fullName && fullName.split('/')[0].toLowerCase() !== USERNAME.toLowerCase();
    })
    .slice(0, 5)
    .map((item) => {
      const fullName = repoFullNameFromSearchItem(item);
      const merged = Boolean(item.pull_request && item.pull_request.merged_at);
      const state = merged ? 'merged' : item.state === 'closed' ? 'closed' : 'open';

      return {
        title: typeof item.title === 'string' ? item.title : '',
        repo: fullName,
        repoUrl: fullName ? `https://github.com/${fullName}` : null,
        state,
        date: typeof item.created_at === 'string' ? item.created_at : null,
        url: typeof item.html_url === 'string' ? item.html_url : null,
      };
    });
}

function mapEvent(event) {
  const repo = event && event.repo && typeof event.repo.name === 'string' ? event.repo.name : null;

  if (!repo) {
    return null;
  }

  const base = {
    repo,
    repoUrl: `https://github.com/${repo}`,
    date: typeof event.created_at === 'string' ? event.created_at : null,
  };

  switch (event.type) {
    case 'PushEvent': {
      const payload = event.payload || {};
      const count =
        typeof payload.size === 'number'
          ? payload.size
          : Array.isArray(payload.commits)
            ? payload.commits.length
            : null;

      return { ...base, type: 'push', count };
    }
    case 'PullRequestEvent': {
      const action = event.payload && event.payload.action;
      const merged = Boolean(event.payload && event.payload.pull_request && event.payload.pull_request.merged);
      const type =
        action === 'opened'
          ? 'pr-opened'
          : merged
            ? 'pr-merged'
            : action === 'closed'
              ? 'pr-closed'
              : null;

      return type ? { ...base, type } : null;
    }
    case 'IssuesEvent': {
      const action = event.payload && event.payload.action;

      if (action === 'opened') {
        return { ...base, type: 'issue-opened' };
      }

      if (action === 'closed') {
        return { ...base, type: 'issue-closed' };
      }

      return null;
    }
    case 'ForkEvent':
      return { ...base, type: 'fork' };
    case 'ReleaseEvent':
      return { ...base, type: 'release' };
    case 'CreateEvent': {
      const refType = event.payload && event.payload.ref_type;

      if (refType === 'repository') {
        return { ...base, type: 'create-repo' };
      }

      if (refType === 'branch') {
        return { ...base, type: 'create-branch' };
      }

      if (refType === 'tag') {
        return { ...base, type: 'create-tag' };
      }

      return null;
    }
    case 'WatchEvent':
      return null;
    default:
      return null;
  }
}

async function resolvePushCount(event) {
  const repo = event && event.repo && typeof event.repo.name === 'string' ? event.repo.name : null;
  const payload = (event && event.payload) || {};
  const before = typeof payload.before === 'string' ? payload.before : null;
  const head = typeof payload.head === 'string' ? payload.head : null;

  if (!repo || !before || !head || /^0+$/.test(before)) {
    return null;
  }

  try {
    const comparison = await getJson(
      `/repos/${repo}/compare/${encodeURIComponent(before)}...${encodeURIComponent(head)}`,
    );

    return comparison && typeof comparison.total_commits === 'number'
      ? comparison.total_commits
      : null;
  } catch (error) {
    warn(`Could not read push size for ${repo} (${error.message}).`);
    return null;
  }
}

async function fetchActivity() {
  const events = await getJson(`/users/${encodeURIComponent(USERNAME)}/events/public`, {
    per_page: '30',
  });

  if (!Array.isArray(events)) {
    throw new Error('Unexpected events response');
  }

  const activity = [];

  for (const event of events) {
    if (activity.length === 5) {
      break;
    }

    const mapped = mapEvent(event);

    if (!mapped) {
      continue;
    }

    if (mapped.type === 'push' && (mapped.count === null || mapped.count === 0)) {
      mapped.count = await resolvePushCount(event);
    }

    activity.push(mapped);
  }

  return activity;
}

async function fetchCalendar() {
  if (!TOKEN) {
    return null;
  }

  const now = new Date();
  const from = new Date(
    Date.UTC(now.getUTCFullYear() - 1, now.getUTCMonth(), now.getUTCDate()),
  );
  const query = `
    query ($login: String!, $from: DateTime!, $to: DateTime!) {
      user(login: $login) {
        contributionsCollection(from: $from, to: $to) {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
                weekday
              }
            }
          }
        }
      }
    }
  `;

  const response = await fetch(`${API_BASE}/graphql`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      query,
      variables: { login: USERNAME, from: from.toISOString(), to: now.toISOString() },
    }),
  });

  if (!response.ok) {
    throw new Error(`GitHub GraphQL ${response.status} ${response.statusText}`);
  }

  const body = await response.json();

  if (Array.isArray(body.errors) && body.errors.length > 0) {
    throw new Error(`GitHub GraphQL error: ${body.errors[0]?.message || 'unknown error'}`);
  }

  const calendar =
    body && body.data && body.data.user && body.data.user.contributionsCollection
      ? body.data.user.contributionsCollection.contributionCalendar
      : null;

  if (!calendar || !Array.isArray(calendar.weeks)) {
    throw new Error('Unexpected contribution calendar response');
  }

  const allDays = calendar.weeks.flatMap((week) =>
    Array.isArray(week.contributionDays) ? week.contributionDays : [],
  );
  const maximum = Math.max(0, ...allDays.map((day) => day.contributionCount || 0));

  const levelFor = (count) => {
    if (count === 0 || maximum === 0) {
      return 0;
    }

    if (count >= maximum * 0.75) {
      return 4;
    }

    if (count >= maximum * 0.5) {
      return 3;
    }

    if (count >= maximum * 0.25) {
      return 2;
    }

    return 1;
  };

  const weeks = calendar.weeks.map((week) => ({
    days: (Array.isArray(week.contributionDays) ? week.contributionDays : []).map((day) => ({
      date: day.date,
      count: typeof day.contributionCount === 'number' ? day.contributionCount : 0,
      weekday: typeof day.weekday === 'number' ? day.weekday : 0,
      level: levelFor(typeof day.contributionCount === 'number' ? day.contributionCount : 0),
    })),
  }));

  const total = allDays.reduce(
    (sum, day) => sum + (typeof day.contributionCount === 'number' ? day.contributionCount : 0),
    0,
  );

  return {
    totalContributions:
      typeof calendar.totalContributions === 'number' ? calendar.totalContributions : total,
    weeks,
  };
}

async function main() {
  const lists = await readRepoLists();

  try {
    const profile = await fetchProfile();
    const [repositories, contributions, activity] = await Promise.all([
      fetchRepositories(),
      fetchContributions(),
      fetchActivity(),
    ]);

    repositories.sort((a, b) => {
      const first = a.pushed_at ? Date.parse(a.pushed_at) : 0;
      const second = b.pushed_at ? Date.parse(b.pushed_at) : 0;
      return second - first;
    });

    const selected = orderRepositories(repositories, lists.pinned, lists.hidden);
    const shown = mapRepositories(selected);
    const languages = aggregateLanguages(shown);

    let calendar = null;

    if (TOKEN) {
      try {
        calendar = await fetchCalendar();
      } catch (error) {
        warn(`Contribution calendar unavailable (${error.message}); continuing without it.`);
      }
    }

    const snapshot = {
      generatedAt: new Date().toISOString(),
      username: USERNAME,
      profile,
      repositories: shown,
      languages,
      contributions,
      activity,
      calendar,
    };

    await mkdir(dirname(OUTPUT_PATH), { recursive: true });
    await writeFile(OUTPUT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

    console.log(
      `[github] Wrote snapshot: ${profile.publicRepos} public repos, ${shown.length} shown, ${languages.length} languages, ${contributions.length} contributions, ${activity.length} recent events, calendar ${calendar ? 'included' : 'skipped'}.`,
    );
  } catch (error) {
    warn(`Could not refresh snapshot (${error.message}). Keeping the existing github.json.`);
  }
}

main().catch((error) => {
  warn(`Unexpected failure (${error && error.message ? error.message : error}). Keeping the existing github.json.`);
});
