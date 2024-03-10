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

  // NOTE: この時点でレコードは1つしかないので、初めの値を取得
  const record = budget.results[0];
  if (!record?.properties) throw new Error("選択した項目が見つかりませんでした");

  return record;
}

// NOTE: レコードの単体データが入る
async function updateBudget(client, record, addAmount = 0) {
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

  const genre = event.body?.genre;
  const amount = event.body?.amount;
  if (!genre) return { statusCode: 400, body: { message: "項目が選択されていません" } };
  if (!amount) return { statusCode: 400, body: { message: "金額が選択されていません" } };
  if (isNaN(amount)) return { statusCode: 400, body: { message: "金額が数字ではない値が検出されました" } };

  try {
    const budget = await getGenresBudget(notion, genre);
    await updateBudget(notion, budget, amount)
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify(
        {
          message: "処理が失敗しました",
          error: error.message,
        }
      ),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "getTableInfo",
        input: event,
      }
    ),
  };
};
