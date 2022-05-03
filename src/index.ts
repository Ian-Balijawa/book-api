async function main(): Promise<string> {
  console.log('Main')
  return new Promise((r, j) => {
    setTimeout(() => {
      r('Hello World!')
    }, 1000) // 1s
  })
}

async function runMain() {
  const Hello = await main()
  return Hello
}

runMain()
  .then((result) => console.log(result))
  .catch((err) => console.log(err))
