# Speere

A Framework-agnostic Web Speech Recognition API wrapper.

[![CI](https://github.com/kou-by/speere/actions/workflows/ci.yml/badge.svg)](https://github.com/kou-by/speere/actions/workflows/ci.yml)

```
         _
        / \
       /   \
      /     \___
     /          \_____
    /                 \___
   /                      \______
  /                              \__
 /                                  \____
/=========================================>
```

## English Documentation

### Overview

Speere is a minimalist library that provides a simple interface to the Web Speech API's speech recognition capabilities. It offers a framework-agnostic approach that works seamlessly with vanilla JavaScript or any frontend framework (React, Vue, Svelte, etc.).

### Installation

```bash
npm install speere
```

### Basic Usage

```javascript
import { speech } from 'speere'
import { rule, grammarSet } from 'speere/grammar'

// Create grammar set with custom rules
const myGrammar = grammarSet([
  {
    name: 'commands',
    alternatives: [
      'start',
      'stop',
      'pause',
      'resume',
      'cancel',
      'open',
      'close',
    ],
  },
  {
    name: 'colors',
    alternatives: [
      'red',
      'green',
      'blue',
      'yellow',
      'orange',
      'purple',
      'black',
      'white',
    ],
  },
])

// Initialize speech recognition
const recognition = speech({
  grammar: myGrammar,
  continuous: true,
  onResult: (result, isFinal) => {
    if (isFinal) {
      console.log('Final result:', result[0].transcript)
    }
  },
})

// Start recognition
recognition.start()

// Later, stop recognition
recognition.stop()

// When you're done, clean up
recognition.dispose()
```

### API Reference

#### `speech(options)`

The main function to initialize speech recognition.

**Parameters:**

- `options`: Object - Configuration options

**Options:**

- `grammars`: GrammarSet | SpeechGrammarList - Grammar rules for recognition
- `continuous`: boolean - Whether to continuously recognize (default: false)
- `interimResults`: boolean - Whether to return interim results (default: false)
- `lang`: string - Language for recognition (default: browser's language)
- `maxAlternatives`: number - Maximum number of alternative recognitions (default: 1)
- `onResult`: (result: SpeechRecognitionResult, isFinal: boolean) => void - Callback for results
- `onStart`: () => void - Callback when recognition starts
- `onEnd`: () => void - Callback when recognition ends
- `onError`: (error: SpeechRecognitionError) => void - Callback for errors

**Returns:**
An object with the following methods:

- `start()`: Start speech recognition
- `stop()`: Stop speech recognition
- `abort()`: Abort speech recognition immediately
- `dispose()`: Clean up resources

### Grammar Module

Speere provides a separate grammar module to make working with SpeechGrammarList easier.

```javascript
import { rule, grammarSet } from 'speere/grammar'
```

#### `rule(name, items, options)`

Creates a single grammar rule.

**Parameters:**

- `name`: string - The name of the rule
- `items`: string[] | string - An array of possible values or a string with alternatives
- `options`: Object - Configuration options
  - `isPublic`: boolean - Whether the rule is public (default: true)
  - `weight`: number - Weight for this grammar (0-1) (default: 1.0)

**Returns:**
A rule object that can be added to a grammar set

#### `grammarSet(rules)`

Creates a collection of grammar rules.

**Parameters:**

- `rules`: Rule[] - Array of rule objects

**Returns:**
A grammar set object that can be passed to the speech function

### Examples

#### Vanilla JavaScript with Grammar

```javascript
import { speech } from 'speere'
import { rule, grammarSet } from 'speere/grammar'

const outputElement = document.getElementById('output')
const startButton = document.getElementById('start')
const stopButton = document.getElementById('stop')

// Define custom grammar
const actionRule = rule('actions', ['search', 'find', 'look up', 'browse'])
const myGrammar = grammarSet([actionRule])

const recognition = speech({
  grammar: myGrammar,
  continuous: true,
  interimResults: true,
  onResult: (result, isFinal) => {
    if (isFinal) {
      const transcript = result[0].transcript
      outputElement.textContent += transcript + ' '
    }
  },
  onStart: () => {
    console.log('Recognition started')
  },
  onEnd: () => {
    console.log('Recognition ended')
  },
})

startButton.addEventListener('click', () => recognition.start())
stopButton.addEventListener('click', () => recognition.stop())

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  recognition.dispose()
})
```

#### React

```jsx
import { useState, useEffect, useRef } from 'react'
import { speech } from 'speere'
import { rule, grammarSet } from 'speere/grammar'

function SpeechRecognizer() {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    if (!recognitionRef.current) {
      // Create grammar for common voice commands
      const voiceGrammar = grammarSet([
        { name: 'commands', alternatives: ['start', 'stop', 'clear'] },
      ])

      recognitionRef.current = speech({
        grammar: voiceGrammar,
        continuous: true,
        interimResults: true,
        onResult: (result, isFinal) => {
          if (isFinal) {
            setTranscript((prev) => prev + result[0].transcript + ' ')
          }
        },
        onStart: () => setIsListening(true),
        onEnd: () => setIsListening(false),
      })
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.dispose()
      }
    }
  }, [])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
    }
  }

  return (
    <div>
      <div className="transcript-box">
        {transcript || (
          <span className="placeholder">Speech will appear here...</span>
        )}
      </div>
      <button onClick={toggleListening}>
        {isListening ? 'Stop Listening' : 'Start Listening'}
      </button>
    </div>
  )
}
```

### Development

#### Setting Up Development Environment

```bash
# Clone the repository
git clone https://github.com/kou-by/speere.git
cd speere

# Install dependencies
npm install

# Run in development mode
npm run dev
```

#### Running Tests

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run coverage
```

#### Running Linting

```bash
# Run linting
npm run lint

# Run linting with auto-fix
npm run lint:fix
```

#### Continuous Integration

This project uses GitHub Actions for continuous integration. The following checks are automatically run:

- Code style checking with ESLint
- Unit testing with Vitest
- Coverage report generation

When creating a PR, make sure all these checks pass.

## 日本語ドキュメント

### 概要

Speere は、Web Speech API の音声認識機能へのシンプルなインターフェースを提供する軽量ライブラリです。フレームワークに依存しないアプローチを採用しており、vanilla JavaScript や任意のフロントエンドフレームワーク（React、Vue、Svelte など）とシームレスに連携します。

### インストール

```bash
npm install speere
```

### 基本的な使い方

```javascript
import { speech } from 'speere'
import { rule, grammarSet } from 'speere/grammar'

// カスタムルールで文法セットを作成
const myGrammar = grammarSet([
  {
    name: 'commands',
    alternatives: [
      '開始',
      '停止',
      '一時停止',
      '再開',
      'キャンセル',
      '開く',
      '閉じる',
    ],
  },
  {
    name: 'colors',
    alternatives: ['赤', '緑', '青', '黄', 'オレンジ', '紫', '黒', '白'],
  },
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

// 認識開始
recognition.start()

// 後で、認識停止
recognition.stop()

// 使い終わったらリソースを解放
recognition.dispose()
```

### API リファレンス

#### `speech(options)`

音声認識を初期化するメイン関数。

**パラメータ:**

- `options`: Object - 構成オプション

**オプション:**

- `grammar`: GrammarSet | SpeechGrammarList - 認識のための文法ルール
- `continuous`: boolean - 継続的に認識するかどうか（デフォルト: false）
- `interimResults`: boolean - 中間結果を返すかどうか（デフォルト: false）
- `lang`: string - 認識言語（デフォルト: ブラウザの言語）
- `maxAlternatives`: number - 代替認識の最大数（デフォルト: 1）
- `onResult`: (result: SpeechRecognitionResult, isFinal: boolean) => void - 結果のコールバック
- `onStart`: () => void - 認識開始時のコールバック
- `onEnd`: () => void - 認識終了時のコールバック
- `onError`: (error: SpeechRecognitionError) => void - エラー時のコールバック

**戻り値:**
次のメソッドを持つオブジェクト:

- `start()`: 音声認識を開始
- `stop()`: 音声認識を停止
- `abort()`: 音声認識を即座に中断
- `dispose()`: リソースをクリーンアップ

### Grammar モジュール

Speere は SpeechGrammarList の扱いを簡単にするための別モジュールを提供しています。

```javascript
import { rule, grammarSet } from 'speere/grammar'
```

#### `rule(name, items, options)`

単一の文法ルールを作成します。

**パラメータ:**

- `name`: string - ルールの名前
- `items`: string[] | string - 可能な値の配列または代替値を含む文字列
- `options`: Object - 構成オプション
  - `isPublic`: boolean - ルールを公開するかどうか（デフォルト: true）
  - `weight`: number - この文法の重み（0-1）（デフォルト: 1.0）

**戻り値:**
文法セットに追加できるルールオブジェクト

#### `grammarSet(rules)`

文法ルールのコレクションを作成します。

**パラメータ:**

- `rules`: Rule[] - ルールオブジェクトの配列

**戻り値:**
speech 関数に渡せる文法セットオブジェクト

### 使用例

#### 文法を使用した Vanilla JavaScript

```javascript
import { speech } from 'speere'
import { rule, grammarSet } from 'speere/grammar'

const outputElement = document.getElementById('output')
const startButton = document.getElementById('start')
const stopButton = document.getElementById('stop')

// カスタム文法を定義
const actionRule = rule('actions', ['検索', '探す', '調べる', '閲覧'])
const myGrammar = grammarSet([actionRule])

const recognition = speech({
  grammar: myGrammar,
  continuous: true,
  interimResults: true,
  onResult: (result, isFinal) => {
    if (isFinal) {
      const transcript = result[0].transcript
      outputElement.textContent += transcript + ' '
    }
  },
  onStart: () => {
    console.log('認識開始')
  },
  onEnd: () => {
    console.log('認識終了')
  },
})

startButton.addEventListener('click', () => recognition.start())
stopButton.addEventListener('click', () => recognition.stop())

// ページアンロード時にクリーンアップ
window.addEventListener('beforeunload', () => {
  recognition.dispose()
})
```

#### React

```jsx
import { useState, useEffect, useRef } from 'react'
import { speech } from 'speere'
import { rule, grammarSet } from 'speere/grammar'

function SpeechRecognizer() {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    if (!recognitionRef.current) {
      // 音声コマンド用の文法を作成
      const voiceGrammar = grammarSet([
        { name: 'commands', alternatives: ['開始', '停止', 'クリア'] },
      ])

      recognitionRef.current = speech({
        grammar: voiceGrammar,
        continuous: true,
        interimResults: true,
        onResult: (result, isFinal) => {
          if (isFinal) {
            setTranscript((prev) => prev + result[0].transcript + ' ')
          }
        },
        onStart: () => setIsListening(true),
        onEnd: () => setIsListening(false),
      })
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.dispose()
      }
    }
  }, [])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current.stop()
    } else {
      recognitionRef.current.start()
    }
  }

  return (
    <div>
      <div className="transcript-box">
        {transcript || (
          <span className="placeholder">ここに音声が表示されます...</span>
        )}
      </div>
      <button onClick={toggleListening}>
        {isListening ? '認識停止' : '認識開始'}
      </button>
    </div>
  )
}
```

## 開発

### 開発環境のセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/kou-by/speere.git
cd speere

# 依存関係をインストール
npm install

# 開発モードで実行
npm run dev
```

### テストの実行

```bash
# 単体テストを実行
npm run test

# テストをウォッチモードで実行
npm run test:watch

# カバレッジレポートを生成
npm run coverage
```

### リントの実行

```bash
# リントを実行
npm run lint

# リントを実行して自動修正
npm run lint:fix
```

### 継続的インテグレーション

このプロジェクトは GitHub Actions を使用して継続的インテグレーションを実装しています。以下のチェックが自動的に実行されます：

- ESLint によるコードスタイルチェック
- Vitest による単体テスト
- カバレッジレポートの生成

PR を作成する際は、これらのチェックが全て通過することを確認してください。
