export default function ButtonSelect({
  text,
  onClick,
  active,
}: {
  text: string;
  onClick: () => void;
  active: boolean;
}) {
  if (active)
    return (
      <button onClick={onClick} className="btn-select active">
        {text}
      </button>
    );
  return (
    <button className="btn-select" onClick={onClick}>
      {text}
    </button>
  );
}
