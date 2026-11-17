export type SupportedLanguage = 'English' | 'Kannada' | 'Hindi' | 'Telugu' | 'Tamil';

export interface LanguageMeta {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: Record<SupportedLanguage, LanguageMeta> = {
  English: { code: 'en', name: 'English', nativeName: 'English' },
  Kannada: { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  Hindi: { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  Telugu: { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  Tamil: { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
};

export interface Translations {
  moduleTitle: string;
  moduleSubtitle: string;
  dashboardNav: string;
  statusActive: string;
  statusApiKeyNeeded: string;
  studentLabel: string;
  assistantLabel: string;
  thinkingText: string;
  startersTitle: string;
  starterPrompts: string[];
  inputPlaceholder: string;
  uploadTooltip: string;
  audioTooltip: string;
  welcomeMessage: string;
  curatedNotice: string;
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  English: {
    moduleTitle: 'Kudla Learn',
    moduleSubtitle: 'AI LEARNING ASSISTANT & CONCEPT EXPLORER',
    dashboardNav: 'Dashboard',
    statusActive: 'Kudla Learn Interface Active: Multilingual study mode is ready with Gemini AI.',
    statusApiKeyNeeded: 'Gemini API key not found in .env.local. Operating in curated local knowledge mode. Add GEMINI_API_KEY to enable live AI responses.',
    studentLabel: 'You',
    assistantLabel: 'Kudla AI Assistant',
    thinkingText: 'Formulating detailed educational response...',
    startersTitle: 'Suggested Learning Questions:',
    starterPrompts: [
      'Explain recursion using a real-world analogy and base case.',
      'What is the difference between a process and a thread in OS?',
      "How does Dijkstra's shortest path algorithm work step-by-step?",
      'Explain gradient descent and learning rate for beginners.',
    ],
    inputPlaceholder: 'Ask a question in English or describe a concept to learn...',
    uploadTooltip: 'Document Intelligence: Upload PDF or image notes',
    audioTooltip: 'Audio Lessons: Synthesize voice explanation',
    welcomeMessage: 'Hello! I am your Kudla Learn AI Study Assistant. I provide in-depth educational breakdowns, step-by-step processes, real-world examples, and practice questions. What would you like to master today?',
    curatedNotice: 'Curated Knowledge Base Mode (Awaiting GEMINI_API_KEY for live generation)',
  },
  Kannada: {
    moduleTitle: 'ಕುಡ್ಲ ಲರ್ನ್',
    moduleSubtitle: 'ಕೃತಕ ಬುದ್ಧಿಮತ್ತೆ (AI) ಕಲಿಕಾ ಸಹಾಯಕ & ಪರಿಕಲ್ಪನೆ ಅನ್ವೇಷಕ',
    dashboardNav: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    statusActive: 'ಕುಡ್ಲ ಲರ್ನ್ ಇಂಟರ್‌ಫೇಸ್ ಸಕ್ರಿಯವಾಗಿದೆ: ಜೆಮಿನಿ AI ಜೊತೆ ಕನ್ನಡ ಕಲಿಕಾ ಮೋಡ್ ಸಿದ್ಧವಾಗಿದೆ.',
    statusApiKeyNeeded: '.env.local ನಲ್ಲಿ GEMINI_API_KEY ಕಂಡುಬಂದಿಲ್ಲ. ಕ್ಯುರೇಟೆಡ್ ಸ್ಥಳೀಯ ಜ್ಞಾನ ಮೋಡ್‌ನಲ್ಲಿ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತಿದೆ. ಲೈವ್ AI ಗಾಗಿ GEMINI_API_KEY ಸೇರಿಸಿ.',
    studentLabel: 'ನೀವು',
    assistantLabel: 'ಕುಡ್ಲ AI ಸಹಾಯಕ',
    thinkingText: 'ಸಮಗ್ರ ಶೈಕ್ಷಣಿಕ ವಿವರಣೆಯನ್ನು ರೂಪಿಸಲಾಗುತ್ತಿದೆ...',
    startersTitle: 'ಸೂಚಿಸಲಾದ ಕಲಿಕಾ ಪ್ರಶ್ನೆಗಳು:',
    starterPrompts: [
      'ನೈಜ ಪ್ರಪಂಚದ ಉದಾಹರಣೆಯೊಂದಿಗೆ ಪುನರಾವರ್ತನೆ (Recursion) ಮತ್ತು ಬೇಸ್ ಕೇಸ್ ವಿವರಿಸಿ.',
      'ಆಪರೇಟಿಂಗ್ ಸಿಸ್ಟಮ್‌ನಲ್ಲಿ ಪ್ರೊಸೆಸ್ (Process) ಮತ್ತು ಥ್ರೆಡ್ (Thread) ನಡುವಿನ ವ್ಯತ್ಯಾಸವೇನು?',
      'ಡಿಜ್ಕ್‌ಸ್ಟ್ರಾ (Dijkstra) ಕನಿಷ್ಠ ದೂರದ ಅಲ್ಗಾರಿದಮ್ ಹಂತ-ಹಂತವಾಗಿ ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ?',
      'ಆರಂಭಿಕರಿಗಾಗಿ ಗ್ರೇಡಿಯಂಟ್ ಡಿಸೆಂಟ್ (Gradient Descent) ಮತ್ತು ಲರ್ನಿಂಗ್ ರೇಟ್ ವಿವರಿಸಿ.',
    ],
    inputPlaceholder: 'ಕನ್ನಡದಲ್ಲಿ ಪ್ರಶ್ನೆ ಕೇಳಿ ಅಥವಾ ವಿಷಯವನ್ನು ವಿವರಿಸಿ...',
    uploadTooltip: 'ದಾಖಲೆ ವಿಶ್ಲೇಷಣೆ: PDF ಅಥವಾ ಇಮೇಜ್ ನೋಟ್ಸ್ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    audioTooltip: 'ಆಡಿಯೋ ಪಾಠಗಳು: ಧ್ವನಿ ವಿವರಣೆಯನ್ನು ಆಲಿಸಿ',
    welcomeMessage: 'ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಕುಡ್ಲ ಲರ್ನ್ AI ಕಲಿಕಾ ಸಹಾಯಕ. ಕಠಿಣ ಶೈಕ್ಷಣಿಕ ಪರಿಕಲ್ಪನೆಗಳನ್ನು ಸರಳವಾಗಿ ವಿವರಿಸಲು, ಹಂತ-ಹಂತದ ವಿಧಾನ, ನೈಜ ಉದಾಹರಣೆಗಳು ಮತ್ತು ಅಭ್ಯಾಸ ಪ್ರಶ್ನೆಗಳನ್ನು ಕನ್ನಡದಲ್ಲಿ ನೀಡಲು ನಾನು ಸಿದ್ಧನಾಗಿದ್ದೇನೆ. ಇಂದು ನೀವು ಏನನ್ನು ಕಲಿಯಲು ಬಯಸುತ್ತೀರಿ?',
    curatedNotice: 'ಕ್ಯುರೇಟೆಡ್ ಜ್ಞಾನ ಭಂಡಾರ (ಲೈವ್ ಉತ್ಪಾದನೆಗಾಗಿ GEMINI_API_KEY ಅಗತ್ಯವಿದೆ)',
  },
  Hindi: {
    moduleTitle: 'कुडला लर्न',
    moduleSubtitle: 'एआई शिक्षण सहायक एवं अवधारणा अन्वेषक',
    dashboardNav: 'डैशबोर्ड',
    statusActive: 'कुडला लर्न इंटरफेस सक्रिय है: जेमिनी एआई के साथ बहुभाषी अध्ययन मोड तैयार है।',
    statusApiKeyNeeded: '.env.local में GEMINI_API_KEY नहीं मिली। स्थानीय ज्ञान मोड सक्रिय है।',
    studentLabel: 'आप',
    assistantLabel: 'कुडला एआई सहायक',
    thinkingText: 'विस्तृत शैक्षणिक उत्तर तैयार किया जा रहा है...',
    startersTitle: 'सुझाए गए अध्ययन प्रश्न:',
    starterPrompts: [
      'वास्तविक जीवन के उदाहरण के साथ रिकर्सन (Recursion) को समझाइए।',
      'ऑपरेटिंग सिस्टम में प्रोसेस (Process) और थ्रेड (Thread) में क्या अंतर है?',
      'डिज्क्स्ट्रा (Dijkstra) एल्गोरिदम चरणबद्ध तरीके से कैसे काम करता है?',
      'ग्रेडिएंट डिसेंट (Gradient Descent) और लर्निंग रेट को सरल भाषा में समझाइए।',
    ],
    inputPlaceholder: 'हिंदी में प्रश्न पूछें या कोई विषय टाइप करें...',
    uploadTooltip: 'दस्तावेज़ विश्लेषण: पीडीएफ या इमेज नोट्स अपलोड करें',
    audioTooltip: 'ऑडियो पाठ: वॉयस व्याख्या सुनें',
    welcomeMessage: 'नमस्ते! मैं आपका कुडला लर्न एआई अध्ययन सहायक हूं। मैं कठिन अवधारणाओं की विस्तृत व्याख्या, चरणबद्ध प्रक्रिया, वास्तविक उदाहरण और अभ्यास प्रश्न प्रदान करता हूं। आज आप क्या सीखना चाहते हैं?',
    curatedNotice: 'क्यूरेटेड ज्ञान मोड (लाइव पीढ़ी के लिए GEMINI_API_KEY आवश्यक है)',
  },
  Telugu: {
    moduleTitle: 'కుడ్ల లెర్న్',
    moduleSubtitle: 'AI అభ్యాస సహాయకుడు & కాన్సెప్ట్ ఎక్స్‌ప్లోరర్',
    dashboardNav: 'డ్యాష్‌బోర్డ్',
    statusActive: 'కుడ్ల లెర్న్ ఇంటర్‌ఫేస్ సిద్ధంగా ఉంది: జెమిని AI తో బహుభాషా అధ్యయనం ప్రారంభమైంది.',
    statusApiKeyNeeded: '.env.local లో GEMINI_API_KEY కనుగొనబడలేదు. స్థానిక జ్ఞాన మోడ్‌లో నడుస్తోంది.',
    studentLabel: 'మీరు',
    assistantLabel: 'కుడ్ల AI అసిస్టెంట్',
    thinkingText: 'సవివరమైన సమాధానాన్ని సిద్ధం చేస్తోంది...',
    startersTitle: 'సూచించిన ప్రశ్నలు:',
    starterPrompts: [
      'నిజ జీవిత ఉదాహరణతో రికర్షన్ (Recursion) గురించి వివరించండి.',
      'ప్రాసెస్ (Process) మరియు థ్రెడ్ (Thread) మధ్య తేడా ఏమిటి?',
      'డిజ్క్‌స్ట్రా (Dijkstra) అల్గోరిథం ఎలా పనిచేస్తుంది?',
      'గ్రేడియంట్ డీసెంట్ (Gradient Descent) గురించి సులభంగా వివరించండి.',
    ],
    inputPlaceholder: 'తెలుగులో ప్రశ్న అడగండి లేదా విషయం నమోదు చేయండి...',
    uploadTooltip: 'డాక్యుమెంట్ ఇంటెలిజెన్స్: PDF లేదా నోట్స్ అప్‌లోడ్ చేయండి',
    audioTooltip: 'ఆడియో పాఠాలు: వాయిస్ వివరణ వినండి',
    welcomeMessage: 'నమస్కారం! నేను మీ కుడ్ల లెర్న్ AI స్టడీ అసిస్టెంట్. మీకు కాన్సెప్ట్‌లను వివరంగా వివరించడానికి సిద్ధంగా ఉన్నాను. ఈ రోజు మీరు ఏమి నేర్చుకోవాలనుకుంటున్నారు?',
    curatedNotice: 'స్థానిక జ్ఞాన మోడ్ (లైవ్ ఉత్పత్తి కోసం GEMINI_API_KEY అవసరం)',
  },
  Tamil: {
    moduleTitle: 'குட்லா லெர்ன்',
    moduleSubtitle: 'AI கற்றல் உதவியாளர் & கருத்து ஆய்வாளர்',
    dashboardNav: 'டாஷ்போர்டு',
    statusActive: 'குட்லா லெர்ன் இடைமுகம் செயலில் உள்ளது: ஜெமினி AI உடன் பலமொழி கற்றல் தயார்.',
    statusApiKeyNeeded: '.env.local இல் GEMINI_API_KEY இல்லை. உள்ளூர் அறிவு முறையில் இயங்குகிறது.',
    studentLabel: 'நீங்கள்',
    assistantLabel: 'குட்லா AI உதவியாளர்',
    thinkingText: 'விரிவான கல்வி பதிலை உருவாக்குகிறது...',
    startersTitle: 'பரிந்துரைக்கப்பட்ட கேள்விகள்:',
    starterPrompts: [
      'நிஜ உலக உதாரணத்துடன் ரிகர்ஷன் (Recursion) பற்றி விளக்குங்கள்.',
      'ப்ராசஸ் (Process) மற்றும் த்ரெட் (Thread) இடையே உள்ள வேறுபாடு என்ன?',
      'டிஜ்க்ஸ்ட்ரா (Dijkstra) அல்காரிதம் எவ்வாறு செயல்படுகிறது?',
      'கிரேடியன்ட் டீசன்ட் (Gradient Descent) பற்றி எளிமையாக விளக்குங்கள்.',
    ],
    inputPlaceholder: 'தமிழில் கேள்வி கேட்கவும் அல்லது தலைப்பை உள்ளிடவும்...',
    uploadTooltip: 'ஆவண நுண்ணறிவு: PDF அல்லது குறிப்புகளை பதிவேற்றவும்',
    audioTooltip: 'ஆடியோ பாடங்கள்: குரல் விளக்கத்தைக் கேளுங்கள்',
    welcomeMessage: 'வணக்கம்! நான் உங்கள் குட்லா லெர்ன் AI படிப்பு உதவியாளர். சிக்கலான கருத்துக்களை எளிமையாக விளக்க நான் தயாராக உள்ளேன். இன்று நீங்கள் என்ன கற்க விரும்புகிறீர்கள்?',
    curatedNotice: 'உள்ளூர் அறிவு முறை (நேரடி உற்பத்திக்கு GEMINI_API_KEY தேவை)',
  },
};

export function getStoredLanguage(): SupportedLanguage {
  if (typeof window === 'undefined') return 'English';
  const saved = localStorage.getItem('kudla_selected_language');
  if (saved && (saved in SUPPORTED_LANGUAGES)) {
    return saved as SupportedLanguage;
  }
  return 'English';
}

export function setStoredLanguage(lang: SupportedLanguage): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('kudla_selected_language', lang);
}
