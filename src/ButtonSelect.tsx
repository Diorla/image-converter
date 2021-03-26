export default function ButtonSelect({
  text,
  active,
  onClick,
}: {
  text: string;
  active: boolean;
  onClick: () => void;
}) {
  if (active)
    return (
      <span className="btn btn-primary" onClick={onClick}>
        {text}
      </span>
    );
  return (
    <span className="btn btn-secondary" onClick={onClick}>
      {text}
    </span>
  );
}
