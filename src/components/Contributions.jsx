import { useEffect, useRef, useState } from "react";
import { getContributions } from "../services/service";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// The API returns a flat list of days starting on a Sunday, so chunking by 7
// gives the columns directly — no date maths needed.
function toWeeks(days) {
  const weeks = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));
  return weeks;
}

// One label per month, on the first week whose Sunday falls in it. Column 0 is
// skipped: the year opens mid-month, so its label would sit next to the real
// start of the following month and the two would collide.
function monthLabels(weeks) {
  const labels = [];
  if (!weeks.length) return labels;
  let last = new Date(weeks[0][0].date).getMonth();
  weeks.forEach((week, i) => {
    const m = new Date(week[0].date).getMonth();
    if (i > 0 && m !== last) labels.push({ col: i, name: MONTHS[m] });
    last = m;
  });
  return labels;
}

function title(day) {
  const date = new Date(day.date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  return `${day.count} contribution${day.count === 1 ? "" : "s"} on ${date}`;
}

export default function Contributions({ user }) {
  const [data, setData] = useState(null);
  const scroller = useRef(null);

  useEffect(() => {
    getContributions(user).then((r) => r.success && setData(r));
  }, [user]);

  // Where the year doesn't fit, open on the most recent weeks rather than a
  // year-old empty stretch.
  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [data]);

  if (!data) return <div className="contrib-placeholder" />;

  const weeks = toWeeks(data.days);
  if (!weeks.length) return null;

  return (
    <div className="contrib">
      <div className="contrib-scroll" ref={scroller}>
        <div className="contrib-grid" style={{ "--weeks": weeks.length }}>
          {monthLabels(weeks).map((l) => (
            <span
              key={`${l.name}-${l.col}`}
              className="contrib-month"
              style={{ gridColumn: l.col + 1 }}
            >
              {l.name}
            </span>
          ))}
          {weeks.map((week, w) =>
            week.map((day, d) => (
              <span
                key={day.date}
                className="contrib-day"
                data-level={day.level}
                style={{ gridColumn: w + 1, gridRow: d + 2 }}
                title={title(day)}
              />
            )),
          )}
        </div>
      </div>
      <span className="contrib-total">{data.total} in the last year</span>
    </div>
  );
}
