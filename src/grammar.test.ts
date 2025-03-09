import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
  rule,
  grammarSet,
  createGrammarList,
  digits,
  colors,
  commands,
  yesNo,
  jaDigits,
  jaColors,
} from './grammar'

/**
 * Grammar モジュールのテスト
 *
 * このテストでは、Grammar モジュールの各関数が期待通りの動作をすることを確認します。
 * 特に、rule() 関数が正しいJSGF文字列を生成すること、
 * grammarSet() 関数が複数のルールを正しく組み合わせることをテストします。
 */
describe('Grammar module', () => {
  // SpeechGrammarListのモック
  beforeEach(() => {
    // windowオブジェクトにSpeechGrammarListをモック
    Object.defineProperty(window, 'SpeechGrammarList', {
      value: vi.fn(() => ({
        addFromString: vi.fn(),
      })),
      writable: true,
    })
  })

  describe('rule function', () => {
    it('When providing a rule name and alternatives, it generates a correct JSGF string', () => {
      // Assert: 期待される結果を定義
      const expectedJSGF =
        '#JSGF V1.0 UTF-8 en; public <color> = red | green | blue;'

      // Act: 結果を得るために必要な操作
      const result = rule('color', ['red', 'green', 'blue'])

      // Arrange: 操作に必要な準備
      // この場合、特別な準備は必要ない

      // 最終的なアサーション
      expect(result).toBe(expectedJSGF)
    })

    it('When providing an empty rule name, it throws an error', () => {
      // Assert: 期待される結果を定義
      // エラーがスローされることを期待

      // Act & Assert: 操作とアサーションを組み合わせる
      expect(() => rule('', ['red', 'green', 'blue'])).toThrow(
        'Rule name cannot be empty'
      )
    })

    it('When providing empty alternatives, it throws an error', () => {
      // Assert: 期待される結果を定義
      // エラーがスローされることを期待

      // Act & Assert: 操作とアサーションを組み合わせる
      expect(() => rule('color', [])).toThrow('Alternatives cannot be empty')
    })
  })

  describe('grammarSet function', () => {
    it('When providing multiple rules, it combines them correctly into a grammar set', () => {
      // Assert: 期待される結果を定義
      const expectedGrammarSet = `#JSGF V1.0 UTF-8 en;

public <color> = red | green | blue;
public <animal> = dog | cat | bird;
`

      // Act: 結果を得るために必要な操作
      const result = grammarSet([
        { name: 'color', alternatives: ['red', 'green', 'blue'] },
        { name: 'animal', alternatives: ['dog', 'cat', 'bird'] },
      ])

      // Arrange: 操作に必要な準備
      // この場合、特別な準備は必要ない

      // 最終的なアサーション
      expect(result).toBe(expectedGrammarSet)
    })

    it('When providing an empty rules array, it throws an error', () => {
      // Assert: 期待される結果を定義
      // エラーがスローされることを期待

      // Act & Assert: 操作とアサーションを組み合わせる
      expect(() => grammarSet([])).toThrow('Rules cannot be empty')
    })

    it('When providing a rule with an empty name, it throws an error', () => {
      // Assert: 期待される結果を定義
      // エラーがスローされることを期待

      // Act & Assert: 操作とアサーションを組み合わせる
      expect(() =>
        grammarSet([{ name: '', alternatives: ['red', 'green', 'blue'] }])
      ).toThrow('Rule name cannot be empty')
    })

    it('When providing a rule with empty alternatives, it throws an error', () => {
      // Assert: 期待される結果を定義
      // エラーがスローされることを期待

      // Act & Assert: 操作とアサーションを組み合わせる
      expect(() => grammarSet([{ name: 'color', alternatives: [] }])).toThrow(
        'Alternatives cannot be empty'
      )
    })
  })

  describe('createGrammarList function', () => {
    it('When providing a grammar string, it creates a SpeechGrammarList with that grammar', () => {
      // Assert: 期待される結果を定義
      // SpeechGrammarListが作成され、addFromStringが呼ばれることを期待

      // Act: 結果を得るために必要な操作
      const grammarString =
        '#JSGF V1.0 UTF-8 en; public <color> = red | green | blue;'
      const result = createGrammarList(grammarString)

      // Arrange: 操作に必要な準備
      // モックは beforeEach で設定済み

      // 最終的なアサーション
      expect(result).toBeDefined()
      expect(result.addFromString).toHaveBeenCalledWith(grammarString, 1)
    })
  })
})

