export function logEvent(event: string, context: Record<string, unknown>) {
  console.log(JSON.stringify({ level: 'info', event, context, timestamp: new Date().toISOString() }));
}
