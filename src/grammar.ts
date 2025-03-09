/**
 * 音声認識のための文法ルールを定義するモジュール
 *
 * このモジュールは、JSGF (Java Speech Grammar Format) 形式の文法ルールを
 * 簡単に作成するためのユーティリティ関数を提供します。
 */

/**
 * 単一の文法ルールを作成する
 *
 * @param ruleName ルールの名前
 * @param alternatives 選択肢の配列
 * @returns JSGF形式のルール文字列
 */
export function rule(ruleName: string, alternatives: string[]): string {
  // 入力検証
  if (!ruleName || ruleName.trim() === '') {
    throw new Error('Rule name cannot be empty')
  }

  if (!alternatives || alternatives.length === 0) {
    throw new Error('Alternatives cannot be empty')
  }

  // JSGF形式のルール文字列を生成
  // 例: #JSGF V1.0 UTF-8 en; public <color> = red | green | blue;
  const alternativesStr = alternatives.join(' | ')
  return `#JSGF V1.0 UTF-8 en; public <${ruleName}> = ${alternativesStr};`
}

/**
 * 複数の文法ルールをセットとして組み合わせる
 *
 * @param rules ルールオブジェクトの配列 { name: string, alternatives: string[] }
 * @returns 複数のルールを含むJSGF文法セット
 */
export function grammarSet(
  rules: { name: string; alternatives: string[] }[]
): string {
  // 入力検証
  if (!rules || rules.length === 0) {
    throw new Error('Rules cannot be empty')
  }

  // ヘッダー部分
  let grammarString = '#JSGF V1.0 UTF-8 en;\n\n'

  // 各ルールを追加
  for (const ruleObj of rules) {
    if (!ruleObj.name || ruleObj.name.trim() === '') {
      throw new Error('Rule name cannot be empty')
    }

    if (!ruleObj.alternatives || ruleObj.alternatives.length === 0) {
      throw new Error('Alternatives cannot be empty')
    }

    const alternativesStr = ruleObj.alternatives.join(' | ')
    grammarString += `public <${ruleObj.name}> = ${alternativesStr};\n`
  }

  return grammarString
}

/**
 * 文法ルールをSpeechGrammarListオブジェクトに変換する
 *
 * @param grammarString JSGF形式の文法文字列
 * @returns SpeechGrammarListオブジェクト
 */
export function createGrammarList(grammarString: string): SpeechGrammarList {
  // SpeechGrammarListの取得
  const SpeechGrammarList =
    window.SpeechGrammarList || (window as any).webkitSpeechGrammarList

  if (!SpeechGrammarList) {
    throw new Error('Speech Grammar List is not supported in this browser')
  }

  // 新しいSpeechGrammarListインスタンスを作成
  const grammarList = new SpeechGrammarList()

  // 文法を追加
  grammarList.addFromString(grammarString, 1)

  return grammarList
}

/**
 * 数字（0から9まで）の文法ルールを作成
 * @returns 数字の文法ルール
 */
export function digits(): string {
  return rule('digits', [
    'zero',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
  ])
}

/**
 * 一般的な色の文法ルールを作成
 * @returns 色の文法ルール
 */
export function colors(): string {
  return rule('colors', [
    'red',
    'green',
    'blue',
    'yellow',
    'orange',
    'purple',
    'black',
    'white',
    'pink',
    'brown',
  ])
}

/**
 * 一般的なコマンドの文法ルールを作成
 * @param customCommands 追加のカスタムコマンド
 * @returns コマンドの文法ルール
 */
export function commands(customCommands: string[] = []): string {
  const defaultCommands = ['start', 'stop', 'pause', 'resume', 'cancel']
  return rule('commands', [...defaultCommands, ...customCommands])
}

/**
 * はい/いいえの応答の文法ルールを作成
 * @returns はい/いいえの文法ルール
 */
export function yesNo(): string {
  return rule('yesNo', ['yes', 'no'])
}

/**
 * 日本語の数字の文法ルールを作成
 * @returns 日本語の数字の文法ルール
 */
export function jaDigits(): string {
  return rule('jaDigits', [
    '零',
    '一',
    '二',
    '三',
    '四',
    '五',
    '六',
    '七',
    '八',
    '九',
  ])
}

/**
 * 日本語の色の文法ルールを作成
 * @returns 日本語の色の文法ルール
 */
export function jaColors(): string {
  return rule('jaColors', [
    '赤',
    '緑',
    '青',
    '黄',
    'オレンジ',
    '紫',
    '黒',
    '白',
    'ピンク',
    '茶色',
  ])
}
