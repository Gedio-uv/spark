/**
 * Spark — Core application logic
 * Phase 1: localStorage only, no backend
 */

const Spark = (() => {
  const STORAGE_KEYS = {
    onboarding: 'spark_onboarding_complete',
    prefs: 'spark_user_prefs',
    feedback: 'spark_feedback',
    session: 'spark_session',
  };

  const SUPPORTED_LANGS = ['en', 'es', 'de', 'ru'];
  const TIMER_OPTIONS = [15, 30, 45, 0];

  const DEFAULT_PREFS = {
    mode: 'play',
    nativeLang: 'en',
    targetLang: 'de',
    level: 'basic',
    categories: ['general'],
    timerMinutes: 0,
  };

  const UI = {
    en: {
      tagline: 'Real conversations',
      modeTitle: 'How do you want to play?',
      modePlay: 'Just play',
      modePlayDesc: 'Social conversation game in your language',
      modeLearn: 'Learn a language',
      modeLearnDesc: 'Practice while you play with progressive immersion',
      settings: 'Change mode',
      setupTitle: 'Set up your session',
      categories: 'Categories',
      timer: 'Session timer',
      timerNone: 'No timer',
      timerMin: 'min',
      startGame: 'Start',
      targetLang: 'Language to learn',
      level: 'Your level',
      levelBasic: 'Basic',
      levelIntermediate: 'Intermediate',
      levelAdvanced: 'Advanced',
      levelDescBasic: 'Questions in your language, translation below',
      levelDescIntermediate: 'Questions in target language, translation below',
      levelDescAdvanced: 'Full immersion, no translation',
      premiumLabel: '✦ Premium',
      swipeHint: 'Swipe for next question',
      exitGame: 'Stop',
      gameBack: '← Back',
      exampleLabel: 'Example answer',
      sessionEnd: 'Time\'s up!',
      questionsPlayed: 'questions explored',
      playAgain: 'Play again',
      changeCategories: 'Change categories',
      goHome: 'Home',
      noQuestions: 'No questions available for your selection.',
      selectCategory: 'Select at least one category.',
      comingSoonTitle: 'Coming soon',
      comingSoonMessage: '{name} is on the way — we\'re adding new question packs soon.',
      comingSoonClose: 'Got it',
    },
    es: {
      tagline: 'Conversaciones reales',
      modeTitle: '¿Cómo quieres jugar?',
      modePlay: 'Solo jugar',
      modePlayDesc: 'Juego de conversación en tu idioma',
      modeLearn: 'Aprender un idioma',
      modeLearnDesc: 'Practica mientras juegas con inmersión progresiva',
      settings: 'Cambiar modo',
      setupTitle: 'Configura tu sesión',
      categories: 'Categorías',
      timer: 'Temporizador',
      timerNone: 'Sin temporizador',
      timerMin: 'min',
      startGame: 'Empezar',
      targetLang: 'Idioma a aprender',
      level: 'Tu nivel',
      levelBasic: 'Básico',
      levelIntermediate: 'Intermedio',
      levelAdvanced: 'Avanzado',
      levelDescBasic: 'Preguntas en tu idioma, traducción abajo',
      levelDescIntermediate: 'Preguntas en el idioma objetivo, traducción abajo',
      levelDescAdvanced: 'Inmersión total, sin traducción',
      premiumLabel: '✦ Premium',
      swipeHint: 'Desliza para la siguiente pregunta',
      exitGame: 'Salir',
      gameBack: '← Atrás',
      exampleLabel: 'Ejemplo de respuesta',
      sessionEnd: '¡Se acabó el tiempo!',
      questionsPlayed: 'preguntas exploradas',
      playAgain: 'Jugar de nuevo',
      changeCategories: 'Cambiar categorías',
      goHome: 'Inicio',
      noQuestions: 'No hay preguntas disponibles.',
      selectCategory: 'Selecciona al menos una categoría.',
      comingSoonTitle: 'Próximamente',
      comingSoonMessage: '{name} llegará pronto — estamos preparando nuevos packs de preguntas.',
      comingSoonClose: 'Entendido',
    },
    de: {
      tagline: 'Echte Gespräche',
      modeTitle: 'Wie möchtest du spielen?',
      modePlay: 'Einfach spielen',
      modePlayDesc: 'Gesprächsspiel in deiner Sprache',
      modeLearn: 'Sprache lernen',
      modeLearnDesc: 'Übe beim Spielen mit progressivem Eintauchen',
      settings: 'Modus ändern',
      setupTitle: 'Session einrichten',
      categories: 'Kategorien',
      timer: 'Session-Timer',
      timerNone: 'Kein Timer',
      timerMin: 'Min',
      startGame: 'Starten',
      targetLang: 'Sprache zum Lernen',
      level: 'Dein Niveau',
      levelBasic: 'Grundstufe',
      levelIntermediate: 'Mittelstufe',
      levelAdvanced: 'Fortgeschritten',
      levelDescBasic: 'Fragen in deiner Sprache, Übersetzung darunter',
      levelDescIntermediate: 'Fragen in der Zielsprache, Übersetzung darunter',
      levelDescAdvanced: 'Volle Immersion, keine Übersetzung',
      premiumLabel: '✦ Premium',
      swipeHint: 'Wischen für nächste Frage',
      exitGame: 'Beenden',
      gameBack: '← Zurück',
      exampleLabel: 'Beispielantwort',
      sessionEnd: 'Zeit ist um!',
      questionsPlayed: 'Fragen erkundet',
      playAgain: 'Nochmal spielen',
      changeCategories: 'Kategorien ändern',
      goHome: 'Startseite',
      noQuestions: 'Keine Fragen verfügbar.',
      selectCategory: 'Wähle mindestens eine Kategorie.',
      comingSoonTitle: 'Demnächst',
      comingSoonMessage: '{name} kommt bald — wir bereiten neue Fragenpakete vor.',
      comingSoonClose: 'Verstanden',
    },
    ru: {
      tagline: 'Настоящие разговоры',
      modeTitle: 'Как вы хотите играть?',
      modePlay: 'Просто играть',
      modePlayDesc: 'Разговорная игра на вашем языке',
      modeLearn: 'Изучать язык',
      modeLearnDesc: 'Практикуйтесь во время игры с постепенным погружением',
      settings: 'Сменить режим',
      setupTitle: 'Настройте сессию',
      categories: 'Категории',
      timer: 'Таймер сессии',
      timerNone: 'Без таймера',
      timerMin: 'мин',
      startGame: 'Начать',
      targetLang: 'Язык для изучения',
      level: 'Ваш уровень',
      levelBasic: 'Начальный',
      levelIntermediate: 'Средний',
      levelAdvanced: 'Продвинутый',
      levelDescBasic: 'Вопросы на вашем языке, перевод ниже',
      levelDescIntermediate: 'Вопросы на целевом языке, перевод ниже',
      levelDescAdvanced: 'Полное погружение, без перевода',
      premiumLabel: '✦ Premium',
      swipeHint: 'Смахните для следующего вопроса',
      exitGame: 'Выйти',
      gameBack: '← Назад',
      exampleLabel: 'Пример ответа',
      sessionEnd: 'Время вышло!',
      questionsPlayed: 'вопросов просмотрено',
      playAgain: 'Играть снова',
      changeCategories: 'Сменить категории',
      goHome: 'Главная',
      noQuestions: 'Нет доступных вопросов.',
      selectCategory: 'Выберите хотя бы одну категорию.',
      comingSoonTitle: 'Скоро',
      comingSoonMessage: '{name} скоро появится — мы готовим новые наборы вопросов.',
      comingSoonClose: 'Понятно',
    },
  };

  function getDeviceLanguage() {
    const lang = (navigator.language || 'en').slice(0, 2).toLowerCase();
    return SUPPORTED_LANGS.includes(lang) ? lang : 'en';
  }

  function getPrefs() {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.prefs);
      if (stored) {
        return { ...DEFAULT_PREFS, ...JSON.parse(stored) };
      }
    } catch (_) { /* ignore */ }
    return { ...DEFAULT_PREFS, nativeLang: getDeviceLanguage() };
  }

  function setPrefs(updates) {
    const prefs = { ...getPrefs(), ...updates };
    localStorage.setItem(STORAGE_KEYS.prefs, JSON.stringify(prefs));
    return prefs;
  }

  function isOnboardingComplete() {
    return localStorage.getItem(STORAGE_KEYS.onboarding) === 'true';
  }

  function completeOnboarding() {
    localStorage.setItem(STORAGE_KEYS.onboarding, 'true');
  }

  function resetOnboarding() {
    localStorage.removeItem(STORAGE_KEYS.onboarding);
  }

  function t(key) {
    const prefs = getPrefs();
    const lang = prefs.mode === 'learn' && prefs.level === 'advanced'
      ? prefs.targetLang
      : prefs.nativeLang;
    const strings = UI[SUPPORTED_LANGS.includes(lang) ? lang : 'en'];
    return strings[key] || UI.en[key] || key;
  }

  function localizedText(obj, lang) {
    if (!obj) return '';
    return obj[lang] || obj.en || Object.values(obj)[0] || '';
  }

  async function loadCategories() {
    const res = await fetch('data/categories.json');
    const data = await res.json();
    return data.categories;
  }

  async function loadQuestions() {
    const res = await fetch('data/questions.json');
    const data = await res.json();
    return data.questions;
  }

  function getQuestionDisplay(question) {
    const prefs = getPrefs();
    const { mode, nativeLang, targetLang, level } = prefs;

    if (mode === 'play') {
      return {
        primary: localizedText(question.text, nativeLang),
        translation: null,
      };
    }

    if (level === 'basic') {
      return {
        primary: localizedText(question.text, nativeLang),
        translation: localizedText(question.text, targetLang),
      };
    }

    if (level === 'intermediate') {
      return {
        primary: localizedText(question.text, targetLang),
        translation: localizedText(question.text, nativeLang),
      };
    }

    return {
      primary: localizedText(question.text, targetLang),
      translation: null,
    };
  }

  function getExampleDisplay(question) {
    const prefs = getPrefs();
    if (prefs.mode !== 'learn' || prefs.level !== 'basic' || !question.exampleAnswer) {
      return null;
    }

    return {
      primary: localizedText(question.exampleAnswer, prefs.nativeLang),
      translation: localizedText(question.exampleAnswer, prefs.targetLang),
    };
  }

  function getFeedback() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.feedback) || '{}');
    } catch (_) {
      return {};
    }
  }

  function logDislike(questionId) {
    const feedback = getFeedback();
    feedback[questionId] = (feedback[questionId] || 0) + 1;
    localStorage.setItem(STORAGE_KEYS.feedback, JSON.stringify(feedback));
  }

  function startSession(questions) {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    const session = {
      pool: shuffled.map((q) => q.id),
      seen: [],
      count: 0,
      startedAt: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
    return session;
  }

  function getSession() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.session));
    } catch (_) {
      return null;
    }
  }

  function getNextQuestionId(session) {
    const remaining = session.pool.filter((id) => !session.seen.includes(id));
    if (remaining.length === 0) return null;
    const id = remaining[Math.floor(Math.random() * remaining.length)];
    session.seen.push(id);
    session.count += 1;
    localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(session));
    return id;
  }

  function applyCategoryExclusion(selected) {
    const disabled = new Set();
    if (selected.includes('kids_family')) {
      disabled.add('couples');
      disabled.add('spicy');
    }
    if (selected.includes('couples') || selected.includes('spicy')) {
      disabled.add('kids_family');
    }
    return disabled;
  }

  function navigate(path) {
    window.location.href = path;
  }

  return {
    STORAGE_KEYS,
    SUPPORTED_LANGS,
    TIMER_OPTIONS,
    DEFAULT_PREFS,
    getDeviceLanguage,
    getPrefs,
    setPrefs,
    isOnboardingComplete,
    completeOnboarding,
    resetOnboarding,
    t,
    localizedText,
    loadCategories,
    loadQuestions,
    getQuestionDisplay,
    getExampleDisplay,
    getFeedback,
    logDislike,
    startSession,
    getSession,
    getNextQuestionId,
    applyCategoryExclusion,
    navigate,
  };
})();
