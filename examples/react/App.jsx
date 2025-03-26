/**
 * Speere React音声認識デモのメインコンポーネント
 */
import React from 'react'
import SpeechRecognizer from './SpeechRecognizer'

function App() {
  return (
    <div className="app-container">
      <div className="feature-section">
        <div className="feature-card">
          <div className="feature-icon">
            <i className="fas fa-microphone"></i>
          </div>
          <h3>音声認識技術</h3>
          <p>
            このデモはブラウザのSpeech Recognitionを利用して
            リアルタイムで音声を認識します。
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <i className="fas fa-code"></i>
          </div>
          <h3>簡単実装</h3>
          <p>
            Speereライブラリを使用することで、簡単にReactで
            音声認識機能を実装できます。
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <i className="fas fa-language"></i>
          </div>
          <h3>日本語対応</h3>
          <p>
            英語だけでなく、日本語での音声認識もサポート。
            自然な会話を認識します。
          </p>
        </div>
      </div>

      <div className="demo-section">
        <h2>音声認識デモ</h2>
        <p className="demo-instruction">
          「認識開始」ボタンをクリックして、マイクに向かって話してみてください。
          音声認識された内容がリアルタイムで表示されます。
        </p>
        <SpeechRecognizer />
      </div>

      <style jsx>{`
        .app-container {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .feature-section {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .feature-card {
          flex: 1;
          min-width: 250px;
          max-width: 300px;
          padding: 1.5rem;
          background-color: var(--card-bg);
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          transition: var(--transition);
          text-align: center;
        }

        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .feature-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: var(--primary-color);
        }

        .feature-card h3 {
          font-size: 1.3rem;
          margin-bottom: 0.8rem;
          color: var(--text-color);
        }

        .feature-card p {
          color: var(--light-text);
          font-size: 0.95rem;
        }

        .demo-section {
          background-color: var(--card-bg);
          border-radius: var(--border-radius);
          padding: 2rem;
          box-shadow: var(--box-shadow);
        }

        .demo-section h2 {
          color: var(--secondary-color);
          text-align: center;
          margin-bottom: 1rem;
        }

        .demo-instruction {
          text-align: center;
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          color: var(--light-text);
        }

        @media (max-width: 768px) {
          .feature-section {
            flex-direction: column;
            align-items: center;
          }

          .feature-card {
            width: 100%;
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default App
