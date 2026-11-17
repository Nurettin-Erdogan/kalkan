import { analyzeContent, type Analysis } from './analyze.ts';
import type { EvaluationCase } from './fixtures/evaluation-set.ts';

export type Split = 'gelistirme' | 'kor-test';

export type CaseResult = EvaluationCase & {
  split: Split;
  level: Analysis['level'];
  score: number;
  flagged: boolean;
  correct: boolean;
  topFinding: string | null;
};

export type Metrics = {
  scams: number;
  legit: number;
  caught: number;
  caughtHigh: number;
  falseAlarms: number;
  recall: number;
  highRecall: number;
  falseAlarmRate: number;
  precision: number;
};

export type EvaluationResult = {
  overall: Metrics;
  bySplit: Record<Split, Metrics>;
  byCategory: { category: string; label: EvaluationCase['label']; total: number; correct: number }[];
  errors: CaseResult[];
};

/** Kayıt numarası tek olanlar geliştirme, çift olanlar kör test yarısıdır. */
export function splitOf(id: string): Split {
  return Number(id.replace(/\D/g, '')) % 2 === 1 ? 'gelistirme' : 'kor-test';
}

/** "Uyarı verildi" = orta veya yüksek risk. Düşük risk sessiz kalmak demektir. */
export function runCase(item: EvaluationCase): CaseResult {
  const analysis = analyzeContent(item.text);
  const flagged = analysis.level !== 'low';
  const top = analysis.findings.find((finding) => finding.kind !== 'positive');
  return {
    ...item,
    split: splitOf(item.id),
    level: analysis.level,
    score: analysis.score,
    flagged,
    correct: item.label === 'scam' ? flagged : !flagged,
    topFinding: top?.title ?? null,
  };
}

function ratio(part: number, whole: number) {
  return whole === 0 ? 0 : part / whole;
}

function metricsFor(results: CaseResult[]): Metrics {
  const scams = results.filter((item) => item.label === 'scam');
  const legit = results.filter((item) => item.label === 'legit');
  const caught = scams.filter((item) => item.flagged).length;
  const caughtHigh = scams.filter((item) => item.level === 'high').length;
  const falseAlarms = legit.filter((item) => item.flagged).length;
  return {
    scams: scams.length,
    legit: legit.length,
    caught,
    caughtHigh,
    falseAlarms,
    recall: ratio(caught, scams.length),
    highRecall: ratio(caughtHigh, scams.length),
    falseAlarmRate: ratio(falseAlarms, legit.length),
    precision: ratio(caught, caught + falseAlarms),
  };
}

export function evaluate(cases: EvaluationCase[]): EvaluationResult {
  const results = cases.map(runCase);
  const categories = new Map<string, { category: string; label: EvaluationCase['label']; total: number; correct: number }>();
  for (const item of results) {
    const key = `${item.label}:${item.category}`;
    const entry = categories.get(key) ?? { category: item.category, label: item.label, total: 0, correct: 0 };
    entry.total += 1;
    entry.correct += item.correct ? 1 : 0;
    categories.set(key, entry);
  }

  return {
    overall: metricsFor(results),
    bySplit: {
      gelistirme: metricsFor(results.filter((item) => item.split === 'gelistirme')),
      'kor-test': metricsFor(results.filter((item) => item.split === 'kor-test')),
    },
    byCategory: [...categories.values()].sort(
      (a, b) => a.label.localeCompare(b.label) || a.category.localeCompare(b.category),
    ),
    errors: results.filter((item) => !item.correct),
  };
}

const percent = (value: number) => `%${(value * 100).toFixed(1).replace('.', ',')}`;

function metricsRow(name: string, metrics: Metrics) {
  return `| ${name} | ${metrics.caught}/${metrics.scams} (${percent(metrics.recall)}) | ${metrics.caughtHigh}/${metrics.scams} (${percent(metrics.highRecall)}) | ${metrics.falseAlarms}/${metrics.legit} (${percent(metrics.falseAlarmRate)}) | ${percent(metrics.precision)} |`;
}

/** docs/evaluation.md içeriği. Test, dosyanın bu çıktıyla birebir aynı olduğunu doğrular. */
export function renderReport(result: EvaluationResult) {
  const lines = [
    '# Kalkan değerlendirme raporu',
    '',
    '> Bu dosya `npm run evaluate` ile üretilir; elle düzenlenmez. `npm test`, dosyanın kural motorunun güncel çıktısıyla aynı olduğunu doğrular.',
    '',
    `Set: ${result.overall.scams} dolandırıcılık + ${result.overall.legit} meşru sentetik Türkçe mesaj ([lib/fixtures/evaluation-set.ts](../lib/fixtures/evaluation-set.ts)). "Uyarı" = orta veya yüksek risk.`,
    '',
    '| Bölüm | Yakalanan dolandırıcılık | Yüksek riskle yakalanan | Yanlış alarm (meşru mesaj) | Kesinlik |',
    '| --- | --- | --- | --- | --- |',
    metricsRow('Tümü', result.overall),
    metricsRow('Geliştirme yarısı', result.bySplit.gelistirme),
    metricsRow('Kör test yarısı', result.bySplit['kor-test']),
    '',
    'Kural iyileştirmeleri yalnızca geliştirme yarısındaki hatalara bakılarak yapılır; kör test yarısı bu iyileştirmelerin yeni mesajlara ne kadar genellendiğini gösterir.',
    '',
    '## Kategori kırılımı',
    '',
    '| Etiket | Kategori | Doğru / Toplam |',
    '| --- | --- | --- |',
    ...result.byCategory.map(
      (entry) => `| ${entry.label === 'scam' ? 'dolandırıcılık' : 'meşru'} | ${entry.category} | ${entry.correct}/${entry.total} |`,
    ),
    '',
    '## Hatalar',
    '',
  ];

  if (result.errors.length === 0) {
    lines.push('Bu sette hata yok.');
  } else {
    lines.push('| Kayıt | Bölüm | Gerçek | Kalkan | Puan | Öne çıkan bulgu |', '| --- | --- | --- | --- | --- | --- |');
    for (const item of result.errors) {
      lines.push(
        `| ${item.id} | ${item.split === 'gelistirme' ? 'geliştirme' : 'kör test'} | ${item.label === 'scam' ? 'dolandırıcılık' : 'meşru'} | ${item.level} | ${item.score} | ${item.topFinding ?? '—'} |`,
      );
    }
  }

  lines.push('');
  return lines.join('\n');
}
