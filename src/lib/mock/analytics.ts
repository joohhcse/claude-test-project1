// --- Daily sales (last 30 days) ---
function generateDailySales(days: number) {
  const data: { date: string; sales: number }[] = [];
  const base = new Date("2025-05-11");
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(base);
    d.setDate(d.getDate() - i);
    data.push({
      date: `${d.getMonth() + 1}/${d.getDate()}`,
      sales: Math.round(600000 + Math.random() * 1200000),
    });
  }
  return data;
}

export const dailySales30 = generateDailySales(30);
export const dailySales7 = dailySales30.slice(-7);
export const dailySales1 = dailySales30.slice(-1);

// --- KPI ---
export const analyticsKpi = {
  revenue: "₩24,500,000",
  orders: "384건",
  avgOrderValue: "₩63,800",
  conversionRate: "3.2%",
};

// --- Bestsellers Top 5 ---
export const bestsellers = [
  { rank: 1, name: "캐시미어 코트", sales: 42 },
  { rank: 2, name: "무선 블루투스 이어폰", sales: 38 },
  { rank: 3, name: "기계식 키보드", sales: 31 },
  { rank: 4, name: "러닝화 에어맥스", sales: 27 },
  { rank: 5, name: "보조배터리 20000mAh", sales: 25 },
];

// --- Regional sales ---
export const regionalSales = [
  { region: "서울", sales: 8200000 },
  { region: "경기", sales: 5400000 },
  { region: "부산", sales: 3100000 },
  { region: "인천", sales: 2600000 },
  { region: "대전", sales: 1800000 },
  { region: "기타", sales: 3400000 },
];

// --- AI Insights ---
export const aiInsights = [
  "이번 달 매출은 전월 대비 12.5% 증가했습니다. 의류 카테고리가 성장을 주도하고 있습니다.",
  "주말(토·일) 주문 비중이 41%로 평일보다 높습니다. 주말 타겟 프로모션을 고려해 보세요.",
  "재구매율이 28%로 업계 평균(22%)을 상회합니다. VIP 고객 유지 전략이 효과적입니다.",
];
