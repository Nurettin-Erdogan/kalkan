// Kalkan değerlendirme setini çalıştırır ve docs/evaluation.md raporunu yazar.
// Kullanım: npm run evaluate
// Geliştirme yarısındaki hatalar ayrıntılı listelenir; kör test yarısı yalnızca
// özet olarak gösterilir ki kurallar ona bakılarak ayarlanmasın.
import { writeFileSync } from 'node:fs';
import { evaluate, renderReport } from '../lib/evaluation.ts';
import { evaluationSet } from '../lib/fixtures/evaluation-set.ts';

const result = evaluate(evaluationSet);
writeFileSync(new URL('../docs/evaluation.md', import.meta.url), renderReport(result));

const percent = (value: number) => `${(value * 100).toFixed(1)}%`;
for (const [name, metrics] of Object.entries(result.bySplit)) {
  console.log(
    `${name.padEnd(10)} yakalama ${metrics.caught}/${metrics.scams} (${percent(metrics.recall)})  yanlış alarm ${metrics.falseAlarms}/${metrics.legit} (${percent(metrics.falseAlarmRate)})`,
  );
}

const developmentErrors = result.errors.filter((item) => item.split === 'gelistirme');
if (developmentErrors.length) {
  console.log('\nGeliştirme yarısındaki hatalar:');
  for (const item of developmentErrors) {
    console.log(`  ${item.id} [${item.label}] ${item.level} (${item.score}) ${item.topFinding ?? '—'}\n    ${item.text}`);
  }
}
console.log('\ndocs/evaluation.md güncellendi.');
