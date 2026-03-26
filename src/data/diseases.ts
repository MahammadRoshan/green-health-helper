export interface Disease {
  id: string;
  name: string;
  crop: string;
  symptoms: string[];
  description: string;
  treatment: string[];
  prevention: string[];
  severity: "low" | "medium" | "high";
}

export const symptoms = [
  "Yellow leaves",
  "Brown spots on leaves",
  "Wilting",
  "White powdery coating",
  "Black spots",
  "Curling leaves",
  "Stunted growth",
  "Root rot",
  "Fruit discoloration",
  "Stem lesions",
  "Leaf holes",
  "Mold growth",
] as const;

export const diseases: Disease[] = [
  {
    id: "1",
    name: "Late Blight",
    crop: "Tomato / Potato",
    symptoms: ["Brown spots on leaves", "Black spots", "Fruit discoloration"],
    description:
      "Late blight is caused by the oomycete Phytophthora infestans. It spreads rapidly in cool, moist conditions and can destroy entire fields within days.",
    treatment: [
      "Apply copper-based fungicide immediately",
      "Remove and destroy infected plants",
      "Improve air circulation between plants",
      "Use resistant varieties for next planting",
    ],
    prevention: [
      "Plant resistant varieties",
      "Ensure proper spacing",
      "Avoid overhead irrigation",
      "Rotate crops annually",
    ],
    severity: "high",
  },
  {
    id: "2",
    name: "Powdery Mildew",
    crop: "Wheat / Cucurbits",
    symptoms: ["White powdery coating", "Curling leaves", "Stunted growth"],
    description:
      "Powdery mildew appears as white powdery spots on leaves and stems. It thrives in warm, dry climates with high humidity.",
    treatment: [
      "Apply sulfur-based fungicide",
      "Use neem oil spray weekly",
      "Remove heavily infected leaves",
      "Increase air circulation",
    ],
    prevention: [
      "Plant in full sunlight",
      "Avoid overcrowding",
      "Water at base of plants",
      "Choose resistant varieties",
    ],
    severity: "medium",
  },
  {
    id: "3",
    name: "Fusarium Wilt",
    crop: "Banana / Tomato",
    symptoms: ["Yellow leaves", "Wilting", "Stunted growth"],
    description:
      "Fusarium wilt is a soil-borne fungal disease that blocks water-conducting vessels. Lower leaves yellow first, often on one side of the plant.",
    treatment: [
      "No chemical cure — remove infected plants",
      "Solarize soil before replanting",
      "Use biological control agents (Trichoderma)",
      "Adjust soil pH to 6.5–7.0",
    ],
    prevention: [
      "Use disease-free seedlings",
      "Practice crop rotation (3-4 years)",
      "Improve soil drainage",
      "Use resistant varieties",
    ],
    severity: "high",
  },
  {
    id: "4",
    name: "Bacterial Leaf Spot",
    crop: "Pepper / Tomato",
    symptoms: ["Brown spots on leaves", "Leaf holes", "Fruit discoloration"],
    description:
      "Caused by Xanthomonas bacteria, this disease creates small, dark, water-soaked spots on leaves that may merge and cause defoliation.",
    treatment: [
      "Apply copper hydroxide spray",
      "Remove infected plant debris",
      "Avoid working with wet plants",
      "Use bactericide as preventative",
    ],
    prevention: [
      "Use certified disease-free seeds",
      "Rotate crops every 2-3 years",
      "Avoid overhead watering",
      "Sanitize garden tools",
    ],
    severity: "medium",
  },
  {
    id: "5",
    name: "Root Rot",
    crop: "Various crops",
    symptoms: ["Root rot", "Wilting", "Yellow leaves", "Stunted growth"],
    description:
      "Root rot is caused by overwatering and poor drainage, leading to fungal growth (Pythium, Phytophthora) that destroys root systems.",
    treatment: [
      "Improve drainage immediately",
      "Reduce watering frequency",
      "Apply fungicide drench to soil",
      "Transplant to fresh, well-draining soil",
    ],
    prevention: [
      "Ensure proper soil drainage",
      "Avoid overwatering",
      "Use raised beds in heavy soils",
      "Add organic matter to improve soil structure",
    ],
    severity: "medium",
  },
  {
    id: "6",
    name: "Downy Mildew",
    crop: "Grapes / Lettuce",
    symptoms: ["Yellow leaves", "Mold growth", "Brown spots on leaves"],
    description:
      "Downy mildew thrives in cool, wet conditions. Yellow patches appear on upper leaf surfaces with grayish-purple mold underneath.",
    treatment: [
      "Apply mancozeb or metalaxyl fungicide",
      "Remove infected leaves promptly",
      "Improve ventilation in greenhouse",
      "Reduce leaf wetness duration",
    ],
    prevention: [
      "Space plants for air flow",
      "Water in the morning",
      "Use drip irrigation",
      "Apply preventive fungicides in wet seasons",
    ],
    severity: "high",
  },
];

export function detectDisease(selectedSymptoms: string[]): Disease[] {
  if (selectedSymptoms.length === 0) return [];

  const scored = diseases.map((disease) => {
    const matchCount = disease.symptoms.filter((s) =>
      selectedSymptoms.includes(s)
    ).length;
    const score = matchCount / disease.symptoms.length;
    return { disease, score, matchCount };
  });

  return scored
    .filter((s) => s.matchCount > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.disease);
}
