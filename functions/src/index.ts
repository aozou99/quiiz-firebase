// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

// エンドポイント
const endpoints = [
  "existDisplayName",
  "updateExercise",
  "deleteExercise",
  "pagingExercise",
];
// デプロイ時にすべて読み込む
if (!process.env.FUNCTION_NAME) {
  endpoints.forEach((endpoint) => {
    exports[endpoint] = require(`./function/${endpoint}`);
  });
}
// Cold Start後の実行時に必要な処理だけ読み込む
if (
  process.env.FUNCTION_NAME &&
  endpoints.includes(process.env.FUNCTION_NAME)
) {
  exports[
    process.env.FUNCTION_NAME
  ] = require(`./function/${process.env.FUNCTION_NAME}`);
}

// トリガー
exports.autoDeleteExerciseThumbnails = require("./function/autoDeleteExerciseThumbnails");
