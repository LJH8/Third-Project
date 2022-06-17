let url 
let newsType = []
let menus = document.querySelectorAll(".menu-list button")
let side_menus = document.querySelectorAll(".side-menu-list button")
let page = 1;
let total_page = 0;
side_menus.forEach(side_menu => side_menu.addEventListener("click",(event) =>moveTopicforside(event)))
menus.forEach(menus => menus.addEventListener("click",(event) => moveTopic(event)))

const APIParts = async() =>{
    
    try{
    let header = new Headers({'x-api-key' :"kO8Z2ttBJTyTtEfq7yXU1Za3rO1k_BqIS-1KIIKGYvg"})
    url.searchParams.set('page', page);
    let response = await fetch(url,{headers:header})
    let data = await response.json()
    if(response.status == 200)
    {
        if(data.total_hits == 0)
        {
            throw new Error("검색 결과가 없습니다.")
        }
        newsType = data.articles
        console.log(data)
        render()
        Pagenation()
    }
    else{
        throw new Error(data.message)
    }
    
}
catch(error){
renderError(error)
}
}

const callAPI = async() =>{
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=5`)
    APIParts()

    
}

callAPI()

const render = () => {
    let newsHTML = ""
    newsHTML = newsType.map(item => {
       return `
       <div class="content" >
       <div class="news-img">
           <img src="${item.media || "https://search.naver.com/search.naver?sm=tab_hty.top&where=image&query=%EC%9D%B4%EB%AF%B8%EC%A7%80+%EC%97%86%EC%9D%8C&oquery=%EC%9D%B4%EB%AF%B8%EC%A7%80%EB%A5%BC+%EB%B6%88%EB%9F%AC%EC%98%AC%EC%88%98+%EC%97%86%EC%9D%8C&tqi=hqwgzlprvh8ssOhyabVssssstyd-253229#"}" alt="" srcset="">
       </div>
       <div class="news-content">
           <h2>${item.title}</h2>
           <p>${item.summary.length > 200? item.summary.substring(0,200) + "..." : item.summary}</p>
           <p>${item.rights}, ${moment(item.published_date).fromNow()}</p>
       </div>
   </div>
    `
    }).join("")
    
    document.getElementById("new-articles").innerHTML = newsHTML
}

const renderError = (err) => {
    let ErrorHTML = `<div>에러 내용 : <br>${err.message}</div>`


    document.getElementById("new-articles").innerHTML = ErrorHTML
}


const moveTopic = async(event) =>{
    let topic = event.target.textContent;
    page = 1
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=5`)
    APIParts()

}

const moveTopicforside = (event) => {
    moveTopic(event)
    closeNav()
}


const searchKeyword = async() => {
    let inputValue = document.getElementById("input-text").value
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${inputValue}&from='2022/06/10'&countries=kr&page_size=5`)
    
    APIParts()

    document.getElementById("input-text").value = ""
    
}

const goreturn = () => {
    callAPI()
}

const Pagenation = () => {
    let pageHTML = ""
    let pageGroup = Math.ceil(page/10)
    let lastPage = pageGroup*10
    let firstPage = lastPage-9;

    pageHTML += `<a href="#" onclick="movePage(${page-1})">&laquo;</a>`

    for(let i=firstPage;i<=lastPage;i++)
    {
     pageHTML += `<a href="#" class="${i==page? "active" : ""}" onclick="movePage(${i})">${i}</a>`
        
    }
    pageHTML += `<a href="#" onclick="movePage(${page+1})">&raquo;</a>`

    document.getElementById("pagination").innerHTML = pageHTML
}

const movePage = (pageNum) => {
    page = pageNum
    
    APIParts()
}

const openSearchBox = () => {
    let keywordBox = document.getElementById("search-aria")
    if(keywordBox.style.display === "inline")
    {
        keywordBox.style.display = "none"
    }else{
        keywordBox.style.display = "inline"
    }
}

const openSideNav = () =>{
    let openSideNav=document.getElementById("mySidenav")
    openSideNav.style.width = "70%"
}

const closeNav = () => {
    document.getElementById("mySidenav").style.width = "0"
}