// Predefined Grammar Rulesのテスト
describe('Predefined Grammar Rules', () => {
  describe('digits function', () => {
    it('When calling digits function, it returns a grammar rule for digits', () => {
      // Assert: 期待される結果を定義
      const expectedRule =
        '#JSGF V1.0 UTF-8 en; public <digits> = zero | one | two | three | four | five | six | seven | eight | nine;'

      // Act: 結果を得るために必要な操作
      const result = digits()

      // 最終的なアサーション
      expect(result).toBe(expectedRule)
    })
  })

  describe('colors function', () => {
    it('When calling colors function, it returns a grammar rule for colors', () => {
      // Assert: 期待される結果を定義
      const expectedRule =
        '#JSGF V1.0 UTF-8 en; public <colors> = red | green | blue | yellow | orange | purple | black | white | pink | brown;'

      // Act: 結果を得るために必要な操作
      const result = colors()

      // 最終的なアサーション
      expect(result).toBe(expectedRule)
    })
  })

  describe('commands function', () => {
    it('When calling commands function without custom commands, it returns a grammar rule for default commands', () => {
      // Assert: 期待される結果を定義
      const expectedRule =
        '#JSGF V1.0 UTF-8 en; public <commands> = start | stop | pause | resume | cancel;'

      // Act: 結果を得るために必要な操作
      const result = commands()

      // 最終的なアサーション
      expect(result).toBe(expectedRule)
    })

    it('When calling commands function with custom commands, it returns a grammar rule including those commands', () => {
      // Assert: 期待される結果を定義
      const expectedRule =
        '#JSGF V1.0 UTF-8 en; public <commands> = start | stop | pause | resume | cancel | open | close;'

      // Act: 結果を得るために必要な操作
      const result = commands(['open', 'close'])

      // 最終的なアサーション
      expect(result).toBe(expectedRule)
    })
  })

  describe('yesNo function', () => {
    it('When calling yesNo function, it returns a grammar rule for yes/no responses', () => {
      // Assert: 期待される結果を定義
      const expectedRule = '#JSGF V1.0 UTF-8 en; public <yesNo> = yes | no;'

      // Act: 結果を得るために必要な操作
      const result = yesNo()

      // 最終的なアサーション
      expect(result).toBe(expectedRule)
    })
  })

  describe('jaDigits function', () => {
    it('When calling jaDigits function, it returns a grammar rule for Japanese digits', () => {
      // Assert: 期待される結果を定義
      const expectedRule =
        '#JSGF V1.0 UTF-8 en; public <jaDigits> = 零 | 一 | 二 | 三 | 四 | 五 | 六 | 七 | 八 | 九;'

      // Act: 結果を得るために必要な操作
      const result = jaDigits()

      // 最終的なアサーション
      expect(result).toBe(expectedRule)
    })
  })

  describe('jaColors function', () => {
    it('When calling jaColors function, it returns a grammar rule for Japanese colors', () => {
      // Assert: 期待される結果を定義
      const expectedRule =
        '#JSGF V1.0 UTF-8 en; public <jaColors> = 赤 | 緑 | 青 | 黄 | オレンジ | 紫 | 黒 | 白 | ピンク | 茶色;'

      // Act: 結果を得るために必要な操作
      const result = jaColors()

      // 最終的なアサーション
      expect(result).toBe(expectedRule)
    })
  })
})
