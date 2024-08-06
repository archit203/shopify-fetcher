
export default function Title() {
  return (
    <header className="w-full flex justify-between bg-gradient-to-r from-[#f0f4f8] to-[#d9e2ec] py-4 px-4">
      <img src="download.png" alt="Shopify_logo" height={70} width={70}/>
      <div className="flex items-center p-5">
        <h1 className="text-2xl font-bold text-[#334e68]">Welcome to Shopify Fetcher</h1>
      </div>
      <div className="invisible"><img src="download.png" alt="Shopify_logo" height={70} width={70}/></div>
    </header>
  )
}

