import React, { useState, useEffect } from 'react';
import {
  AspectRatioMode,
  Question,
  ScreenType,
  StageOption,
} from './types.ts';
import {
  DEFAULT_QUESTIONS,
  DEFAULT_STAGE_OPTIONS,
} from './data/defaultQuestions.ts';
import { calculateScores } from './utils/scoring.ts';
import { ambientAudio } from './utils/audio.ts';
import { exportReportToPdf } from './utils/pdfExport.ts';
import { safeFetchJson } from './utils/api.ts';
import { HeaderBar } from './components/HeaderBar.tsx';
import { WelcomeScreen } from './components/WelcomeScreen.tsx';
import { IntroScreen } from './components/IntroScreen.tsx';
import { SurveyScreen } from './components/SurveyScreen.tsx';
import { SupplementalScreen } from './components/SupplementalScreen.tsx';
import { ResultScreen } from './components/ResultScreen.tsx';
import { PrintReport } from './components/PrintReport.tsx';
import { SettingsModal } from './components/SettingsModal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { CheckCircle2, X } from 'lucide-react';

export default function App() {
  const [aspectMode, setAspectMode] = useState<AspectRatioMode>('16:9');
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('welcome');
  const [questions, setQuestions] = useState<Question[]>(DEFAULT_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [selectedStageId, setSelectedStageId] = useState<number | undefined>(undefined);
  const [userCommitment, setUserCommitment] = useState('');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isPdfLoading, setIsPdfLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Load questions from backend using safe relative fetch
  useEffect(() => {
    safeFetchJson('/api/questions')
      .then((res) => {
        if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
          setQuestions(res.data);
        }
      })
      .catch((err) => {
        console.warn('Could not load custom questions, using defaults', err);
      });
  }, []);

  // Filter enabled questions for active survey
  const activeQuestions = questions.filter((q) => q.enabled);

  // Audio toggle
  const handleToggleAudio = () => {
    const playing = ambientAudio.toggle();
    setIsAudioPlaying(playing);
  };

  // Answer handler
  const handleSelectAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Screen navigation
  const handleStart = () => {
    setCurrentScreen('intro');
  };

  const handleIntroNext = () => {
    setCurrentScreen('survey');
    setCurrentQuestionIndex(0);
  };

  const handleSurveyPrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      setCurrentScreen('intro');
    }
  };

  const handleSurveyNext = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setCurrentScreen('supplemental');
    }
  };

  const handleSupplementalPrev = () => {
    setCurrentScreen('survey');
    setCurrentQuestionIndex(activeQuestions.length - 1);
  };

  const handleSupplementalComplete = () => {
    setCurrentScreen('results');
  };

  const handleRetake = () => {
    setAnswers({});
    setSelectedStageId(undefined);
    setUserCommitment('');
    setCurrentQuestionIndex(0);
    setCurrentScreen('welcome');
  };

  // PDF Export with client-side jsPDF download & fallback
  const handleSavePdf = async () => {
    setIsPdfLoading(true);
    try {
      const success = await exportReportToPdf(
        'print-report-container',
        'Bao_Cao_Hanh_Trinh_Uoc_Mo.pdf'
      );
      if (success) {
        setToastMsg('Đã tạo và tải tệp PDF về máy thành công!');
        setTimeout(() => setToastMsg(null), 4000);
      } else {
        window.print();
      }
    } catch (err) {
      console.error(err);
      window.print();
    } finally {
      setIsPdfLoading(false);
    }
  };

  // Admin authentication
  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    setIsSettingsOpen(false);
    setCurrentScreen('admin_dashboard');
    setToastMsg('Đã đăng nhập Quản trị viên thành công');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleAdminLogout = async () => {
    if (adminToken) {
      await safeFetchJson('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
    }
    setAdminToken(null);
    setCurrentScreen('welcome');
    setToastMsg('Đã đăng xuất khỏi tài khoản quản trị');
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveAdminQuestions = async (updated: Question[]) => {
    if (!adminToken) return;
    const res = await safeFetchJson('/api/admin/questions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(updated),
    });
    if (!res.ok) {
      throw new Error(res.message || 'Lỗi khi lưu cấu hình');
    }
    setQuestions(updated);
  };

  const handleRestoreAdminDefaults = async () => {
    if (!adminToken) return;
    const res = await safeFetchJson('/api/admin/reset', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${adminToken}`,
      },
    });
    if (!res.ok) {
      throw new Error(res.message || 'Lỗi khi khôi phục cấu hình');
    }
    setQuestions(DEFAULT_QUESTIONS);
  };

  // Score calculations
  const report = calculateScores(questions, answers);
  const selectedStage = DEFAULT_STAGE_OPTIONS.find((s) => s.id === selectedStageId);

  // If currently in Admin Dashboard
  if (currentScreen === 'admin_dashboard' && adminToken) {
    return (
      <div className="w-screen h-screen flex flex-col font-serif">
        <AdminDashboard
          questions={questions}
          authToken={adminToken}
          onSaveQuestions={handleSaveAdminQuestions}
          onRestoreDefaults={handleRestoreAdminDefaults}
          onLogout={handleAdminLogout}
          onClose={() => setCurrentScreen('welcome')}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative w-screen h-screen overflow-hidden flex flex-col font-serif select-none ${
        currentScreen === 'welcome' ? 'bg-slate-950 bg-cover bg-center bg-no-repeat' : 'bg-[#fbf9f5]'
      }`}
      style={
        currentScreen === 'welcome'
          ? {
              backgroundImage: "url('/br.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }
          : undefined
      }
    >
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-[#0a6962] text-white px-4 py-2.5 rounded-2xl shadow-md border border-[#0a6962]/40 text-xs animate-in fade-in slide-in-from-top duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#fed285] shrink-0" />
          <span className="font-medium">{toastMsg}</span>
          <button
            type="button"
            onClick={() => setToastMsg(null)}
            className="ml-2 text-white/80 hover:text-white cursor-pointer bouncy-tap"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Interactive Top Navigation Bar (Chỉ hiển thị từ trang khảo sát trở đi để ảnh nền Welcome phủ trọn màn hình) */}
      {currentScreen !== 'welcome' && (
        <div className="no-print w-full shrink-0">
          <HeaderBar
            currentScreen={currentScreen}
            questionIndex={currentQuestionIndex + 1}
            totalQuestions={activeQuestions.length}
            isAudioPlaying={isAudioPlaying}
            onToggleAudio={handleToggleAudio}
            aspectMode={aspectMode}
            onToggleAspect={(mode) => setAspectMode(mode)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onSavePdf={currentScreen === 'results' ? handleSavePdf : undefined}
            isPdfLoading={isPdfLoading}
            onGoHome={() => setCurrentScreen('welcome')}
          />
        </div>
      )}

      {/* Main Viewport Container */}
      <main
        className={`no-print flex-1 w-full flex items-center justify-center overflow-hidden ${
          currentScreen === 'welcome' ? 'p-0 h-full w-full' : 'p-2 sm:p-4 md:p-6'
        }`}
      >
        {/* Aspect Ratio Sized Frame */}
        <div
          className={`relative overflow-hidden transition-all duration-300 ease-in-out ${
            currentScreen === 'welcome'
              ? 'w-full h-full'
              : aspectMode === '16:9'
              ? 'bg-[#fdfdfd] rounded-2xl sm:rounded-3xl shadow-md border border-[#0a6962]/15 w-full max-w-[960px] h-[92vh] max-h-[660px]'
              : 'bg-[#fdfdfd] rounded-2xl sm:rounded-3xl shadow-md border border-[#0a6962]/15 w-full max-w-[420px] h-[92vh] max-h-[760px]'
          }`}
        >
          {/* Screen 1: Welcome / Cover */}
          {currentScreen === 'welcome' && (
            <WelcomeScreen
              onStart={handleStart}
              isAudioPlaying={isAudioPlaying}
              onToggleAudio={handleToggleAudio}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}

          {/* Screen 2: Intro */}
          {currentScreen === 'intro' && (
            <IntroScreen
              onBack={() => setCurrentScreen('welcome')}
              onNext={handleIntroNext}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}

          {/* Screen 3: Khung đặt 24 câu hỏi khảo sát */}
          {currentScreen === 'survey' && activeQuestions[currentQuestionIndex] && (
            <SurveyScreen
              question={activeQuestions[currentQuestionIndex]}
              currentIndex={currentQuestionIndex + 1}
              totalQuestions={activeQuestions.length}
              currentAnswer={answers[activeQuestions[currentQuestionIndex].id]}
              onSelectAnswer={handleSelectAnswer}
              onPrev={handleSurveyPrev}
              onNext={handleSurveyNext}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          )}

          {/* Screen 4: Supplemental Non-scored Stage Question */}
          {currentScreen === 'supplemental' && (
            <SupplementalScreen
              stageOptions={DEFAULT_STAGE_OPTIONS}
              selectedStageId={selectedStageId}
              onSelectStage={(id) => setSelectedStageId(id)}
              onPrev={handleSupplementalPrev}
              onComplete={handleSupplementalComplete}
            />
          )}

          {/* Screen 5: Results Report */}
          {currentScreen === 'results' && (
            <ResultScreen
              report={report}
              selectedStage={selectedStage}
              userCommitment={userCommitment}
              onChangeCommitment={setUserCommitment}
              onRetake={handleRetake}
              onSavePdf={handleSavePdf}
              isPdfSaving={isPdfLoading}
            />
          )}
        </div>
      </main>

      {/* Settings & Admin Login Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Dedicated Print Layout */}
      <PrintReport
        report={report}
        selectedStage={selectedStage}
        userCommitment={userCommitment}
      />
    </div>
  );
}
