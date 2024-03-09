async function getUSer() {
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
  console.log('存在しないプロパティ');
  console.log(response.results[0].properties['hoge']?.number);
  console.log('---------------------------------------------------------------');
}

module.exports.handler = async (event) => {
  await getUSer();

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
