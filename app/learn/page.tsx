'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Sparkles,
  Send,
  Languages,
  Volume2,
  Paperclip,
  Info,
  AlertTriangle,
} from 'lucide-react';
import {
  type SupportedLanguage,
  SUPPORTED_LANGUAGES,
  TRANSLATIONS,
  getStoredLanguage,
  setStoredLanguage,
} from '@/lib/i18n';
import { MarkdownRenderer } from '@/components/MarkdownRenderer';

let messageCounter = 0;
function getNextMessageId(prefix: string) {
  messageCounter += 1;
  return `${prefix}-${messageCounter}`;
}

interface ChatMessage {
  id: string;
  sender: 'student' | 'assistant';
  text: string;
  timestamp: string;
  language?: string;
  isCuratedFallback?: boolean;
}

// Structured educational fallbacks with all 9 requested sections when GEMINI_API_KEY is not configured
const CURATED_KNOWLEDGE: Record<string, Record<string, string>> = {
  English: {
    recursion: `### 1. Introduction & Formal Definition
**Recursion** is a programming and mathematical technique where a function solves a problem by calling a copy of itself with a smaller input. It breaks complex problems into identical, simpler sub-problems.

### 2. Detailed Conceptual Deep-Dive
A recursive algorithm relies on the Call Stack. Each recursive call allocates a new stack frame containing local variables and return addresses. Recursion halts when it satisfies the **Base Case**.

### 3. Step-by-Step Working & Mechanics
1. **Function Invocation:** The function receives input \`n\`.
2. **Base Case Validation:** Checks if \`n <= 1\`. If true, returns immediately without recursive calls.
3. **Recursive Call (Reduction Step):** Calls itself with \`n - 1\`.
4. **Stack Unwinding:** As base cases return, stacked frames resolve back up to the initial caller.

\`\`\`python
def factorial(n: int) -> int:
    # 1. Base Case
    if n <= 1:
        return 1
    # 2. Recursive Case
    return n * factorial(n - 1)
\`\`\`

### 4. Real-World Analogy & Example
Think of Russian Matryoshka nesting dolls: to reach the tiny prize inside, you open doll after doll (recursive step) until you reach the smallest doll that cannot open anymore (base case).

### 5. Practical Engineering Applications
- **Tree and Graph Traversals:** DOM tree parsing, AST generation in compilers.
- **Divide-and-Conquer:** Merge Sort, Quick Sort, Binary Search.
- **Backtracking:** Maze solving, Sudoku solvers, constraint programming.

### 6. Advantages & Trade-Offs
- **Pros:** Expressive, elegant code; matches inductive definitions naturally.
- **Cons:** Memory overhead ($O(N)$ stack space); potential \`StackOverflowError\` without tail-call optimization.

### 7. Key Exam & Interview Takeaways
- Always verify the base case first.
- Analyze recursion depth for stack space complexity.
- Be prepared to convert recursive solutions to iterative using an explicit Stack.

### 8. Quick Summary
Recursion solves a problem by invoking smaller instances of itself until hitting a halting base case, unwinding stack frames to construct the final result.

### 9. Practice Questions (PYQ Style)
1. Write a recursive function to reverse a singly linked list in $O(N)$ time.
2. What is Tail Recursion and how do modern compilers optimize it?`,

    default: `### 1. Introduction & Formal Definition
This concept is a core foundation in computer science and engineering systems.

### 2. Detailed Conceptual Deep-Dive
At an architectural level, the principle governs data representation, execution flow, and system trade-offs.

### 3. Step-by-Step Working & Mechanics
1. **Input & Pre-conditions:** Establishing parameters and boundaries.
2. **Execution Flow:** Processing invariants step-by-step.
3. **State Transition:** Updating memory and state tables.
4. **Output Verification:** Conforming to specification.

### 4. Real-World Analogy & Example
Consider an airport traffic control tower managing queues: operations must be synchronized, deterministic, and fault-tolerant.

### 5. Practical Engineering Applications
Widely utilized in distributed systems, operating systems, and web application architectures.

### 6. Advantages & Trade-Offs
Provides robust predictability, with trade-offs in computational latency vs. memory consumption.

### 7. Key Exam & Interview Takeaways
Expect questions on edge cases, asymptotic complexity, and concurrent thread safety.

### 8. Quick Summary
Mastering this topic allows engineers to reason rigorously about system scale and correctness.

### 9. Practice Questions (PYQ Style)
1. Analyze the time and space complexity of standard implementations.
2. How does this behave under distributed network failure?`,
  },

  Kannada: {
    recursion: `### 1. ಪರಿಚಯ ಮತ್ತು ಔಪಚಾರಿಕ ವ್ಯಾಖ್ಯಾನ (Introduction & Formal Definition)
**ಪುನರಾವರ್ತನೆ (Recursion)** ಎಂಬುದು ಕಂಪ್ಯೂಟರ್ ಸೈನ್ಸ್‌ನ ಒಂದು ಪ್ರಮುಖ ವಿಧಾನವಾಗಿದ್ದು, ಇದರಲ್ಲಿ ಒಂದು ಫಂಕ್ಷನ್ ತನ್ನ ಸಮಸ್ಯೆಯನ್ನು ಪರಿಹರಿಸಲು ತನ್ನನ್ನೇ ಪುನಃ ಕರೆಯುತ್ತದೆ (Self-calling function). ಇದು ಸಂಕೀರ್ಣ ಸಮಸ್ಯೆಯನ್ನು ಚಿಕ್ಕ ಚಿಕ್ಕ ಸಮಾನ ಸಮಸ್ಯೆಗಳಾಗಿ ವಿಭಜಿಸುತ್ತದೆ.

### 2. ಪರಿಕಲ್ಪನೆಯ ಆಳವಾದ ವಿವರಣೆ (Detailed Conceptual Deep-Dive)
ಪ್ರತಿಯೊಂದು ರಿಕರ್ಸಿವ್ ಕರೆಯು ಕಂಪ್ಯೂಟರ್‌ನ **ಕಾಲ್ ಸ್ಟಾಕ್ (Call Stack)** ನಲ್ಲಿ ಹೊಸ ಸ್ಟಾಕ್ ಫ್ರೇಮ್ ಅನ್ನು ಸೃಷ್ಟಿಸುತ್ತದೆ. ಸಮಸ್ಯೆಯು **ಬೇಸ್ ಕೇಸ್ (Base Case)** ತಲುಪಿದಾಗ ಈ ಪುನರಾವರ್ತನೆ ನಿಲ್ಲುತ್ತದೆ. ಬೇಸ್ ಕೇಸ್ ಇಲ್ಲದಿದ್ದರೆ \`StackOverflowError\` ಸಂಭವಿಸುತ್ತದೆ.

### 3. ಹಂತ-ಹಂತದ ಕಾರ್ಯವಿಧಾನ (Step-by-Step Working & Mechanics)
1. **ಫಂಕ್ಷನ್ ಆರಂಭ:** ಫಂಕ್ಷನ್‌ಗೆ ಇನ್‌ಪುಟ್ \`n\` ಬರುತ್ತದೆ.
2. **ಬೇಸ್ ಕೇಸ್ ಪರೀಕ್ಷೆ:** \`n <= 1\` ಆಗಿದೆಯೇ ಎಂದು ಪರಿಶೀಲಿಸಲಾಗುತ್ತದೆ. ಹೌದಾದರೆ, ಫಲಿತಾಂಶ \`1\` ಅನ್ನು ಹಿಂದಿರುಗಿಸುತ್ತದೆ.
3. **ಪುನರಾವರ್ತಿತ ಕರೆ (Reduction Step):** \`n - 1\` ಇನ್‌ಪುಟ್‌ನೊಂದಿಗೆ ಫಂಕ್ಷನ್ ತನ್ನನ್ನೇ ಕರೆಯುತ್ತದೆ.
4. **ಸ್ಟಾಕ್ ಪರಿಹಾರ (Stack Unwinding):** ಬೇಸ್ ಕೇಸ್ ತಲುಪಿದ ನಂತರ, ಸ್ಟಾಕ್‌ನಲ್ಲಿರುವ ಮೌಲ್ಯಗಳು ಒಂದೊಂದಾಗಿ ಗುಣಿಸಲ್ಪಡುತ್ತವೆ.

\`\`\`python
def factorial(n: int) -> int:
    # 1. ಬೇಸ್ ಕೇಸ್ (Base Case)
    if n <= 1:
        return 1
    # 2. ರಿಕರ್ಸಿವ್ ಕೇಸ್ (Recursive Case)
    return n * factorial(n - 1)
\`\`\`

### 4. ನೈಜ ಪ್ರಪಂಚದ ಸಾದೃಶ್ಯ ಮತ್ತು ಉದಾಹರಣೆ (Real-World Analogy)
ಒಂದರೊಳಗೆ ಒಂದಿರುವ ಮರದ ಗೊಂಬೆಗಳನ್ನು (Russian Nesting Dolls) ಊಹಿಸಿಕೊಳ್ಳಿ. ಒಳಗಿರುವ ಸಣ್ಣ ಬಹುಮಾನ ಪಡೆಯಲು ನೀವು ಒಂದೊಂದೇ ಗೊಂಬೆಯನ್ನು ತೆರೆಯುತ್ತಾ ಹೋಗುತ್ತೀರಿ (ರಿಕರ್ಸಿವ್ ಹಂತ), ಕೊನೆಯ ಅತ್ಯಂತ ಚಿಕ್ಕ ಗೊಂಬೆ ತಲುಪಿದಾಗ (ಬೇಸ್ ಕೇಸ್) ಹುಡುಕಾಟ ಮುಕ್ತಾಯವಾಗುತ್ತದೆ.

### 5. ಪ್ರಾಯೋಗಿಕ ಎಂಜಿನಿಯರಿಂಗ್ ಅನ್ವಯಗಳು (Practical Applications)
- **ಟ್ರೀ ಮತ್ತು ಗ್ರಾಫ್ ಅನ್ವೇಷಣೆ:** ವೆಬ್ ಬ್ರೌಸರ್‌ನ DOM ಟ್ರೀ ಮತ್ತು ಫೈಲ್ ಸಿಸ್ಟಮ್ ಡೈರೆಕ್ಟರಿ ಶೋಧನೆ.
- **ವಿಭಜಿಸಿ ಜಯಿಸುವ ಅಲ್ಗಾರಿದಮ್‌ಗಳು (Divide & Conquer):** ಮರ್ಜ್ ಸಾರ್ಟ್ (Merge Sort) ಮತ್ತು ಕ್ವಿಕ್ ಸಾರ್ಟ್ (Quick Sort).
- **ಬ್ಯಾಕ್‌ಟ್ರ್ಯಾಕಿಂಗ್:** ಸುಡೋಕು ಮತ್ತು ಮೇಜ್ (Maze) ಪರಿಹಾರಗಳು.

### 6. ಅನುಕೂಲಗಳು ಮತ್ತು ಮಿತಿಗಳು (Advantages & Trade-Offs)
- **ಅನುಕೂಲಗಳು:** ಸಂಕೀರ್ಣ ಗಣಿತದ ಸಮಸ್ಯೆಗಳಿಗೆ ಕ್ಲೀನ್ ಮತ್ತು ಸರಳ ಕೋಡ್.
- **ಮಿತಿಗಳು:** ಪ್ರತಿ ಕರೆಗೂ ಸ್ಟಾಕ್ ಮೆಮೊರಿ ವ್ಯಯವಾಗುತ್ತದೆ ($O(N)$ Space).

### 7. ಪರೀಕ್ಷೆ ಮತ್ತು ಸಂದರ್ಶನದ ಮುಖ್ಯ ಮುಖ್ಯಾಂಶಗಳು (Key Takeaways)
- ಯಾವಾಗಲೂ ಬೇಸ್ ಕೇಸ್ ಸರಿಯಾಗಿದೆಯೇ ಎಂದು ಮೊದಲು ಪರಿಶೀಲಿಸಿ.
- ಸ್ಟಾಕ್ ಓವರ್‌ಫ್ಲೋ ತಪ್ಪಿಸಲು ಆಳವನ್ನು ವಿಶ್ಲೇಷಿಸಿ.

### 8. ಸಾರಾಂಶ (Summary)
ಪುನರಾವರ್ತನೆಯು ಸಮಸ್ಯೆಯನ್ನು ಚಿಕ್ಕದಾಗಿಸುತ್ತಾ ಬೇಸ್ ಕೇಸ್ ತಲುಪಿ, ಸ್ಟಾಕ್ ಮುಖಾಂತರ ಉತ್ತರವನ್ನು ಒಟ್ಟುಗೂಡಿಸುವ ಶಕ್ತಿಯುತ ಪ್ರೋಗ್ರಾಮಿಂಗ್ ತಂತ್ರವಾಗಿದೆ.

### 9. ಅಭ್ಯಾಸ ಪ್ರಶ್ನೆಗಳು (Practice Questions)
1. ಲಿಂಕ್ಡ್ ಲಿಸ್ಟ್ (Linked List) ಅನ್ನು ಪುನರಾವರ್ತನೆ ಬಳಸಿ ರಿವರ್ಸ್ ಮಾಡುವುದು ಹೇಗೆ?
2. ಟೈಲ್ ರಿಕರ್ಶನ್ (Tail Recursion) ಎಂದರೇನು ಮತ್ತು ಕಂಪೈಲರ್ ಅದನ್ನು ಹೇಗೆ ಆಪ್ಟಿಮೈಸ್ ಮಾಡುತ್ತದೆ?`,

    default: `### 1. ಪರಿಚಯ ಮತ್ತು ವ್ಯಾಖ್ಯಾನ
ಈ ಪರಿಕಲ್ಪನೆಯು ಕಂಪ್ಯೂಟರ್ ಸೈನ್ಸ್ ಮತ್ತು ಎಂಜಿನಿಯರಿಂಗ್ ವ್ಯವಸ್ಥೆಗಳ ಅಡಿಪಾಯವಾಗಿದೆ.

### 2. ಪರಿಕಲ್ಪನೆಯ ಸವಿವರ ವಿವರಣೆ
ಸಿಸ್ಟಮ್ ಆರ್ಕಿಟೆಕ್ಚರ್ ಮಟ್ಟದಲ್ಲಿ, ಇದು ಡೇಟಾ ಪ್ರಕ್ರಿಯೆ ಮತ್ತು ಮೆಮೊರಿ ನಿರ್ವಹಣೆಯನ್ನು ನಿಯಂತ್ರಿಸುತ್ತದೆ.

### 3. ಹಂತ-ಹಂತದ ಕಾರ್ಯವಿಧಾನ
1. ಇನ್‌ಪುಟ್ ನಿಯತಾಂಕಗಳ ಪರಿಶೀಲನೆ.
2. ವ್ಯವಸ್ಥಿತ ಅಲ್ಗಾರಿದಮ್ ಪ್ರಕ್ರಿಯೆ.
3. ಮೆಮೊರಿ ಸ್ಥಿತಿಯ ನವೀಕರಣ.
4. ನಿಖರವಾದ ಔಟ್‌ಪುಟ್ ಸಲ್ಲಿಕೆ.

### 4. ನೈಜ ಪ್ರಪಂಚದ ಉದಾಹರಣೆ
ವಿಮಾನ ನಿಲ್ದಾಣದ ಟ್ರಾಫಿಕ್ ಕಂಟ್ರೋಲ್ ಟವರ್ ಕೆಲಸ ಮಾಡುವ ರೀತಿಯಲ್ಲಿ ಈ ವ್ಯವಸ್ಥೆಯು ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ.

### 5. ಎಂಜಿನಿಯರಿಂಗ್ ಅನ್ವಯಗಳು
ಆಪರೇಟಿಂಗ್ ಸಿಸ್ಟಮ್‌ಗಳು, ನೆಟ್‌ವರ್ಕಿಂಗ್ ಪ್ರೋಟೋಕಾಲ್‌ಗಳು ಮತ್ತು ಸಾಫ್ಟ್‌ವೇರ್ ಅಪ್ಲಿಕೇಶನ್‌ಗಳಲ್ಲಿ ವ್ಯಾಪಕವಾಗಿ ಬಳಕೆಯಾಗುತ್ತದೆ.

### 6. ಮುಖ್ಯ ಪರೀಕ್ಷಾ ಮುಖ್ಯಾಂಶಗಳು
ಪರೀಕ್ಷೆ ಮತ್ತು ಇಂಟರ್ವ್ಯೂಗಳಲ್ಲಿ ಟೈಮ್ ಕಾಂಪ್ಲೆಕ್ಸಿಟಿ ಮತ್ತು ಎಡ್ಜ್ ಕೇಸ್‌ಗಳ ಬಗ್ಗೆ ಗಮನವಿಡಿ.

### 7. ಸಾರಾಂಶ
ಈ ವಿಷಯವನ್ನು ಕರಗತ ಮಾಡಿಕೊಳ್ಳುವುದರಿಂದ ಪರಿಣಾಮಕಾರಿ ಸಾಫ್ಟ್‌ವೇರ್ ಅಭಿವೃದ್ಧಿ ಸಾಧ್ಯವಾಗುತ್ತದೆ.`,
  },
};

