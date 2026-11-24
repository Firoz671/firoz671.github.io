import type { ReactNode } from 'react';
import {
  githubSnapshot,
  type ActivityType,
  type GitHubActivity,
  type GitHubContribution,
  type GitHubLanguage,
  type GitHubRepository,
} from '../../data/github';
import { github, profile } from '../../data/portfolio';
import { Container } from '../ui/Container';
import { ExternalLink } from '../ui/ExternalLink';
import { SectionHeading } from '../ui/SectionHeading';
import { cx } from '../ui/classNames';
import { ContributionGraph } from './ContributionGraph';

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

const stateStyles: Record<GitHubContribution['state'], string> = {
  open: 'border-accent/50 bg-accent/10 text-accent-strong',
  merged: 'border-accent bg-accent text-accent-ink',
  closed: 'border-line bg-surface-2 text-muted',
};

function formatDate(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : dateFormatter.format(date);
}

function replaceCount(template: string, count: number): string {
  return template.replace('{count}', String(count));
}

function ActivitySentence({ event }: { event: GitHubActivity }) {
  const copy = github.activity;

  let template: string;

  if (event.type === 'push') {
    template =
      typeof event.count === 'number' && event.count > 0 ? copy.push : copy.pushGeneric;

    if (typeof event.count === 'number' && event.count > 0) {
      template = template
        .replace('{count}', String(event.count))
        .replace('{unit}', event.count === 1 ? copy.commitSingular : copy.commitPlural);
    }
  } else {
    const templates: Record<Exclude<ActivityType, 'push'>, string> = {
      'pr-opened': copy.prOpened,
      'pr-merged': copy.prMerged,
      'pr-closed': copy.prClosed,
      'issue-opened': copy.issueOpened,
      'issue-closed': copy.issueClosed,
      fork: copy.fork,
      release: copy.release,
      'create-repo': copy.createRepo,
      'create-branch': copy.createBranch,
      'create-tag': copy.createTag,
    };

    template = templates[event.type];
  }

  const [before, after = ''] = template.split('{repo}');

  return (
    <>
      {before}
      <ExternalLink
        href={event.repoUrl}
        newTabLabel={profile.ui.opensInNewTab}
        className="font-semibold text-accent-strong underline-offset-4 break-words hover:underline"
      >
        {event.repo}
      </ExternalLink>
      {after}
    </>
  );
}

function RepositoryCard({ repository }: { repository: GitHubRepository }) {
  const updated = formatDate(repository.pushedAt);

  return (
    <article className="card-lift flex h-full min-w-0 flex-col rounded-card border border-line bg-surface p-5 shadow-card md:p-6">
      <ExternalLink
        href={repository.url}
        newTabLabel={profile.ui.opensInNewTab}
        className="text-lg font-semibold text-ink underline-offset-4 break-words hover:text-accent-strong hover:underline"
      >
        {repository.name}
        <span aria-hidden="true" className="ml-1 text-accent">
          ↗
        </span>
      </ExternalLink>

      <p className="mt-2 text-sm break-words text-muted">
        {repository.description || github.repoMeta.noDescription}
      </p>

      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 text-caption text-subtle">
        <span>
          {github.repoMeta.stars}{' '}
          <span className="font-semibold text-ink">{repository.stars}</span>
        </span>
        <span>
          {github.repoMeta.forks}{' '}
          <span className="font-semibold text-ink">{repository.forks}</span>
        </span>
        {repository.language ? (
          <span className="rounded-full border border-line bg-surface-2 px-2.5 py-0.5 font-semibold text-muted">
            {repository.language}
          </span>
        ) : null}
        {updated ? (
          <time dateTime={repository.pushedAt ?? undefined} className="ml-auto">
            {github.repoMeta.updated} {updated}
          </time>
        ) : null}
      </div>
    </article>
  );
}

