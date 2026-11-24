import { useLayoutEffect, useRef } from 'react';
import type { GitHubCalendar, GitHubCalendarDay } from '../../data/github';
import { github, profile } from '../../data/portfolio';
import { ExternalLink } from '../ui/ExternalLink';

const CELL_SIZE = 11;
const CELL_GAP = 3;
const CELL_STEP = CELL_SIZE + CELL_GAP;
const MONTH_LABEL_HEIGHT = 18;
const MIN_MONTH_LABEL_GAP = 30;
const RIGHT_PADDING = 24;

const tooltipDateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  timeZone: 'UTC',
});

const monthYearFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

function fillTemplate(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.split(`{${key}}`).join(String(value)),
    template,
  );
}

function parseDayDate(value: string): Date | null {
  const date = new Date(`${value}T00:00:00Z`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatDay(value: string): string {
  const date = parseDayDate(value);

  return date ? tooltipDateFormatter.format(date) : value;
}

function getMonthLabels(weeks: GitHubCalendarDay[][]): Array<{ label: string; weekIndex: number }> {
  const labels: Array<{ label: string; weekIndex: number }> = [];
  let previousX = Number.NEGATIVE_INFINITY;
  let previousKey = '';

  weeks.forEach((week, weekIndex) => {
    const monthStart = week.find((day) => {
      const date = parseDayDate(day.date);

      return date ? date.getUTCDate() === 1 : false;
    });
    const key =
      (monthStart ? monthStart.date.slice(0, 7) : '') ||
      (weekIndex === 0 && week[0] ? week[0].date.slice(0, 7) : '');

    if (!key || key === previousKey) {
      return;
    }

    previousKey = key;

    const x = weekIndex * CELL_STEP;

    if (x - previousX < MIN_MONTH_LABEL_GAP) {
      return;
    }

    const date = parseDayDate(`${key}-01`);

    labels.push({
      label: date ? monthFormatter.format(date) : key,
      weekIndex,
    });
    previousX = x;
  });

  return labels;
}

function getMonthlyTotals(weeks: GitHubCalendarDay[][]): Array<{ count: number; label: string }> {
  const totals = new Map<string, number>();

  for (const day of weeks.flat()) {
    const key = day.date.slice(0, 7);
    totals.set(key, (totals.get(key) ?? 0) + day.count);
  }

  return [...totals.entries()]
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([key, count]) => {
      const date = parseDayDate(`${key}-01`);

      return {
        count,
        label: date ? monthYearFormatter.format(date) : key,
      };
    });
}

function ContributionIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      className="h-5 w-5"
      fill="currentColor"
    >
      <rect x="3" y="3" width="5" height="5" rx="1" opacity="0.35" />
      <rect x="10" y="3" width="5" height="5" rx="1" opacity="0.55" />
      <rect x="17" y="3" width="4" height="5" rx="1" opacity="0.75" />
      <rect x="3" y="10" width="5" height="5" rx="1" opacity="0.55" />
      <rect x="10" y="10" width="5" height="5" rx="1" opacity="0.75" />
      <rect x="17" y="10" width="4" height="5" rx="1" />
      <rect x="3" y="17" width="5" height="4" rx="1" opacity="0.75" />
      <rect x="10" y="17" width="5" height="4" rx="1" />
    </svg>
  );
}

