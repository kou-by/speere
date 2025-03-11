/**
 * Speere 音声認識デモのメインエントリーポイント
 */

// スタイルシートの読み込み
import './style.css';

// Speereライブラリの読み込み
// Viteでは相対パスが異なる扱いになるため、絶対パスを使用
import * as Speere from '../../dist/index';

// DOMが読み込まれたら実行
document.addEventListener('DOMContentLoaded', () => {
  // 要素の取得
  const startButton = document.getElementById('start-recognition');
  const resultText = document.getElementById('result-text');
  const grammarSelect = document.getElementById('grammar-select');
  const statusElement = document.getElementById('status');

  // ライブラリからの関数を取得
  const { speech, createGrammarList, colors, digits, commands, jaColors, jaDigits } = Speere;

  // 音声認識インスタンス
  let recognizer = null;
  let isListening = false;

  // 文法ルールを取得する関数
  function getSelectedGrammar() {
    const selected = grammarSelect.value;

    if (selected === 'none') {
      return null;
    }

    let grammarRule;
    switch (selected) {
      case 'colors':
        grammarRule = colors();
        break;
      case 'digits':
        grammarRule = digits();
        break;
      case 'commands':
        grammarRule = commands();
        break;
      case 'jaColors':
        grammarRule = jaColors();
        break;
      case 'jaDigits':
        grammarRule = jaDigits();
        break;
      default:
        return null;
    }

    try {
      return createGrammarList(grammarRule);
    } catch (error) {
      console.error('文法ルールの作成に失敗しました:', error);
      return null;
    }
  }

  // 音声認識の開始
  function startRecognition() {
    if (isListening) {
      return;
    }

    // 以前のインスタンスがあれば破棄
    if (recognizer) {
      recognizer.dispose();
    }

    // 選択された文法ルールを取得
    const grammarList = getSelectedGrammar();

    // ステータス更新
    statusElement.textContent = '音声認識を開始しています...';
    statusElement.className = 'status waiting';

    try {
      // 音声認識インスタンスの作成
      recognizer = speech({
        grammars: grammarList,
        lang: 'ja-JP', // 日本語を使用
        continuous: false, // 一度の認識で終了
        interimResults: true, // 中間結果も表示

        // 認識開始時のコールバック
        onStart: () => {
          isListening = true;
          startButton.querySelector('.icon').textContent = '⏹️';
          startButton.textContent = '停止';
          statusElement.textContent = '聞いています...';
          statusElement.className = 'status listening';
        },

        // 認識結果のコールバック
        onResult: (results, isFinal) => {
          // 最も確からしい結果を取得
          const transcript = results[0][0].transcript;

          // テキストエリアに表示
          resultText.value = transcript;

          // 最終結果の場合
          if (isFinal) {
            statusElement.textContent = '認識完了';
            statusElement.className = 'status ready';

            // 自動的に認識を停止
            setTimeout(() => {
              if (recognizer) {
                recognizer.stop();
              }
            }, 1000);
          }
        },

        // 認識終了時のコールバック
        onEnd: () => {
          isListening = false;
          startButton.textContent = '音声認識開始';
          startButton.querySelector('.icon').textContent = '🎤';
          statusElement.textContent = '待機中...';
          statusElement.className = 'status';
        },

        // エラー時のコールバック
        onError: (error) => {
          console.error('音声認識エラー:', error);
          statusElement.textContent = `エラー: ${error}`;
          statusElement.className = 'status';

          isListening = false;
          startButton.textContent = '音声認識開始';
          startButton.querySelector('.icon').textContent = '🎤';
        }
      });

      // 認識開始
      recognizer.start();

    } catch (error) {
      console.error('音声認識の初期化に失敗しました:', error);
      statusElement.textContent = `初期化エラー: ${error.message}`;
      statusElement.className = 'status';
    }
  }

  // 音声認識の停止
  function stopRecognition() {
    if (recognizer && isListening) {
      recognizer.stop();
    }
  }

  // ボタンクリックイベント
  startButton.addEventListener('click', () => {
    if (isListening) {
      stopRecognition();
    } else {
      startRecognition();
    }
  });

  // 文法選択変更イベント
  grammarSelect.addEventListener('change', () => {
    // 認識中なら一度停止
    if (isListening) {
      stopRecognition();
    }
  });

  // ブラウザがSpeech Recognition APIをサポートしているか確認
  try {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      throw new Error('このブラウザは音声認識をサポートしていません');
    }

    statusElement.textContent = '準備完了';
    statusElement.className = 'status ready';
  } catch (error) {
    console.error(error);
    statusElement.textContent = error.message;
    startButton.disabled = true;
  }
});