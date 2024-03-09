// NOTE: 未設定 かつ ジャンルが 引数の値 のレコードを取得
async function getGenresBudget(client, genre) {
  const budget = await client.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      and: [
        {
          property: "月",
          select: {
            equals: "未設定",
          },
        },
        {
          property: "項目",
          title: {
            equals: genre,
          },
        },
      ],
    },
  });

  //ページ情報
  console.log(budget);
  console.log('---------------------------------------------------------------');
  //プロパティ情報
  console.log(budget.results[0].properties);
  console.log('---------------------------------------------------------------');
  console.log(budget.results[0].properties['支出額']);
  console.log('---------------------------------------------------------------');
  console.log(budget.results[0].properties['支出額'].number);
  console.log('---------------------------------------------------------------');

  // TODO: 後でエラーハンドリングの処理を追加

  return budget.results[0];
}

// NOTE: レコードの単体データが入る
async function updateBudget(client, record, addAmount = 0) {
  const assetRecordId = response.results[0].id;
  const assetRecordsAmount = response.results[0].properties['支出額']?.number || 0;
  const updateProperty = "支出額";
  const assetRecordsAmount = record.properties[updateProperty]?.number || 0;

  const updateResponse = await client.pages.update({
    page_id: record.id,
    properties: {
      [updateProperty]: {
            type: 'number',
            number: assetRecordsAmount + addAmount,
        },
    },
});

console.log(updateResponse);
}

// NOTE: 入力したカテゴリにつき、1リクエスト
module.exports.handler = async (event) => {
  const { Client } = require("@notionhq/client");
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  const testGenre = "資産形成";
  const budget = await getGenresBudget(notion, testGenre);
  await updateBudget(notion, budget, 100)

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "getTableInfo",
        input: event,
      },
      null,
      2
    ),
  };
};
