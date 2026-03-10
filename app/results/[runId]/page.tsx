export default function ResultPage({ params }: { params: { runId: string } }) {
  return (
    <section className="space-y-2">
      <h1 className="text-2xl font-bold">Résultat de partie</h1>
      <p>Run: {params.runId}</p>
      <p>Coins gagnés: selon score.</p>
      <p>XP gagnée: selon score.</p>
      <p>Reward Credits éventuels: selon règle publiée.</p>
      <p>Trace règle appliquée: game_results.ruleset_version.</p>
    </section>
  );
}