function LanguageList({ languages }: { languages: GitHubLanguage[] }) {
  return (
    <div className="rounded-card border border-line bg-surface p-6 shadow-card md:p-8">
      <h3 className="text-eyebrow font-semibold uppercase text-accent-strong">
        {github.blocks.languages}
      </h3>

      {languages.length > 0 ? (
        <ul className="mt-5 flex flex-wrap gap-2">
          {languages.map((language) => (
            <li
              key={language.name}
              className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-1 text-caption font-semibold text-muted"
              aria-label={`${language.name}, ${replaceCount(
                language.count === 1
                  ? github.languageCountSingular
                  : github.languageCount,
                language.count,
              )}`}
            >
              {language.name}
              <span className="rounded-full bg-canvas px-2 py-0.5 text-eyebrow text-subtle">
                {language.count}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted">{github.empty.languages}</p>
      )}
    </div>
  );
}

function ContributionItem({ contribution }: { contribution: GitHubContribution }) {
  const date = formatDate(contribution.date);

  return (
    <li className="rounded-card border border-line bg-surface p-4">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
        {contribution.url ? (
          <ExternalLink
            href={contribution.url}
            newTabLabel={profile.ui.opensInNewTab}
            className="min-w-0 font-semibold text-ink underline-offset-4 break-words hover:text-accent-strong hover:underline"
          >
            {contribution.title}
            <span aria-hidden="true" className="ml-1 text-accent">
              ↗
            </span>
          </ExternalLink>
        ) : (
          <span className="min-w-0 font-semibold break-words">{contribution.title}</span>
        )}

        <span
          className={cx(
            'rounded-full border px-2.5 py-0.5 text-eyebrow font-semibold uppercase tracking-[0.12em]',
            stateStyles[contribution.state],
          )}
        >
          {github.contributionStates[contribution.state]}
        </span>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-subtle">
        {contribution.repo ? (
          <span className="break-words">{contribution.repo}</span>
        ) : null}
        {date ? <time dateTime={contribution.date ?? undefined}>{date}</time> : null}
      </div>
    </li>
  );
}

function ActivityItem({ event }: { event: GitHubActivity }) {
  const date = formatDate(event.date);

  return (
    <li className="flex gap-3 text-sm text-muted">
      <span className="mt-[0.7em] h-px w-3 shrink-0 bg-accent" aria-hidden="true" />
      <div className="min-w-0">
        <p className="break-words">
          <ActivitySentence event={event} />
        </p>
        {date ? (
          <p className="mt-1 text-caption text-subtle">
            <time dateTime={event.date ?? undefined}>{date}</time>
          </p>
        ) : null}
      </div>
    </li>
  );
}

function SectionBody({
  repositories,
  languages,
  contributions,
  activity,
}: {
  repositories: GitHubRepository[];
  languages: GitHubLanguage[];
  contributions: GitHubContribution[];
  activity: GitHubActivity[];
}): ReactNode {
  return (
    <>
      <div className="mt-10">
        <h3 className="text-eyebrow font-semibold uppercase text-accent-strong">
          {github.blocks.repositories}
        </h3>

        {repositories.length > 0 ? (
          <ul className="mt-5 grid gap-4 md:grid-cols-2">
            {repositories.map((repository) => (
              <li key={repository.name} className="min-w-0">
                <RepositoryCard repository={repository} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">{github.empty.repositories}</p>
        )}
      </div>

      <div className="mt-10">
        <LanguageList languages={languages} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <div>
          <h3 className="text-eyebrow font-semibold uppercase text-accent-strong">
            {github.blocks.contributions}
          </h3>
          {contributions.length > 0 ? (
            <ul className="mt-5 space-y-3">
              {contributions.map((contribution) => (
                <ContributionItem
                  key={`${contribution.url ?? contribution.title}-${contribution.date ?? ''}`}
                  contribution={contribution}
                />
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted">{github.empty.contributions}</p>
          )}
        </div>

        <div>
          <h3 className="text-eyebrow font-semibold uppercase text-accent-strong">
            {github.blocks.activity}
          </h3>
          {activity.length > 0 ? (
            <ul className="mt-5 space-y-4">
              {activity.map((event, index) => (
                <ActivityItem
                  key={`${event.type}-${event.repo}-${event.date ?? ''}-${index}`}
                  event={event}
                />
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted">{github.empty.activity}</p>
          )}
        </div>
      </div>
    </>
  );
}

export function GitHub() {
  const {
    profile: githubProfile,
    languages,
    calendar,
    generatedAt,
  } = githubSnapshot;
  const repositories = githubSnapshot.repositories.slice(0, 6);
  const contributions = githubSnapshot.contributions.slice(0, 5);
  const activity = githubSnapshot.activity.slice(0, 5);
  const totalStars = repositories.reduce(
    (total, repository) => total + repository.stars,
    0,
  );

  return (
    <section
      id="github"
      aria-labelledby="github-heading"
      className="border-b border-line/70 py-section"
    >
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            id="github-heading"
            eyebrow={github.eyebrow}
            title={github.heading}
            description={github.intro}
          />

          <div className="flex flex-col items-start gap-2 md:items-end">
            <ExternalLink
              href={github.profileLink.href}
              newTabLabel={profile.ui.opensInNewTab}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-strong underline-offset-4 hover:underline"
            >
              {github.profileLink.label}
              <span aria-hidden="true">↗</span>
            </ExternalLink>
            {githubProfile.createdYear ? (
              <p className="text-caption text-subtle">
                {github.memberSince.replace('{year}', String(githubProfile.createdYear))}
              </p>
            ) : null}
          </div>
        </div>

        <dl className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-card border border-line bg-surface px-5 py-4 shadow-card">
            <dt className="text-eyebrow font-semibold uppercase text-subtle">
              {github.stats.repositories}
            </dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums text-ink">
              {githubProfile.publicRepos}
            </dd>
          </div>
          <div className="rounded-card border border-line bg-surface px-5 py-4 shadow-card">
            <dt className="text-eyebrow font-semibold uppercase text-subtle">
              {github.stats.followers}
            </dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums text-ink">
              {githubProfile.followers}
            </dd>
          </div>
          <div className="rounded-card border border-line bg-surface px-5 py-4 shadow-card">
            <dt className="text-eyebrow font-semibold uppercase text-subtle">
              {github.stats.stars}
            </dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums text-ink">
              {totalStars}
            </dd>
          </div>
        </dl>

        <div className="mt-12">
          <ContributionGraph calendar={calendar} generatedAt={generatedAt} />
        </div>

        <SectionBody
          repositories={repositories}
          languages={languages}
          contributions={contributions}
          activity={activity}
        />
      </Container>
    </section>
  );
}
