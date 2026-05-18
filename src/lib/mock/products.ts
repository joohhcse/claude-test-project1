import type { Product } from "@/domain/types/product";

export const CATEGORIES = ["의류", "전자기기", "식품", "생활용품", "기타"] as const;

export const mockProducts: Product[] = [
  { id: "P001", name: "캐시미어 코트", category: "의류", price: 189000, stock: 23, status: "active", image: "/placeholder.png", description: "고급 캐시미어 소재의 겨울 코트", createdAt: "2025-03-15" },
  { id: "P002", name: "무선 블루투스 이어폰", category: "전자기기", price: 64000, stock: 150, status: "active", image: "/placeholder.png", description: "노이즈 캔슬링 블루투스 이어폰", createdAt: "2025-03-20" },
  { id: "P003", name: "유기농 올리브유 세트", category: "식품", price: 67000, stock: 45, status: "active", image: "/placeholder.png", description: "이탈리아산 엑스트라 버진 올리브유", createdAt: "2025-03-22" },
  { id: "P004", name: "스테인리스 텀블러", category: "생활용품", price: 22000, stock: 8, status: "active", image: "/placeholder.png", description: "보온보냉 스테인리스 텀블러 500ml", createdAt: "2025-04-01" },
  { id: "P005", name: "러닝화 에어맥스", category: "의류", price: 145000, stock: 0, status: "soldout", image: "/placeholder.png", description: "경량 메쉬 소재 러닝화", createdAt: "2025-04-03" },
  { id: "P006", name: "노트북 거치대", category: "전자기기", price: 35000, stock: 72, status: "active", image: "/placeholder.png", description: "알루미늄 접이식 노트북 거치대", createdAt: "2025-04-05" },
  { id: "P007", name: "그래놀라 바 12개입", category: "식품", price: 18000, stock: 5, status: "active", image: "/placeholder.png", description: "통귀리 그래놀라 에너지 바", createdAt: "2025-04-08" },
  { id: "P008", name: "린넨 셔츠", category: "의류", price: 59000, stock: 34, status: "active", image: "/placeholder.png", description: "여름용 시원한 린넨 셔츠", createdAt: "2025-04-10" },
  { id: "P009", name: "USB-C 허브 7in1", category: "전자기기", price: 48000, stock: 3, status: "active", image: "/placeholder.png", description: "HDMI, USB 3.0, SD카드 지원 허브", createdAt: "2025-04-12" },
  { id: "P010", name: "세라믹 머그컵 세트", category: "생활용품", price: 32000, stock: 60, status: "active", image: "/placeholder.png", description: "핸드메이드 세라믹 머그컵 4개 세트", createdAt: "2025-04-15" },
  { id: "P011", name: "오가닉 코튼 티셔츠", category: "의류", price: 29000, stock: 0, status: "soldout", image: "/placeholder.png", description: "100% 유기농 면 기본 티셔츠", createdAt: "2025-04-18" },
  { id: "P012", name: "보조배터리 20000mAh", category: "전자기기", price: 39000, stock: 88, status: "active", image: "/placeholder.png", description: "고속충전 대용량 보조배터리", createdAt: "2025-04-20" },
  { id: "P013", name: "수제 잼 선물세트", category: "식품", price: 42000, stock: 15, status: "draft", image: "/placeholder.png", description: "국내산 과일 수제 잼 3종 세트", createdAt: "2025-04-22" },
  { id: "P014", name: "아로마 디퓨저", category: "생활용품", price: 28000, stock: 7, status: "active", image: "/placeholder.png", description: "천연 에센셜 오일 아로마 디퓨저", createdAt: "2025-04-25" },
  { id: "P015", name: "데님 자켓", category: "의류", price: 89000, stock: 19, status: "active", image: "/placeholder.png", description: "클래식핏 데님 자켓", createdAt: "2025-04-28" },
  { id: "P016", name: "기계식 키보드", category: "전자기기", price: 129000, stock: 42, status: "active", image: "/placeholder.png", description: "적축 기계식 풀배열 키보드", createdAt: "2025-05-01" },
  { id: "P017", name: "견과류 믹스 1kg", category: "식품", price: 25000, stock: 9, status: "active", image: "/placeholder.png", description: "아몬드, 호두, 캐슈넛 믹스", createdAt: "2025-05-03" },
  { id: "P018", name: "대나무 수저 세트", category: "생활용품", price: 15000, stock: 120, status: "draft", image: "/placeholder.png", description: "친환경 대나무 수저 및 젓가락 세트", createdAt: "2025-05-05" },
];
