import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const USERNAME = (process.env.GITHUB_USERNAME || 'firoz671').trim();
const API_BASE = (process.env.GITHUB_API_BASE || 'https://api.github.com').replace(/\/+$/, '');
const TOKEN = (process.env.GITHUB_TOKEN || '').trim();
const PUBLIC_CONTRIBUTIONS_URL = (
  process.env.GITHUB_CONTRIBUTIONS_URL ||
  `https://github.com/users/${encodeURIComponent(USERNAME)}/contributions`
).trim();

const OUTPUT_PATH = fileURLToPath(new URL('../src/data/github.json', import.meta.url));
const PORTFOLIO_PATH = fileURLToPath(new URL('../src/data/portfolio.ts', import.meta.url));

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const CONTRIBUTION_LEVELS = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

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

function parseDate(value) {
  if (typeof value !== 'string' || !DATE_PATTERN.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00Z`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeCalendarDay(day) {
  if (!day || typeof day !== 'object') {
    return null;
  }

  const date = parseDate(day.date);
  const count =
    typeof day.count === 'number' && Number.isFinite(day.count) && day.count >= 0
      ? Math.floor(day.count)
      : null;
  const level =
    Number.isInteger(day.level) && day.level >= 0 && day.level <= 4 ? day.level : null;

  if (!date || count === null || level === null) {
    return null;
  }

  return { date: day.date, count, level };
}

function buildCalendar(weeks, total, source) {
  if (!Array.isArray(weeks) || weeks.length === 0) {
    throw new Error('Contribution calendar contained no weeks');
  }

  const normalizedWeeks = [];
  const allDays = [];

  for (const week of weeks) {
    if (!Array.isArray(week)) {
      throw new Error('Unexpected contribution week shape');
    }

    const days = week.map(normalizeCalendarDay);

    if (days.some((day) => day === null)) {
      throw new Error('Unexpected contribution day shape');
    }

    days.sort((a, b) => a.date.localeCompare(b.date));

    if (days.length > 0) {
      normalizedWeeks.push(days);
      allDays.push(...days);
    }
  }

  if (allDays.length === 0) {
    throw new Error('Contribution calendar contained no days');
  }

  allDays.sort((a, b) => a.date.localeCompare(b.date));

  const computedTotal = allDays.reduce((sum, day) => sum + day.count, 0);
  const safeTotal =
    typeof total === 'number' && Number.isFinite(total) && total >= 0
      ? Math.floor(total)
      : computedTotal;

  return {
    total: safeTotal,
    weeks: normalizedWeeks,
    from: allDays[0].date,
    to: allDays[allDays.length - 1].date,
    source,
  };
}

async function fetchCalendarGraphQL() {
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
                contributionLevel
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
  const maximum = Math.max(
    0,
    ...allDays.map((day) =>
      typeof day.contributionCount === 'number' ? day.contributionCount : 0,
    ),
  );

  const levelForCount = (count) => {
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

  const weeks = calendar.weeks.map((week) =>
    (Array.isArray(week.contributionDays) ? week.contributionDays : []).map((day) => {
      const count =
        typeof day.contributionCount === 'number' && Number.isFinite(day.contributionCount)
          ? Math.max(0, Math.floor(day.contributionCount))
          : 0;
      const mappedLevel = CONTRIBUTION_LEVELS[day.contributionLevel];

      return {
        date: day.date,
        count,
        level: Number.isInteger(mappedLevel) ? mappedLevel : levelForCount(count),
      };
    }),
  );

  return buildCalendar(weeks, calendar.totalContributions, 'graphql');
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#(?:39|x27);/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function stripHtmlTags(value) {
  return value.replace(/<[^>]*>/g, ' ');
}

function parseContributionCount(tooltipHtml) {
  const text = decodeHtmlEntities(stripHtmlTags(tooltipHtml)).replace(/\s+/g, ' ').trim();

  if (/^No contributions\b/i.test(text)) {
    return 0;
  }

  const match = text.match(/^([\d,]+)\s+contributions?\b/i);

  if (!match) {
    return null;
  }

  const count = Number(match[1].replace(/,/g, ''));

  return Number.isFinite(count) ? count : null;
}

function readAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}="([^"]*)"`, 'i'));

  return match ? match[1] : null;
}

