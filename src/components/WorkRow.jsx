import WorkIcon from "./WorkIcon";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const label = (ym) => {
  const [y, m] = ym.split("-").map(Number);
  return `${MONTHS[m - 1]} ${y}`;
};

// Inclusive of the end month, which is how LinkedIn counts it — Sep to Jun
// reads as 10 months there, not 9.
function duration(start, end) {
  const [sy, sm] = start.split("-").map(Number);
  const now = new Date();
  const [ey, em] = end ? end.split("-").map(Number) : [now.getFullYear(), now.getMonth() + 1];
  const months = (ey - sy) * 12 + (em - sm) + 1;
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && `${y} yr${y > 1 ? "s" : ""}`, m && `${m} mo${m > 1 ? "s" : ""}`]
    .filter(Boolean)
    .join(" ");
}

export default function WorkRow({ job }) {
  const dated = Boolean(job.start);
  const range = dated
    ? `${label(job.start)} – ${job.end ? label(job.end) : "Present"}`
    : job.from === job.to
      ? job.from
      : `${job.from} – ${job.to}`;

  return (
    <a href={job.link} target="_blank" rel="noopener noreferrer" className="work-row">
      <WorkIcon favicon={job.favicon} logo={job.logo} letter={job.company[0]} />
      <span className="work-body">
        <span className="work-company">{job.company}</span>
        <span className="work-meta">
          {job.role}
          {job.location && ` · ${job.location}`}
          {dated && ` · ${duration(job.start, job.end)}`}
        </span>
      </span>
      <span className="work-range">{range}</span>
    </a>
  );
}
