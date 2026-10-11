import { Dimension, DimensionScore, Question, ScoreReport, SubdimensionScore } from '../types.ts';

export function calculateScores(
  questions: Question[],
  answers: Record<number, number>
): ScoreReport {
  // Only evaluate enabled and scored questions
  const activeScoredQuestions = questions.filter((q) => q.enabled && q.scored);

  // Group by dimension
  const gritQuestions = activeScoredQuestions.filter((q) => q.dimension === 'grit');
  const purposeQuestions = activeScoredQuestions.filter((q) => q.dimension === 'purpose');
  const selfControlQuestions = activeScoredQuestions.filter((q) => q.dimension === 'self_control');

  const getQuestionNormalizedScore = (q: Question): number => {
    const raw = answers[q.id] || 3; // default fallback if unselected
    const adjusted = q.reverseScored ? 6 - raw : raw;
    return ((adjusted - 1) / 4) * 100;
  };

  const getAverage = (list: Question[]): number => {
    if (list.length === 0) return 0;
    const sum = list.reduce((acc, q) => acc + getQuestionNormalizedScore(q), 0);
    return sum / list.length;
  };

  const gritScore = getAverage(gritQuestions);
  const purposeScore = getAverage(purposeQuestions);
  const selfControlScore = getAverage(selfControlQuestions);

  const compositeScore = (gritScore + purposeScore + selfControlScore) / 3;

  // Subdimensions
  const subdimensionGroups: Record<string, { dimension: Dimension; questions: Question[] }> = {};
  for (const q of activeScoredQuestions) {
    if (!subdimensionGroups[q.subdimension]) {
      subdimensionGroups[q.subdimension] = { dimension: q.dimension, questions: [] };
    }
    subdimensionGroups[q.subdimension].questions.push(q);
  }

  // Desired display order for subdimensions
  const subdimensionOrder = [
    'Bền bỉ của hứng thú',
    'Kiên trì nỗ lực',
    'Khám phá định hướng',
    'Cảm nhận ý nghĩa',
    'Đóng góp cho người khác',
    'Thực hiện nhiệm vụ',
    'Lập kế hoạch',
    'Điều chỉnh phản ứng',
  ];

  const subdimensionScores: SubdimensionScore[] = subdimensionOrder
    .filter((name) => subdimensionGroups[name])
    .map((name) => {
      const group = subdimensionGroups[name];
      const avg = getAverage(group.questions);
      let color = '#ec4899'; // pink
      if (group.dimension === 'purpose') color = '#3b82f6'; // blue
      if (group.dimension === 'self_control') color = '#10b981'; // green

      return {
        name,
        dimension: group.dimension,
        score: avg,
        color,
      };
    });

  const dimensionScores: DimensionScore[] = [
    {
      key: 'grit',
      name: 'Sự bền bỉ',
      score: gritScore,
      color: '#f43f5e',
      badgeBg: '#fef2f2',
      badgeBorder: '#fecdd3',
      badgeText: '#e11d48',
    },
    {
      key: 'purpose',
      name: 'Mục đích sống',
      score: purposeScore,
      color: '#3b82f6',
      badgeBg: '#eff6ff',
      badgeBorder: '#bfdbfe',
      badgeText: '#2563eb',
    },
    {
      key: 'self_control',
      name: 'Tự kiểm soát',
      score: selfControlScore,
      color: '#10b981',
      badgeBg: '#f0fdf4',
      badgeBorder: '#bbf7d0',
      badgeText: '#059669',
    },
  ];

  // Sort to find strongest and weakest
  const sorted = [...dimensionScores].sort((a, b) => b.score - a.score);
  const strongestDimension = sorted[0];
  const weakestDimension = sorted[sorted.length - 1];

  const encouragementSummary = `Em đang có những nguồn lực để tiếp tục khám phá và theo đuổi ước mơ. ${strongestDimension.name} là yếu tố em tự đánh giá nổi bật hơn; ${weakestDimension.name.toLowerCase()} là hướng em có thể quan tâm rèn luyện thêm.`;

  // Tailored recommendations
  const recommendationLibrary: Record<
    Dimension,
    { strengthBullets: string[]; growthBullets: string[] }
  > = {
    grit: {
      strengthBullets: [
        'Nuôi dưỡng niềm đam mê dài hạn với những lĩnh vực em yêu thích.',
        'Sẵn sàng kiên trì vượt qua các thử thách khó nhằn trong học tập.',
        'Đúc kết kinh nghiệm sau mỗi lần chưa đạt như kỳ vọng để làm tốt hơn.',
      ],
      growthBullets: [
        'Chia nhỏ mục tiêu lớn thành các chặng ngắn 1-2 tuần để duy trì hứng thú.',
        'Tự ghi nhận từng bước tiến nhỏ mỗi khi hoàn thành một nhiệm vụ.',
        'Tìm kiếm một người bạn đồng hành cùng học tập để động viên lẫn nhau.',
      ],
    },
    purpose: {
      strengthBullets: [
        'Hãy nhận ra những việc em đang làm tốt và cảm thấy ý nghĩa.',
        'Tiếp tục phát huy trong các hoạt động học tập và cuộc sống.',
        'Lan tỏa niềm vui và sự giúp đỡ đến bạn bè, gia đình xung quanh.',
      ],
      growthBullets: [
        'Dành 10-15 phút cuối tuần suy ngẫm về những điều làm em thấy hào hứng nhất.',
        'Tìm hiểu sâu hơn về 1-2 nghề nghiệp hoặc ngành học mà em tò mò.',
        'Tham gia một hoạt động tập thể hoặc thiện nguyện nhỏ để mở rộng trải nghiệm.',
      ],
    },
    self_control: {
      strengthBullets: [
        'Khả năng tập trung và chuẩn bị kế hoạch chu đáo trước khi hành động.',
        'Bình tĩnh suy nghĩ thấu đáo và kiềm chế cảm xúc nhất thời.',
        'Duy trì thói quen thực hiện đúng thời hạn và tự giác cao.',
      ],
      growthBullets: [
        'Dành 15 phút tập trung cho một việc trước khi chuyển sang giải trí.',
        'Chuẩn bị trước một nhiệm vụ quan trọng của ngày mai.',
        'Tắt thông báo hoặc để điện thoại xa khi thực hiện nhiệm vụ quan trọng.',
      ],
    },
  };

  const strengthAdvice = recommendationLibrary[strongestDimension.key];
  const growthAdvice = recommendationLibrary[weakestDimension.key];

  return {
    compositeScore,
    gritScore,
    purposeScore,
    selfControlScore,
    dimensionScores,
    subdimensionScores,
    strongestDimension,
    weakestDimension,
    encouragementSummary,
    recommendations: {
      strengthTitle: `Phát huy điểm nổi bật: ${strongestDimension.name}`,
      strengthBullets: strengthAdvice.strengthBullets,
      growthTitle: `Bồi đắp thêm: ${weakestDimension.name}`,
      growthBullets: growthAdvice.growthBullets,
    },
  };
}

export function formatVietnameseScore(score: number): string {
  return score.toFixed(1).replace('.', ',');
}
