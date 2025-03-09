import { describe, it, expect, vi, beforeEach } from 'vitest';
import { rule, grammarSet, createGrammarList } from './grammar';

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
        addFromString: vi.fn()
      })),
      writable: true
    });
  });

  describe('rule function', () => {
    it('When providing a rule name and alternatives, it generates a correct JSGF string', () => {
      // Assert: 期待される結果を定義
      const expectedJSGF = '#JSGF V1.0 UTF-8 en; public <color> = red | green | blue;';
      
      // Act: 結果を得るために必要な操作
      const result = rule('color', ['red', 'green', 'blue']);
      
      // Arrange: 操作に必要な準備
      // この場合、特別な準備は必要ない
      
      // 最終的なアサーション
      expect(result).toBe(expectedJSGF);
    });

    it('When providing an empty rule name, it throws an error', () => {
      // Assert: 期待される結果を定義
      // エラーがスローされることを期待
      
      // Act & Assert: 操作とアサーションを組み合わせる
      expect(() => rule('', ['red', 'green', 'blue'])).toThrow('Rule name cannot be empty');
    });

    it('When providing empty alternatives, it throws an error', () => {
      // Assert: 期待される結果を定義
      // エラーがスローされることを期待
      
      // Act & Assert: 操作とアサーションを組み合わせる
      expect(() => rule('color', [])).toThrow('Alternatives cannot be empty');
    });
  });

  describe('grammarSet function', () => {
    it('When providing multiple rules, it combines them correctly into a grammar set', () => {
      // Assert: 期待される結果を定義
      const expectedGrammarSet = 
`#JSGF V1.0 UTF-8 en;

public <color> = red | green | blue;
public <animal> = dog | cat | bird;
`;
      
      // Act: 結果を得るために必要な操作
      const result = grammarSet([
        { name: 'color', alternatives: ['red', 'green', 'blue'] },
        { name: 'animal', alternatives: ['dog', 'cat', 'bird'] }
      ]);
      
      // Arrange: 操作に必要な準備
      // この場合、特別な準備は必要ない
      
      // 最終的なアサーション
      expect(result).toBe(expectedGrammarSet);
    });

    it('When providing an empty rules array, it throws an error', () => {
      // Assert: 期待される結果を定義
      // エラーがスローされることを期待
      
      // Act & Assert: 操作とアサーションを組み合わせる
      expect(() => grammarSet([])).toThrow('Rules cannot be empty');
    });

    it('When providing a rule with an empty name, it throws an error', () => {
      // Assert: 期待される結果を定義
      // エラーがスローされることを期待
      
      // Act & Assert: 操作とアサーションを組み合わせる
      expect(() => grammarSet([
        { name: '', alternatives: ['red', 'green', 'blue'] }
      ])).toThrow('Rule name cannot be empty');
    });

    it('When providing a rule with empty alternatives, it throws an error', () => {
      // Assert: 期待される結果を定義
      // エラーがスローされることを期待
      
      // Act & Assert: 操作とアサーションを組み合わせる
      expect(() => grammarSet([
        { name: 'color', alternatives: [] }
      ])).toThrow('Alternatives cannot be empty');
    });
  });

  describe('createGrammarList function', () => {
    it('When providing a grammar string, it creates a SpeechGrammarList with that grammar', () => {
      // Assert: 期待される結果を定義
      // SpeechGrammarListが作成され、addFromStringが呼ばれることを期待
      
      // Act: 結果を得るために必要な操作
      const grammarString = '#JSGF V1.0 UTF-8 en; public <color> = red | green | blue;';
      const result = createGrammarList(grammarString);
      
      // Arrange: 操作に必要な準備
      // モックは beforeEach で設定済み
      
      // 最終的なアサーション
      expect(result).toBeDefined();
      expect(result.addFromString).toHaveBeenCalledWith(grammarString, 1);
    });
  });
});