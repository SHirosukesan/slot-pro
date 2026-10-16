import { z } from 'zod';

/** 機種データの形式検証（Zod）。テストとCIで全機種をチェックする */
const status = z.enum(['verified', 'single', 'needsReview', 'unverified', 'na', 'sample']);
const unit = z.enum(['G', '液晶G', '喰', 'あべし', 'pt', '周期', '回', '枚', '円']);
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const source = z.object({ site: z.string().min(1), url: z.string().url(), referencedAt: date });
const sourced = { status, sources: z.array(source), checkedAt: date.optional(), note: z.string().optional() };
const numVal = z.object({ ...sourced, value: z.number().nullable(), unit });
const textVal = z.object({ ...sourced, text: z.string().nullable() });
const n = z.number().nullable();
const evCondition = z.object({
  exchangeRate: z.number().positive(),
  play: z.enum(['持ちメダル', '現金']),
  quitAssumption: z.string(),
  closingConsidered: z.boolean(),
});
const entry = z.object({
  ...sourced,
  id: z.string(),
  aim: z.enum(['天井', 'CZ']),
  condition: z.enum(['通常', '朝イチ', 'リセット', '据え置き', 'AT後', 'ボーナス後']),
  unit,
  minLine: n,
  recommended: z.object({ min: n, max: n }).nullable(),
  ev: z.object({ min: n, max: n, condition: evCondition }).nullable(),
  target: z.string().optional(),
});
const detection = z.object({ ...sourced, label: z.string(), method: z.string(), certainty: z.enum(['確定', '示唆', '推測', '未確認']) });

export const machineSchema = z.object({
  machineId: z.string().regex(/^[a-z]+(\.[a-z0-9-]+)+$/),
  officialName: z.string().min(1),
  shortName: z.string().min(1),
  modelCode: z.string().nullable(),
  version: z.string(),
  aliases: z.array(z.string()),
  machineType: z.enum(['pachislot', 'pachinko']),
  manufacturer: z.string().nullable(),
  image: z.object({
    src: z.string().nullable(),
    credit: z.string().nullable(),
    license: z.enum(['未確認', '許諾済み', '自作', 'メーカー提供']),
  }),
  hue: z.number().min(0).max(360),
  mainAim: z.enum(['天井', 'CZ']).optional(),
  counterUnit: unit,
  entryRules: z.array(entry),
  ceilingRules: z.object({ normal: numVal, morning: numVal, cz: numVal.optional(), czMorning: numVal.optional(), benefit: textVal.optional() }),
  quitRules: z.array(z.object({ ...sourced, id: z.string(), situation: z.string(), checkCount: n, unit, action: z.string() })),
  precursorRules: z
    .object({
      ...sourced,
      onset: z.object({ min: n, max: n, unit }).nullable(),
      checkCount: n,
      checkUnit: unit,
      endCondition: z.string().nullable(),
    })
    .nullable(),
  zoneRules: z.array(z.object({ ...sourced, id: z.string(), label: z.string(), min: n, max: n, unit })),
  skipRules: z.object({ definition: z.string().min(1), ceiling: numVal, aimFrom: numVal }).nullable(),
  kakenukeRules: z.object({ definition: z.string().min(1), benefit: textVal }).nullable(),
  morningRules: z.object({
    entry: entry.nullable(),
    resetBenefit: textVal,
    carryOver: textVal,
    gakkun: detection,
    initialState: detection.nullable(),
    otherDetections: z.array(detection),
    limits: textVal,
  }),
  advantageousSectionRules: z.object({
    regulatoryNetBaseline: numVal,
    mechanism: z.enum(['exists', 'none', 'unknown']),
    cutConditions: z.array(
      z.object({ ...sourced, id: z.string(), kind: z.enum(['差枚', '獲得枚数', 'G数', 'その他']), value: n, unit, label: z.string() }),
    ),
    benefit: textVal,
    detection: textVal,
  }),
  sourceLinks: z.array(
    z.object({
      kind: z.enum(['settei', 'reset', 'advantage']),
      site: z.string().nullable(),
      url: z.string().url().nullable(),
      referencedAt: date.optional(),
    }),
  ),
  verifiedAt: date.nullable(),
  verificationStatus: status,
});
