export default function Divider() {
  return (
    <div className="flex items-center justify-center py-16 opacity-70">
      <div className="h-px w-24 bg-stone-200" />
      <div className="mx-4 flex h-3 w-3 items-center justify-center rotate-45 border border-brass text-brass">
        <div className="h-1 w-1 bg-brass" />
      </div>
      <div className="h-px w-24 bg-stone-200" />
    </div>
  );
}
