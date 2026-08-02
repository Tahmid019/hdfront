export function Connecting() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-yellow-600">
      <div className="animate-pulse">Connecting...</div>
    </div>
  );
}

export function Disconnected() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-gray-600">
      Disconnected
    </div>
  );
}

export function Error() {
  return (
    <div className="flex h-full items-center justify-center rounded-xl border border-red-200 bg-red-50 text-sm text-red-700">
      Something went wrong
    </div>
  );
}