function ContributionGrid({ calendar }: { calendar: GitHubCalendar }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const columns = calendar.weeks.length;
  const gridWidth = columns * CELL_STEP - CELL_GAP;
  const width = gridWidth + RIGHT_PADDING;
  const height = MONTH_LABEL_HEIGHT + 7 * CELL_STEP - CELL_GAP;
  const labels = getMonthLabels(calendar.weeks);

  useLayoutEffect(() => {
    const node = scrollRef.current;

    if (!node) {
      return;
    }

    const scrollToRecent = () => {
      node.scrollLeft = node.scrollWidth;
    };

    scrollToRecent();

    const observer = new ResizeObserver(scrollToRecent);
    observer.observe(node);

    return () => observer.disconnect();
  }, [calendar]);

  return (
    <div
      ref={scrollRef}
      tabIndex={0}
      aria-label={github.heatmap.scrollLabel}
      className="heatmap-scroll max-w-full overflow-x-auto overflow-y-hidden pb-2"
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
        focusable="false"
        className="block h-auto max-w-none"
      >
        {labels.map((label) => (
          <text
            key={`${label.weekIndex}-${label.label}`}
            x={label.weekIndex * CELL_STEP}
            y={11}
            className="fill-subtle text-[0.625rem] font-semibold"
          >
            {label.label}
          </text>
        ))}

        {calendar.weeks.map((week, weekIndex) =>
          week.map((day) => {
            const date = parseDayDate(day.date);

            if (!date) {
              return null;
            }

            const row = date.getUTCDay();
            const level = Math.min(4, Math.max(0, day.level));
            const tooltip =
              day.count === 0
                ? github.heatmap.tooltip.empty
                : fillTemplate(
                    day.count === 1
                      ? github.heatmap.tooltip.countSingular
                      : github.heatmap.tooltip.count,
                    {
                      count: day.count,
                      date: tooltipDateFormatter.format(date),
                    },
                  );

            return (
              <rect
                key={day.date}
                x={weekIndex * CELL_STEP}
                y={MONTH_LABEL_HEIGHT + row * CELL_STEP}
                width={CELL_SIZE}
                height={CELL_SIZE}
                rx={2}
                fill={`var(--heatmap-${level})`}
              >
                <title>{tooltip}</title>
              </rect>
            );
          }),
        )}
      </svg>
    </div>
  );
}

export function ContributionGraph({
  calendar,
  generatedAt,
}: {
  calendar: GitHubCalendar | null;
  generatedAt: string;
}) {
  const updatedDate = parseDayDate(generatedAt.slice(0, 10));
  const updated = updatedDate ? tooltipDateFormatter.format(updatedDate) : null;
  const monthlyTotals = calendar ? getMonthlyTotals(calendar.weeks) : [];

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <span className="mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2 text-accent-strong">
            <ContributionIcon />
          </span>
          <div className="min-w-0">
            <h3 id="open-source-activity-heading" className="text-h3">
              {github.heatmap.heading}
            </h3>
            <p className="mt-1 font-mono text-eyebrow font-semibold uppercase text-subtle">
              {github.heatmap.subtitle}
            </p>
          </div>
        </div>

        <ExternalLink
          href={github.heatmap.profile.href}
          newTabLabel={profile.ui.opensInNewTab}
          className="inline-flex shrink-0 items-center rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-accent-strong transition-colors hover:border-accent hover:text-accent"
        >
          {github.heatmap.profile.label}
        </ExternalLink>
      </div>

      {calendar && calendar.weeks.length > 0 ? (
        <div className="mt-6 border-y border-line bg-surface px-4 py-5 md:px-6">
          <ContributionGrid calendar={calendar} />

          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <p className="text-caption font-semibold text-muted tabular-nums">
              {fillTemplate(github.heatmap.total, { total: calendar.total })}
            </p>

            <div
              aria-hidden="true"
              className="flex shrink-0 items-center gap-2 text-caption text-subtle"
            >
              <span>{github.heatmap.legend.less}</span>
              <span className="flex items-center gap-[3px]">
                {[0, 1, 2, 3, 4].map((level) => (
                  <span
                    key={level}
                    className="block h-[11px] w-[11px] rounded-[2px]"
                    style={{ backgroundColor: `var(--heatmap-${level})` }}
                  />
                ))}
              </span>
              <span>{github.heatmap.legend.more}</span>
            </div>
          </div>

          <div className="sr-only">
            <p>
              {fillTemplate(github.heatmap.summary, {
                total: calendar.total,
                from: formatDay(calendar.from),
                to: formatDay(calendar.to),
              })}
            </p>
            <ul aria-label={github.heatmap.monthlyHeading}>
              {monthlyTotals.map((month) => (
                <li key={month.label}>
                  {fillTemplate(github.heatmap.monthlyItem, {
                    month: month.label,
                    count: month.count,
                  })}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="mt-6 border-y border-line bg-surface px-4 py-8 md:px-6">
          <p className="text-sm text-muted">{github.heatmap.empty}</p>
        </div>
      )}

      {updated ? (
        <p className="mt-3 text-caption text-subtle">
          <time dateTime={generatedAt}>
            {fillTemplate(github.lastUpdated, { date: updated })}
          </time>
        </p>
      ) : null}
    </div>
  );
}
