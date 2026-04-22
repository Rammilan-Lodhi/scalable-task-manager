export default function Feedback({ error, success }) {
  if (!error && !success) return null;
  return (
    <div className={`feedback ${error ? "error" : "success"}`}>
      {error || success}
    </div>
  );
}
