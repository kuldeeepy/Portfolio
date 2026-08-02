// Inline link that reveals an image preview on hover.
export default function PreviewLink({ children, src, alt = "" }) {
  return (
    <a
      className="preview-link"
      data-text={children}
      href={src}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <span className="preview-tooltip">
        <img src={src} alt={alt} />
      </span>
    </a>
  );
}
