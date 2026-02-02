const { App } = require('@slack/bolt');
const { spawn } = require('child_process');
require('dotenv').config();

// Slack App 初期化
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

// Claude Code を実行
async function runClaudeCode(prompt) {
  return new Promise((resolve) => {
    const proc = spawn('claude', [
      '-p', prompt,
      '--print',
      '--max-turns', '5',
    ]);

    let output = '';
    let error = '';

    proc.stdout.on('data', (data) => {
      output += data.toString();
    });

    proc.stderr.on('data', (data) => {
      error += data.toString();
    });

    proc.on('close', (code) => {
      if (code === 0 && output.trim()) {
        resolve(output.trim());
      } else if (error) {
        resolve(`エラーが発生しました: ${error}`);
      } else {
        resolve(output.trim() || 'すみません、応答を生成できませんでした。');
      }
    });

    proc.on('error', (err) => {
      resolve(`Claude Code の実行に失敗しました: ${err.message}`);
    });

    // タイムアウト（3分）
    setTimeout(() => {
      proc.kill();
      resolve('タイムアウトしました。処理に時間がかかりすぎています。');
    }, 180000);
  });
}

// DMメッセージを受信
app.message(async ({ message, say }) => {
  // Botのメッセージは無視
  if (message.subtype === 'bot_message') return;
  if (!message.text) return;

  console.log(`📩 メッセージ受信: ${message.text}`);

  // 処理中メッセージ
  await say('🤔 考えています...');

  try {
    // Claude Code 実行
    const response = await runClaudeCode(message.text);

    // 長すぎる場合は分割（Slackの制限は約3000文字）
    if (response.length > 3000) {
      const chunks = response.match(/[\s\S]{1,3000}/g) || [];
      for (const chunk of chunks) {
        await say(chunk);
      }
    } else {
      await say(response);
    }

    console.log('✅ 応答完了');
  } catch (error) {
    console.error('❌ エラー:', error);
    await say(`エラーが発生しました: ${error.message}`);
  }
});

// メンションを受信
app.event('app_mention', async ({ event, say }) => {
  const text = event.text.replace(/<@[A-Z0-9]+>/g, '').trim();

  if (!text) {
    await say('何かお手伝いしましょうか？');
    return;
  }

  console.log(`📩 メンション受信: ${text}`);

  await say('🤔 考えています...');

  try {
    const response = await runClaudeCode(text);
    await say(response);
    console.log('✅ 応答完了');
  } catch (error) {
    console.error('❌ エラー:', error);
    await say(`エラーが発生しました: ${error.message}`);
  }
});

// 起動
(async () => {
  await app.start();
  console.log('');
  console.log('❄️  ゆき が起動しました！');
  console.log('');
  console.log('Slack でゆきにDMを送ってみてください。');
  console.log('終了するには Ctrl+C を押してください。');
  console.log('');
})();
