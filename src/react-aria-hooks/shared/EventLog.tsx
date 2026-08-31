export function EventLog({ events }: { events: string[] }) {
  if (events.length === 0) {
    return (
      <p className="wsu-hookDemo__eventLogEmpty">
        Interact with the demo above to see events logged here.
      </p>
    );
  }

  return (
    <ul className="wsu-hookDemo__eventLog" aria-label="Event log">
      {events.map((event, i) => (
        <li key={i}>{event}</li>
      ))}
    </ul>
  );
}