function parsePublicContributionPage(html) {
  if (typeof html !== 'string' || html.length < 1000) {
    throw new Error('Unexpected contributions page response');
  }

  const tooltips = new Map();
  const tooltipPattern = /<tool-tip\b[^>]*\bfor="([^"]+)"[^>]*>([\s\S]*?)<\/tool-tip>/gi;
  let tooltipMatch = tooltipPattern.exec(html);

  while (tooltipMatch) {
    tooltips.set(tooltipMatch[1], tooltipMatch[2]);
    tooltipMatch = tooltipPattern.exec(html);
  }

  const days = [];
  const cellPattern = /<td\b[^>]*>/gi;
  let cellMatch = cellPattern.exec(html);

  while (cellMatch) {
    const tag = cellMatch[0];
    const date = readAttribute(tag, 'data-date');

    if (date) {
      const levelValue = readAttribute(tag, 'data-level');
      const id = readAttribute(tag, 'id');

      if (!parseDate(date) || !/^[0-4]$/.test(levelValue || '')) {
        throw new Error(`Unexpected contribution cell for ${date}`);
      }

      const tooltip = id ? tooltips.get(id) : null;

      if (!tooltip) {
        throw new Error(`Missing contribution tooltip for ${date}`);
      }

      const count = parseContributionCount(tooltip);

      if (count === null) {
        throw new Error(`Could not parse contribution count for ${date}`);
      }

      days.push({ date, count, level: Number(levelValue) });
    }

    cellMatch = cellPattern.exec(html);
  }

  if (days.length < 300) {
    throw new Error(`Unexpected contribution day count (${days.length})`);
  }

  const weeksByStart = new Map();

  for (const day of days) {
    const date = parseDate(day.date);
    const weekday = date.getUTCDay();
    const weekStart = new Date(date.getTime() - weekday * 86400000)
      .toISOString()
      .slice(0, 10);

    if (!weeksByStart.has(weekStart)) {
      weeksByStart.set(weekStart, []);
    }

    weeksByStart.get(weekStart).push(day);
  }

  const weeks = [...weeksByStart.entries()]
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([, weekDays]) => weekDays.sort((a, b) => a.date.localeCompare(b.date)));
  const total = days.reduce((sum, day) => sum + day.count, 0);

  return buildCalendar(weeks, total, 'public-page');
}

async function fetchCalendarFromPublicPage() {
  const response = await fetch(PUBLIC_CONTRIBUTIONS_URL, {
    headers: {
      Accept: 'text/html',
      'User-Agent': `${USERNAME}-portfolio-build`,
    },
  });

  if (!response.ok) {
    throw new Error(`Contributions page ${response.status} ${response.statusText}`);
  }

  const html = await response.text();

  return parsePublicContributionPage(html);
}

async function readExistingCalendar() {
  try {
    const source = await readFile(OUTPUT_PATH, 'utf8');
    const snapshot = JSON.parse(source);
    const calendar = snapshot && typeof snapshot === 'object' ? snapshot.calendar : null;

    if (!calendar || !Array.isArray(calendar.weeks)) {
      return null;
    }

    if (calendar.weeks.every((week) => Array.isArray(week))) {
      return buildCalendar(
        calendar.weeks.map((week) =>
          week.map((day) => ({
            date: day && day.date,
            count: day && day.count,
            level: day && day.level,
          })),
        ),
        calendar.total,
        calendar.source === 'graphql' || calendar.source === 'public-page'
          ? calendar.source
          : 'graphql',
      );
    }

    if (calendar.weeks.every((week) => week && Array.isArray(week.days))) {
      return buildCalendar(
        calendar.weeks.map((week) =>
          week.days.map((day) => ({
            date: day && day.date,
            count: day && day.count,
            level: day && day.level,
          })),
        ),
        calendar.totalContributions,
        'graphql',
      );
    }

    return null;
  } catch {
    return null;
  }
}

async function main() {
  const lists = await readRepoLists();
  const existingCalendar = await readExistingCalendar();

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

    let calendar = existingCalendar;

    if (TOKEN) {
      try {
        calendar = await fetchCalendarGraphQL();
      } catch (error) {
        warn(
          `GraphQL contribution calendar unavailable (${error.message}); trying the public contributions page.`,
        );

        try {
          calendar = await fetchCalendarFromPublicPage();
        } catch (publicError) {
          warn(
            `Public contribution calendar unavailable (${publicError.message}); keeping the existing calendar.`,
          );
        }
      }
    } else {
      try {
        calendar = await fetchCalendarFromPublicPage();
      } catch (error) {
        warn(
          `Public contribution calendar unavailable (${error.message}); keeping the existing calendar.`,
        );
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

    const calendarSummary = calendar
      ? `${calendar.total} contributions across ${calendar.weeks.length} weeks from ${calendar.source}`
      : 'skipped';

    console.log(
      `[github] Wrote snapshot: ${profile.publicRepos} public repos, ${shown.length} shown, ${languages.length} languages, ${contributions.length} contributions, ${activity.length} recent events, calendar ${calendarSummary}.`,
    );
  } catch (error) {
    warn(`Could not refresh snapshot (${error.message}). Keeping the existing github.json.`);
  }
}

main().catch((error) => {
  warn(`Unexpected failure (${error && error.message ? error.message : error}). Keeping the existing github.json.`);
});
