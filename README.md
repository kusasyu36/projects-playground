# Projects

Claude Code を使った開発プロジェクトの管理フォルダ。

## フォルダ構成

```
~/projects/
├── _guides/          # 共通ガイド（全プロジェクトで参照）
├── _resources/       # 参考PDF・書籍
├── _docs/            # その他ドキュメント
└── [プロジェクト]/   # 個別プロジェクト
```

## 使い方

### 新規プロジェクトを始める

```bash
cd ~/projects
mkdir my-new-project
cd my-new-project

# Claude Code を起動
claude
```

初回は「サービス開発フレームワークに沿って進めて」と指示すればOK。

### 共通ガイドの参照

各プロジェクトの `CLAUDE.md` に以下を記載：

```markdown
## 参照ドキュメント
- ~/projects/_guides/サービス開発フレームワーク.md
- ~/projects/_guides/コンテキスト管理ガイド.md
- ~/projects/_guides/Claude_Code機能ガイド.md
- ~/projects/_guides/技術課題解決ガイド.md
```

### プロジェクト一覧

| フォルダ | 概要 |
|---------|------|
| claude-code-guide-course | 非エンジニア向けClaude Code講座 |
| sake-ai-app | 日本酒AIアプリ |
| AI駆動開発研修 | AI駆動開発の研修資料 |
| ... | （詳細は各フォルダのCLAUDE.mdを参照） |

## 更新履歴

| 日付 | 内容 |
|------|------|
| 2025-01-27 | ~/Desktop/claude/ から移行 |