export default function LearnPage() {
  const [selectedLanguage, setSelectedLanguageState] = useState<SupportedLanguage>(() => {
    return getStoredLanguage();
  });
  const [selectedSubject, setSelectedSubject] = useState('Computer Science');
  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const lang = getStoredLanguage();
    return [
      {
        id: 'welcome',
        sender: 'assistant',
        text: TRANSLATIONS[lang].welcomeMessage,
        timestamp: 'Just now',
        language: lang,
      },
    ];
  });
  const [isThinking, setIsThinking] = useState(false);
  const [apiConfigured, setApiConfigured] = useState<boolean | null>(null);

  const t = TRANSLATIONS[selectedLanguage];

  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setSelectedLanguageState(newLang);
    setStoredLanguage(newLang);

    // Update greeting in new language if only welcome exists
    setMessages((prev) => {
      if (prev.length <= 1) {
        return [
          {
            id: 'welcome',
            sender: 'assistant',
            text: TRANSLATIONS[newLang].welcomeMessage,
            timestamp: 'Just now',
            language: newLang,
          },
        ];
      }
      return prev;
    });
  };

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMessage: ChatMessage = {
      id: getNextMessageId('student'),
      sender: 'student',
      text: query,
      timestamp: 'Sent',
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputQuery('');
    setIsThinking(true);

    try {
      // Call server-side real Gemini API route
      const res = await fetch('/api/learn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          language: selectedLanguage,
          subject: selectedSubject,
          educationLevel: 'Undergraduate',
        }),
      });

      const data = await res.json();

      if (data.ok && data.text) {
        setApiConfigured(true);
        const botMessage: ChatMessage = {
          id: getNextMessageId('assistant'),
          sender: 'assistant',
          text: data.text,
          timestamp: 'Just now',
          language: selectedLanguage,
        };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        // API not configured or errored -> use structured local knowledge base with 9 sections
        setApiConfigured(false);

        const langKnowledge =
          CURATED_KNOWLEDGE[selectedLanguage] || CURATED_KNOWLEDGE.English;
        const lower = query.toLowerCase();

        let fallbackText = langKnowledge.default;
        if (
          lower.includes('recursion') ||
          lower.includes('ರಿಕರ್ಶನ್') ||
          lower.includes('ಪುನರಾವರ್ತನೆ')
        ) {
          fallbackText = langKnowledge.recursion;
        }

        const botMessage: ChatMessage = {
          id: getNextMessageId('assistant'),
          sender: 'assistant',
          text: fallbackText,
          timestamp: 'Just now',
          language: selectedLanguage,
          isCuratedFallback: true,
        };
        setMessages((prev) => [...prev, botMessage]);
      }
    } catch {
      setApiConfigured(false);
      const langKnowledge =
        CURATED_KNOWLEDGE[selectedLanguage] || CURATED_KNOWLEDGE.English;
      const botMessage: ChatMessage = {
        id: getNextMessageId('assistant'),
        sender: 'assistant',
        text: langKnowledge.default,
        timestamp: 'Just now',
        language: selectedLanguage,
        isCuratedFallback: true,
      };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-[#071322] text-slate-100">
      {/* HEADER */}
      <header className="border-b border-white/10 bg-[#071322] px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> {t.dashboardNav}
            </Link>

            <div className="flex items-center gap-2">
              <span className="text-xl">📚</span>
              <div>
                <h1 className="text-base font-bold text-white">
                  Kudla <span className="text-cyan-400">{t.moduleTitle}</span>
                </h1>
                <p className="text-[10px] tracking-widest text-slate-400">
                  {t.moduleSubtitle}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Subject Selector */}
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="rounded-full border border-white/10 bg-[#102238] px-3 py-1.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
            >
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Electronics">Electronics</option>
              <option value="Data Science">Data Science</option>
            </select>

            {/* Language Selector */}
            <div className="flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
              <Languages className="h-3.5 w-3.5" />
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value as SupportedLanguage)}
                className="bg-transparent font-semibold text-cyan-300 focus:outline-none"
              >
                {Object.values(SUPPORTED_LANGUAGES).map((lang) => (
                  <option
                    key={lang.code}
                    value={lang.name}
                    className="bg-[#071322] text-white"
                  >
                    {lang.nativeName} ({lang.name})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* STATUS BANNER */}
      <div className="border-b border-cyan-500/20 bg-cyan-500/10 px-6 py-2 text-xs text-cyan-200">
        <div className="mx-auto flex max-w-5xl items-center gap-2">
          {apiConfigured === false ? (
            <>
              <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
              <span className="text-amber-200">{t.statusApiKeyNeeded}</span>
            </>
          ) : (
            <>
              <Info className="h-4 w-4 shrink-0 text-cyan-400" />
              <span>{t.statusActive}</span>
            </>
          )}
        </div>
      </div>

      {/* CHAT VIEWPORT */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto max-w-4xl space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-4 ${
                msg.sender === 'student' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 text-sm font-black text-[#071322]">
                  K
                </div>
              )}

              <div
                className={`max-w-3xl rounded-2xl px-6 py-5 ${
                  msg.sender === 'student'
                    ? 'border border-cyan-400/30 bg-cyan-400/15 text-white'
                    : 'border border-white/10 bg-[#102238] text-slate-200'
                }`}
              >
                <div className="mb-2 flex items-center justify-between gap-4 border-b border-white/5 pb-2 text-[10px] text-slate-400">
                  <span className="font-semibold uppercase tracking-wider text-cyan-300">
                    {msg.sender === 'student' ? t.studentLabel : t.assistantLabel}
                  </span>
                  <div className="flex items-center gap-2">
                    {msg.isCuratedFallback && (
                      <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[9px] text-amber-300">
                        {t.curatedNotice}
                      </span>
                    )}
                    <span>{msg.timestamp}</span>
                  </div>
                </div>

                {/* Markdown Rich Content */}
                <div className="text-sm">
                  <MarkdownRenderer content={msg.text} />
                </div>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-3 text-cyan-300">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-400/20">
                <Sparkles className="h-4 w-4 animate-spin text-cyan-400" />
              </div>
              <span className="text-xs font-semibold">{t.thinkingText}</span>
            </div>
          )}
        </div>
      </div>

      {/* PROMPT STARTERS & INPUT BAR */}
      <footer className="border-t border-white/10 bg-[#071322] p-4">
        <div className="mx-auto max-w-4xl space-y-3">
          {/* Starter Pills in Selected Language */}
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-slate-400">
              {t.startersTitle}
            </p>
            <div className="flex flex-wrap gap-2">
              {t.starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="rounded-full border border-white/10 bg-[#102238] px-3.5 py-1.5 text-xs text-slate-300 transition hover:border-cyan-400 hover:text-cyan-300"
                >
                  💡 {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#102238] p-2 focus-within:border-cyan-400"
          >
            <button
              type="button"
              title={t.uploadTooltip}
              onClick={() => alert(t.uploadTooltip)}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-cyan-300"
            >
              <Paperclip className="h-4 w-4" />
            </button>

            <button
              type="button"
              title={t.audioTooltip}
              onClick={() => alert(t.audioTooltip)}
              className="rounded-xl p-2 text-slate-400 transition hover:bg-white/5 hover:text-cyan-300"
            >
              <Volume2 className="h-4 w-4" />
            </button>

            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={t.inputPlaceholder}
              className="flex-1 bg-transparent px-2 text-sm text-white placeholder-slate-500 focus:outline-none"
            />

            <button
              type="submit"
              disabled={!inputQuery.trim() || isThinking}
              className="rounded-xl bg-cyan-400 p-2.5 font-bold text-[#071322] transition hover:bg-cyan-300 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
}
