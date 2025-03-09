import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { speech } from './speech'

/**
 * speech関数のテスト
 *
 * このテストでは、speech関数が期待通りのオブジェクトを返すことと、
 * 返されたオブジェクトが必要なメソッドを持つこと、
 * およびイベントハンドラが正しく動作することを確認します。
 */
describe('speech function', () => {
  // モックされたイベントリスナーを保存するオブジェクト
  let eventListeners: Record<string, Array<(...args: any[]) => void>> = {}

  // モックされたSpeechRecognitionインスタンス
  let mockRecognitionInstance: {
    start: ReturnType<typeof vi.fn>
    stop: ReturnType<typeof vi.fn>
    abort: ReturnType<typeof vi.fn>
    addEventListener: ReturnType<typeof vi.fn>
    removeEventListener: ReturnType<typeof vi.fn>
    grammars: SpeechGrammarList | null
    continuous: boolean
    interimResults: boolean
    lang: string
    maxAlternatives: number
  }

  // Web Speech APIのモック
  beforeEach(() => {
    // イベントリスナーをリセット
    eventListeners = {
      result: [],
      start: [],
      end: [],
      error: [],
    }

    // モックインスタンスを作成
    mockRecognitionInstance = {
      start: vi.fn(),
      stop: vi.fn(),
      abort: vi.fn(),
      addEventListener: vi.fn((event, callback) => {
        eventListeners[event].push(callback)
      }),
      removeEventListener: vi.fn((event, callback) => {
        const index = eventListeners[event].indexOf(callback)
        if (index !== -1) {
          eventListeners[event].splice(index, 1)
        }
      }),
      grammars: null,
      continuous: false,
      interimResults: false,
      lang: 'en-US',
      maxAlternatives: 1,
    }

    // SpeechRecognitionコンストラクタをモック
    const mockSpeechRecognition = vi.fn(() => mockRecognitionInstance)

    // windowオブジェクトにSpeechRecognitionをモック
    Object.defineProperty(window, 'SpeechRecognition', {
      value: mockSpeechRecognition,
      writable: true,
    })
  })

  // テスト後のクリーンアップ
  afterEach(() => {
    vi.clearAllMocks()
  })

  it('When calling speech function, it returns an object with required methods', () => {
    // Assert: 期待される結果を定義
    // 返されるオブジェクトには start, stop, abort, dispose メソッドが含まれている必要がある

    // Act: 結果を得るために必要な操作
    const recognition = speech({})

    // Arrange: 操作に必要な準備
    // この場合、特別な準備は必要ない（空のオプションオブジェクトを渡す）

    // 最終的なアサーション
    expect(recognition).toBeDefined()
    expect(typeof recognition).toBe('object')
    expect(typeof recognition.start).toBe('function')
    expect(typeof recognition.stop).toBe('function')
    expect(typeof recognition.abort).toBe('function')
    expect(typeof recognition.dispose).toBe('function')

    // 内部実装の確認
    expect(mockRecognitionInstance.addEventListener).not.toHaveBeenCalled()
  })

  it('When providing options to speech function, it configures recognition with those options', () => {
    // Assert: 期待される結果を定義
    // オプションが正しく設定されたオブジェクトが返される

    // Arrange: 操作に必要な準備
    // オプションオブジェクトを準備
    const mockGrammars = {} as SpeechGrammarList
    const options = {
      grammars: mockGrammars,
      continuous: true,
      interimResults: true,
      lang: 'ja-JP',
      maxAlternatives: 3,
      onResult: vi.fn(),
      onStart: vi.fn(),
      onEnd: vi.fn(),
      onError: vi.fn(),
    }

    // Act: 結果を得るために必要な操作
    const recognition = speech(options)

    // 最終的なアサーション
    expect(recognition).toBeDefined()
    expect(typeof recognition).toBe('object')

    // オプションが正しく設定されていることを確認
    expect(mockRecognitionInstance.grammars).toBe(mockGrammars)
    expect(mockRecognitionInstance.continuous).toBe(true)
    expect(mockRecognitionInstance.interimResults).toBe(true)
    expect(mockRecognitionInstance.lang).toBe('ja-JP')
    expect(mockRecognitionInstance.maxAlternatives).toBe(3)

    // イベントリスナーが正しく登録されていることを確認
    expect(mockRecognitionInstance.addEventListener).toHaveBeenCalledTimes(4)
    expect(mockRecognitionInstance.addEventListener).toHaveBeenCalledWith(
      'result',
      expect.any(Function)
    )
    expect(mockRecognitionInstance.addEventListener).toHaveBeenCalledWith(
      'start',
      options.onStart
    )
    expect(mockRecognitionInstance.addEventListener).toHaveBeenCalledWith(
      'end',
      options.onEnd
    )
    expect(mockRecognitionInstance.addEventListener).toHaveBeenCalledWith(
      'error',
      expect.any(Function)
    )
  })

  it('When calling start method, it starts the recognition', () => {
    // Arrange: 操作に必要な準備
    const recognitionObj = speech({})

    // Act: 結果を得るために必要な操作
    recognitionObj.start()

    // Assert: 期待される結果を確認
    expect(mockRecognitionInstance.start).toHaveBeenCalledTimes(1)
  })

  it('When calling stop method, it stops the recognition', () => {
    // Arrange: 操作に必要な準備
    const recognitionObj = speech({})

    // Act: 結果を得るために必要な操作
    recognitionObj.stop()

    // Assert: 期待される結果を確認
    expect(mockRecognitionInstance.stop).toHaveBeenCalledTimes(1)
  })

  it('When calling abort method, it aborts the recognition', () => {
    // Arrange: 操作に必要な準備
    const recognitionObj = speech({})

    // Act: 結果を得るために必要な操作
    recognitionObj.abort()

    // Assert: 期待される結果を確認
    expect(mockRecognitionInstance.abort).toHaveBeenCalledTimes(1)
  })

  it('When calling dispose method, it aborts recognition and removes event listeners', () => {
    // Arrange: 操作に必要な準備
    const options = {
      onResult: vi.fn(),
      onStart: vi.fn(),
      onEnd: vi.fn(),
      onError: vi.fn(),
    }
    const recognitionObj = speech(options)

    // Act: 結果を得るために必要な操作
    recognitionObj.dispose()

    // Assert: 期待される結果を確認
    expect(mockRecognitionInstance.abort).toHaveBeenCalledTimes(1)

    // 新しい実装では、eventHandlers オブジェクトに保存されたイベントハンドラのみが削除される
    // 実際の実装では、result イベントのハンドラのみが eventHandlers に保存されている
    // error イベントのハンドラはインラインで定義されていて、eventHandlers に保存されていない
    expect(mockRecognitionInstance.removeEventListener).toHaveBeenCalledTimes(1)
    expect(mockRecognitionInstance.removeEventListener).toHaveBeenCalledWith(
      'result',
      expect.any(Function)
    )
  })

  // イベントハンドラのテスト
  describe('Event handlers', () => {
    it('When speech recognition emits a result event, it calls the onResult callback with results and isFinal flag', () => {
      // Arrange: 操作に必要な準備
      const onResultMock = vi.fn()
      const options = {
        onResult: onResultMock,
      }

      // モックされた結果イベントを作成
      const mockResults = [
        { isFinal: false, 0: { transcript: 'こんにちは' } },
      ] as unknown as SpeechRecognitionResultList
      const mockResultEvent = {
        results: mockResults,
      } as SpeechRecognitionEvent

      // Act: 結果を得るために必要な操作
      speech(options) // 認識オブジェクトを作成

      // イベントをシミュレート
      const resultCallback = eventListeners['result'][0]
      resultCallback(mockResultEvent)

      // Assert: 期待される結果を確認
      expect(onResultMock).toHaveBeenCalledWith(mockResults, false)
    })

    it('When speech recognition emits a start event, it calls the onStart callback', () => {
      // Arrange: 操作に必要な準備
      const onStartMock = vi.fn()
      const options = {
        onStart: onStartMock,
      }

      // Act: 結果を得るために必要な操作
      speech(options) // 認識オブジェクトを作成

      // イベントをシミュレート
      const startCallback = eventListeners['start'][0]
      startCallback()

      // Assert: 期待される結果を確認
      expect(onStartMock).toHaveBeenCalledTimes(1)
    })

    it('When speech recognition emits an end event, it calls the onEnd callback', () => {
      // Arrange: 操作に必要な準備
      const onEndMock = vi.fn()
      const options = {
        onEnd: onEndMock,
      }

      // Act: 結果を得るために必要な操作
      speech(options) // 認識オブジェクトを作成

      // イベントをシミュレート
      const endCallback = eventListeners['end'][0]
      endCallback()

      // Assert: 期待される結果を確認
      expect(onEndMock).toHaveBeenCalledTimes(1)
    })

    it('When speech recognition emits an error event, it calls the onError callback with the error', () => {
      // Arrange: 操作に必要な準備
      const onErrorMock = vi.fn()
      const options = {
        onError: onErrorMock,
      }

      // モックされたエラーイベントを作成
      const mockErrorEvent = {
        error: 'no-speech' as SpeechRecognitionErrorCode,
      } as SpeechRecognitionErrorEvent

      // Act: 結果を得るために必要な操作
      speech(options) // 認識オブジェクトを作成

      // イベントをシミュレート
      const errorCallback = eventListeners['error'][0]
      errorCallback(mockErrorEvent)

      // Assert: 期待される結果を確認
      expect(onErrorMock).toHaveBeenCalledWith('no-speech')
    })

    it('When speech recognition emits a final result, the isFinal flag is true', () => {
      // Arrange: 操作に必要な準備
      const onResultMock = vi.fn()
      const options = {
        onResult: onResultMock,
      }

      // モックされた最終結果イベントを作成
      const mockResults = [
        { isFinal: true, 0: { transcript: 'こんにちは' } },
      ] as unknown as SpeechRecognitionResultList
      const mockResultEvent = {
        results: mockResults,
      } as SpeechRecognitionEvent

      // Act: 結果を得るために必要な操作
      speech(options) // 認識オブジェクトを作成

      // イベントをシミュレート
      const resultCallback = eventListeners['result'][0]
      resultCallback(mockResultEvent)

      // Assert: 期待される結果を確認
      expect(onResultMock).toHaveBeenCalledWith(mockResults, true)
    })
  })
})

// TypeScriptの型定義拡張
declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition
  }
}

// ブラウザがSpeechRecognition APIをサポートしていない場合のテスト
describe('Browser compatibility', () => {
  beforeEach(() => {
    // SpeechRecognitionをundefinedに設定
    Object.defineProperty(window, 'SpeechRecognition', {
      value: undefined,
      writable: true,
    })

    // webkitSpeechRecognitionもundefinedに設定
    Object.defineProperty(window, 'webkitSpeechRecognition', {
      value: undefined,
      writable: true,
    })
  })

  it('When browser does not support SpeechRecognition API, it throws an error', () => {
    // Assert: 期待される結果を定義
    // エラーがスローされることを期待

    // Act & Assert: 操作とアサーションを組み合わせる
    expect(() => speech({})).toThrow(
      'Speech Recognition is not supported in this browser'
    )
  })
})
