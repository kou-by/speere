/**
 * 音声認識を行うReactコンポーネント
 */
import { useState, useEffect, useRef } from 'react'
import { speech } from '../../src/speech'

function SpeechRecognizer() {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [confidence, setConfidence] = useState(0)
  const [animationState, setAnimationState] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const recognitionRef = useRef(null)
  const processedResultsRef = useRef(new Set()) // 処理済みの結果を記録するためのSet

  useEffect(() => {
    if (!recognitionRef.current) {
      try {
        // 音声コマンド用の文法を作成
        // const voiceGrammarString = grammarSet([
        //   { name: 'commands', alternatives: ['start', 'stop', 'clear'] },
        // ])
        // 文法文字列をSpeechGrammarListオブジェクトに変換
        // const voiceGrammar = createGrammarList(voiceGrammarString)
        recognitionRef.current = speech({
          // grammars: voiceGrammar,
          lang: 'ja-JP', // 日本語を使用
          continuous: true,
          interimResults: true,
          onResult: (results, isFinal) => {
            console.log('results', results)
            if (results && results.length > 0) {
              // 音声認識中のアニメーション状態を設定
              setAnimationState('active')

              // 最高の信頼度を取得
              if (results[0][0] && results[0][0].confidence) {
                setConfidence(results[0][0].confidence)
              }

              if (isFinal) {
                // 認識結果のすべての項目を処理
                for (let i = 0; i < results.length; i++) {
                  const resultItem = results[i]
                  if (resultItem.isFinal) {
                    const newTranscript = resultItem[0].transcript
                    const resultId = `${i}-${newTranscript}` // 結果を一意に識別するためのID
                    // まだ処理していない結果のみを追加
                    if (!processedResultsRef.current.has(resultId)) {
                      processedResultsRef.current.add(resultId)
                      setTranscript((prev) => prev + newTranscript + ' ')
                    }
                  }
                }
              }
            } else {
              // 音声認識結果がない場合は待機状態に
              setAnimationState('idle')
            }
          },
          onStart: () => {
            setIsListening(true)
            setAnimationState('active')
            setErrorMessage('')
            // 認識開始時に処理済み結果リストをクリア
            processedResultsRef.current.clear()
          },
          onEnd: () => {
            // 認識が終了しても、isListeningがtrueの場合（ユーザーがまだ認識を続けたい場合）は再開
            if (isListening) {
              setTimeout(() => {
                try {
                  if (recognitionRef.current && isListening) {
                    recognitionRef.current.start()
                  }
                } catch (e) {
                  console.error('再起動に失敗しました:', e)
                  setIsListening(false)
                  setAnimationState('error')
                  setErrorMessage(
                    '音声認識の再開に失敗しました。もう一度試してください。'
                  )
                }
              }, 300)
            } else {
              setAnimationState('idle')
            }
          },
          onError: (error) => {
            console.error('音声認識エラー:', error)

            // no-speechエラーの場合は再起動を試みる
            if (error === 'no-speech') {
              setErrorMessage('無音状態が検出されました。話し続けてください。')
              setAnimationState('warning')

              // 一時的に待機状態として、300ms後に再開
              setTimeout(() => {
                if (isListening && recognitionRef.current) {
                  try {
                    recognitionRef.current.start()
                    setAnimationState('active')
                    setErrorMessage('')
                  } catch (e) {
                    console.error('再起動に失敗しました:', e)
                  }
                }
              }, 300)
            } else {
              // その他のエラーはユーザーに通知
              setIsListening(false)
              setAnimationState('error')

              switch (error) {
                case 'network':
                  setErrorMessage('ネットワークエラーが発生しました。')
                  break
                case 'not-allowed':
                  setErrorMessage('マイクの使用許可がありません。')
                  break
                case 'aborted':
                  setErrorMessage('音声認識が中断されました。')
                  break
                default:
                  setErrorMessage('音声認識エラーが発生しました。')
              }

              // エラー状態を3秒後にリセット
              setTimeout(() => {
                setAnimationState('idle')
              }, 3000)
            }
          },
        })
      } catch (error) {
        console.error('音声認識の初期化に失敗しました:', error)
        setErrorMessage(
          '音声認識機能を初期化できませんでした。ブラウザの互換性を確認してください。'
        )
      }
    }
  }, [isListening])

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false)
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    } else {
      setIsListening(true)
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start()
        } catch (e) {
          console.error('認識開始に失敗しました:', e)
          setErrorMessage('音声認識を開始できませんでした。')
          setIsListening(false)
        }
      }
    }
  }

  const clearTranscript = () => {
    setTranscript('')
  }

  // 信頼度に基づく色を計算
  const getConfidenceColor = () => {
    if (confidence < 0.4) return 'var(--secondary-color)'
    if (confidence < 0.7) return '#f9c74f'
    return '#43aa8b'
  }

  return (
    <div className="speech-recognizer">
      <div className={`visual-indicator ${animationState}`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="bar"
            style={{
              animationDelay: `${i * 0.1}s`,
              backgroundColor: isListening
                ? getConfidenceColor()
                : 'var(--light-text)',
            }}
          ></div>
        ))}
      </div>

      <div className={`transcript-container ${isListening ? 'listening' : ''}`}>
        <div className="transcript-box">
          {transcript ? (
            <p>{transcript}</p>
          ) : (
            <p className="placeholder">
              音声が認識されるとここに表示されます...
            </p>
          )}
        </div>

        <div
          className="confidence-meter"
          style={{ opacity: isListening ? 1 : 0 }}
        >
          <div className="confidence-label">
            認識精度: {Math.round(confidence * 100)}%
          </div>
          <div className="confidence-bar-container">
            <div
              className="confidence-bar"
              style={{
                width: `${confidence * 100}%`,
                backgroundColor: getConfidenceColor(),
              }}
            ></div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="error-message">
          <i className="fas fa-exclamation-triangle"></i> {errorMessage}
        </div>
      )}

      <div className="button-group">
        <button
          className={`control-button ${isListening ? 'listening' : ''}`}
          onClick={toggleListening}
        >
          <i className={`fas ${isListening ? 'fa-stop' : 'fa-microphone'}`}></i>
          {isListening ? '認識停止' : '認識開始'}
        </button>

        {transcript && (
          <button className="clear-button" onClick={clearTranscript}>
            <i className="fas fa-trash-alt"></i>
            クリア
          </button>
        )}
      </div>

      <style jsx>{`
        .speech-recognizer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .visual-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          height: 60px;
          width: 100%;
          max-width: 400px;
        }

        .bar {
          width: 6px;
          height: 20px;
          background-color: var(--light-text);
          border-radius: 3px;
          transition: height 0.3s ease;
        }

        .visual-indicator.active .bar {
          animation: soundBars 1.2s ease-in-out infinite;
        }

        .visual-indicator.error .bar {
          animation: errorPulse 1.5s ease-in-out infinite;
          background-color: var(--secondary-color);
        }

        .visual-indicator.warning .bar {
          animation: warningPulse 1.2s ease-in-out infinite;
          background-color: #f9c74f;
        }

        @keyframes soundBars {
          0%,
          100% {
            height: 20px;
          }
          50% {
            height: 45px;
          }
        }

        @keyframes errorPulse {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes warningPulse {
          0%,
          100% {
            height: 20px;
            opacity: 0.7;
          }
          50% {
            height: 35px;
            opacity: 1;
          }
        }

        .transcript-container {
          width: 100%;
          transition: var(--transition);
          transform-origin: center top;
        }

        .transcript-container.listening {
          transform: scale(1.02);
        }

        .transcript-box {
          width: 100%;
          min-height: 150px;
          max-height: 300px;
          overflow-y: auto;
          padding: 1.5rem;
          background-color: var(--background-color);
          border-radius: var(--border-radius);
          border: 2px solid transparent;
          transition: var(--transition);
          box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .transcript-container.listening .transcript-box {
          border-color: var(--primary-color);
        }

        .transcript-box p {
          margin: 0;
          line-height: 1.8;
        }

        .placeholder {
          color: var(--light-text);
          text-align: center;
          font-style: italic;
        }

        .confidence-meter {
          margin-top: 0.8rem;
          width: 100%;
          transition: opacity 0.3s ease;
        }

        .confidence-label {
          font-size: 0.9rem;
          margin-bottom: 0.3rem;
          text-align: right;
          color: var(--light-text);
        }

        .confidence-bar-container {
          width: 100%;
          height: 6px;
          background-color: #eee;
          border-radius: 3px;
          overflow: hidden;
        }

        .confidence-bar {
          height: 100%;
          transition: width 0.3s ease, background-color 0.3s ease;
        }

        .error-message {
          width: 100%;
          padding: 0.8rem;
          background-color: rgba(247, 37, 133, 0.1);
          border-left: 4px solid var(--secondary-color);
          border-radius: 4px;
          color: var(--text-color);
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          animation: fadeIn 0.3s ease-in-out;
        }

        .error-message i {
          color: var(--secondary-color);
        }

        .button-group {
          display: flex;
          gap: 1rem;
          margin-top: 0.5rem;
        }

        .control-button,
        .clear-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.8rem 1.5rem;
          border: none;
          border-radius: var(--border-radius);
          font-weight: 500;
          cursor: pointer;
          transition: var(--transition);
          font-size: 1rem;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .control-button {
          background-color: var(--primary-color);
          color: white;
        }

        .control-button:hover {
          background-color: var(--primary-hover);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .control-button.listening {
          background-color: var(--secondary-color);
          animation: pulsate 2s infinite;
        }

        @keyframes pulsate {
          0%,
          100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .clear-button {
          background-color: var(--background-color);
          color: var(--text-color);
        }

        .clear-button:hover {
          background-color: #e9ecef;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .button-group {
            flex-direction: column;
            width: 100%;
          }

          .control-button,
          .clear-button {
            width: 100%;
            justify-content: center;
          }

          .visual-indicator {
            height: 40px;
            max-width: 300px;
          }

          .bar {
            width: 4px;
          }
        }
      `}</style>
    </div>
  )
}

export default SpeechRecognizer
