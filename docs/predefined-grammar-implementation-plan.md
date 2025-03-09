# Predefined Grammar Rules 実装計画

## 概要

README に記載されている Predefined Grammar Rules を実装します。これらの関数は、音声認識のための文法ルールを簡単に作成するためのユーティリティ関数です。

## 実装する関数

以下の関数を実装します：

```mermaid
flowchart TD
    A[Predefined Grammar Rules] --> B[digits()]
    A --> C[colors()]
    A --> D[commands()]
    A --> E[yesNo()]
    A --> F[jaDigits()]
    A --> G[jaColors()]
```

1. `digits()` - 数字（0 から 9 まで）
2. `colors()` - 一般的な色
3. `commands(customCommands)` - 一般的なコマンド（拡張可能）
4. `yesNo()` - はい/いいえの応答
5. 日本語版: `jaDigits()`, `jaColors()`

## テスト実装

まず、各関数のテストを実装します。テストは「When {状況}, performing {アクション} results in {結果}」という命名規則と 3A パターン（Arrange, Act, Assert）を使用します。

### テストケース

1. **digits()関数のテスト**

   - 数字（0 から 9 まで）の文法ルールを返すことを確認
   - 返される文法ルールが正しいフォーマットであることを確認
   - 内部で`rule`関数が正しく呼び出されることを確認

2. **colors()関数のテスト**

   - 一般的な色（red, green, blue, yellow, orange, purple, black, white, pink, brown）の文法ルールを返すことを確認
   - 返される文法ルールが正しいフォーマットであることを確認
   - 内部で`rule`関数が正しく呼び出されることを確認

3. **commands()関数のテスト**

   - デフォルトのコマンド（start, stop, pause, resume, cancel）の文法ルールを返すことを確認
   - カスタムコマンドを追加した場合、それらも含まれることを確認
   - 返される文法ルールが正しいフォーマットであることを確認
   - 内部で`rule`関数が正しく呼び出されることを確認

4. **yesNo()関数のテスト**

   - はい/いいえの応答（yes, no）の文法ルールを返すことを確認
   - 返される文法ルールが正しいフォーマットであることを確認
   - 内部で`rule`関数が正しく呼び出されることを確認

5. **jaDigits()関数のテスト**

   - 日本語の数字（零, 一, 二, 三, 四, 五, 六, 七, 八, 九）の文法ルールを返すことを確認
   - 返される文法ルールが正しいフォーマットであることを確認
   - 内部で`rule`関数が正しく呼び出されることを確認

6. **jaColors()関数のテスト**
   - 日本語の色（赤, 緑, 青, 黄, オレンジ, 紫, 黒, 白, ピンク, 茶色）の文法ルールを返すことを確認
   - 返される文法ルールが正しいフォーマットであることを確認
   - 内部で`rule`関数が正しく呼び出されることを確認

## 実装

次に、テストに対応する実装を行います。各関数は内部で`rule`関数を使用して実装します。

### 実装内容

1. **digits()関数**

   ```typescript
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
   ```

2. **colors()関数**

   ```typescript
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
   ```

3. **commands()関数**

   ```typescript
   /**
    * 一般的なコマンドの文法ルールを作成
    * @param customCommands 追加のカスタムコマンド
    * @returns コマンドの文法ルール
    */
   export function commands(customCommands: string[] = []): string {
     const defaultCommands = ['start', 'stop', 'pause', 'resume', 'cancel']
     return rule('commands', [...defaultCommands, ...customCommands])
   }
   ```

4. **yesNo()関数**

   ```typescript
   /**
    * はい/いいえの応答の文法ルールを作成
    * @returns はい/いいえの文法ルール
    */
   export function yesNo(): string {
     return rule('yesNo', ['yes', 'no'])
   }
   ```

5. **jaDigits()関数**

   ```typescript
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
   ```

6. **jaColors()関数**
   ```typescript
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
   ```

## 使用例

これらの関数は、`grammarSet`関数と組み合わせて使用します。

```typescript
import { speech } from 'speere'
import { commands, colors, grammarSet } from 'speere/grammar'

// 定義済みルールで文法セットを作成
const myGrammar = grammarSet([
  commands(['開く', '閉じる']), // カスタムコマンド
  colors(), // 定義済みの色
])

// 音声認識を初期化
const recognition = speech({
  grammar: myGrammar,
  continuous: true,
  onResult: (result, isFinal) => {
    if (isFinal) {
      console.log('最終結果:', result[0].transcript)
    }
  },
})
```

## エクスポート

最後に、これらの関数をエクスポートして、README に記載されているように使用できるようにします。

```typescript
// grammar.ts
export {
  rule,
  grammarSet,
  createGrammarList,
  digits,
  colors,
  commands,
  yesNo,
  jaDigits,
  jaColors,
}
```

## インデックスファイルの更新

src/index.ts ファイルを更新して、これらの関数をエクスポートします。

```typescript
// index.ts
export { speech } from './speech'
export {
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
```

## 実装手順

1. まずテストファイル（src/grammar.test.ts）に新しいテストケースを追加
2. テストを実行して、期待通り失敗することを確認
3. 実装ファイル（src/grammar.ts）に新しい関数を追加
4. テストを再実行して、成功することを確認
5. インデックスファイル（src/index.ts）を更新
