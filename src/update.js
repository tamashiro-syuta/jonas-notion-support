async function update() {
  const { Client } = require("@notionhq/client");
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  const response = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: "月",
      select: {
        equals: "未設定",
      },
    },
  });
  //ページ情報
  console.log(response);
  console.log('---------------------------------------------------------------');
  //プロパティ情報
  console.log(response.results[0].properties);
  console.log('---------------------------------------------------------------');
  console.log(response.results[0].properties['支出額']);
  console.log('---------------------------------------------------------------');
  console.log(response.results[0].properties['支出額'].number);
  console.log('---------------------------------------------------------------');

  const assetRecordId = response.results[0].id;
  const assetRecordsAmount = response.results[0].properties['支出額']?.number || 0;

  const updateResponse = await notion.pages.update({
    page_id: assetRecordId,
    properties: {
        '支出額': {
            type: 'number',
            number: assetRecordsAmount + 1,
        },
    },
});

console.log(updateResponse);
}

module.exports.handler = async (event) => {
  await update();

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
