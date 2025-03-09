/**
 * Web Speech Recognition API のラッパー関数
 * 
 * このモジュールは、ブラウザのWeb Speech APIを使いやすくラップします。
 * フレームワークに依存せず、どのJavaScriptプロジェクトでも使用可能です。
 */

/**
 * speech関数のオプションインターフェース
 */
export interface SpeechOptions {
  /**
   * 文法ルール
   */
  grammar?: any;
  
  /**
   * 継続的に認識するかどうか
   * @default false
   */
  continuous?: boolean;
  
  /**
   * 中間結果を返すかどうか
   * @default false
   */
  interimResults?: boolean;
  
  /**
   * 認識言語
   * @default ブラウザの言語
   */
  lang?: string;
  
  /**
   * 代替認識の最大数
   * @default 1
   */
  maxAlternatives?: number;
  
  /**
   * 結果のコールバック
   */
  onResult?: (result: any, isFinal: boolean) => void;
  
  /**
   * 認識開始時のコールバック
   */
  onStart?: () => void;
  
  /**
   * 認識終了時のコールバック
   */
  onEnd?: () => void;
  
  /**
   * エラー時のコールバック
   */
  onError?: (error: any) => void;
}

/**
 * 音声認識を初期化するメイン関数
 * 
 * @param options 構成オプション
 * @returns 音声認識を制御するメソッドを持つオブジェクト
 */
export function speech(options: SpeechOptions = {}) {
  // SpeechRecognition APIの取得
  const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
  
  if (!SpeechRecognition) {
    throw new Error('Speech Recognition is not supported in this browser');
  }
  
  // 認識インスタンスの作成
  const recognition = new SpeechRecognition();
  
  // オプションの設定
  if (options.grammar) {
    recognition.grammars = options.grammar;
  }
  
  recognition.continuous = options.continuous ?? false;
  recognition.interimResults = options.interimResults ?? false;
  recognition.lang = options.lang ?? navigator.language;
  recognition.maxAlternatives = options.maxAlternatives ?? 1;
  
  // イベントリスナーの設定
  if (options.onResult) {
    recognition.addEventListener('result', (event: any) => {
      const results = event.results;
      const isFinal = results[results.length - 1].isFinal;
      options.onResult?.(results, isFinal);
    });
  }
  
  if (options.onStart) {
    recognition.addEventListener('start', options.onStart);
  }
  
  if (options.onEnd) {
    recognition.addEventListener('end', options.onEnd);
  }
  
  if (options.onError) {
    recognition.addEventListener('error', (event: any) => {
      options.onError?.(event.error);
    });
  }
  
  // 制御メソッドを持つオブジェクトを返す
  return {
    /**
     * 音声認識を開始
     */
    start: () => {
      recognition.start();
    },
    
    /**
     * 音声認識を停止
     */
    stop: () => {
      recognition.stop();
    },
    
    /**
     * 音声認識を即座に中断
     */
    abort: () => {
      recognition.abort();
    },
    
    /**
     * リソースをクリーンアップ
     */
    dispose: () => {
      recognition.abort();
      // イベントリスナーの削除
      if (options.onResult) {
        recognition.removeEventListener('result', options.onResult as any);
      }
      if (options.onStart) {
        recognition.removeEventListener('start', options.onStart);
      }
      if (options.onEnd) {
        recognition.removeEventListener('end', options.onEnd);
      }
      if (options.onError) {
        recognition.removeEventListener('error', options.onError as any);
      }
    }
  };
}

// TypeScriptの型定義拡張
declare global {
  interface Window {
    SpeechRecognition?: any;
    webkitSpeechRecognition?: any;
  }
}