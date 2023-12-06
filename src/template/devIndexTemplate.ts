export const devIndexTemplate = (content: string) => {
  return  `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maxium-scale=1.0">
    <title>Project Directory</title>
    <style>:root{font-size:16px;}</style>
  </head>
  <body>
    <div>
      <h1 style="font-size:20px;">代码目录:</h1>
      ${content}
    </div>
  </body>
  </html>
  `
}