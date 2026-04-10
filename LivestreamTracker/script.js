

let maxHeight = 1000;
let peakMonth = 0;
let peakMonthDiv

let allBarsParent = document.querySelector(".graph .elements")


const dbURL = "https://mtpgvgyklcmewbpvffry.supabase.co"
const dbKey = "sb_publishable_LEVkojjNXjHinjthFzkmvg_vrQ4vy6J"



// connecting supabase
const {createClient} = supabase
const DBclient = createClient(dbURL,dbKey)






// allBarsParent.appendChild()



// converts the month number to name like 3 -> March
function monthName(monthNumber){
  const date = new Date(2000, monthNumber - 1)
  return date.toLocaleString('default', { month: 'long' })
}


// returns number of days in month
function daysInMonth(month){
    if(month>7){
        if((month-7)%2 == 0)return 30
        return 31
    }
    else{
        if(month==2)return 28
        else{
            if(month%2==0)return 30
            return 31
        }
    }
}



// makes a random number 
function randomNum(begin, end){
    let length = end-begin
    
    let random = begin + Math.floor(Math.random()*length)
    
    return random
}



// generates date and increment it so it generate in order
let Currdate = 1
let Currmonth = 1
function randomDate(){
    let retObj = {
        date:Currdate,
        month: Currmonth
    }

    Currdate+=1
    
    // if(Currdate>30){
    //     Currmonth +=1
    //     Currdate = 1
    // }
    if(Currdate>daysInMonth(Currmonth)){
        Currmonth +=1
        Currdate = 1
    }
    
    return retObj


}


// this list store all data that is taken from server
let dbms = []

// this is simulator for fetch for testing

function addRandomElements(){
    for(let i=0; i<100; i++){
        let obj = {
            date: randomDate(),
            views: randomNum(0,700),
            likes: randomNum(-100,100)
        }
    
        
    
    
        dbms.push(obj)
    }

}

// addRandomElements()

// console.log(dbms)





/* 

below code is run to added background only when monthSection has some minimum amount of bars.


*/

// monthBG.className = "monthSectionBack"
// monthBG.innerText = monthName(currentMonth)

// monthGroup.appendChild(monthBG)

// let monthBG = document.createElement('div')
// monthBG.className = "monthSectionBack"




// this code is for adding blocks to html

function addBlocks(dbms){
    /* 
    
    section with class name monthSection stores bars for each month then there are multiple sections for multiple months.
    monthSection has a child with class monthSectionBack which has background and month name for section
    
    
    */
   
   let currentMonth = dbms[0].date.month
   let monthGroup = document.createElement('section')
   
   let monthBG = document.createElement('div')
   
   monthGroup.className = "monthSection"
   let monthSize = 0
    
    for(let i=0; i<dbms.length; i++){
        let ranDate = dbms[i].date
        let ranValue = dbms[i].views
        
        let likes = dbms[i].likes
        
    // storing maxHeight
    if(ranValue>maxHeight){
        maxHeight = ranValue
    }
    

    /* 
    
    creating bar with some custom attributes. 
    value = views 
    likes = likes
    date = date(1 - 28,29,30,31) 
    month(1-20)
    
    */
    let bar = document.createElement("div");
    bar.className = "bar";
    bar.setAttribute('value', ranValue)
    bar.setAttribute('likes', likes)
    bar.setAttribute('date', ranDate.date)
    bar.setAttribute('month',ranDate.month)


    // bar.addEventListener("m")

    // this event is for tooltip that appers above bar
    bar.addEventListener("mousemove", (event)=>{

        /**
         * tooltip is selected and its style is set to flex so its not none.
         * then it is checked whether mouse is very end of screen so according to that tooltip position is set to follow mouse.
         * after that some valus are gathered from attributed of current bar and these values are set in tooltip html
         * 
         */
        let tooltip = document.querySelector('.tooltip')
        tooltip.style.display = "flex"

        
        tooltip.style.top = `${event.clientY}px`

        if(event.view.innerWidth - event.clientX <200){
            tooltip.style.removeProperty('left')
            // tooltip.style.left = ``
            tooltip.style.right = `${event.view.innerWidth - event.clientX}px`
        }
        else{
            // tooltip.style.right = ``
            tooltip.style.removeProperty('right')
            tooltip.style.left = `${event.clientX}px`

        }
        // console.log(event)

        let views = document.getElementById("tooltip-views")
        views.innerText = event.target.getAttribute("value")

        let dateText = document.getElementById("tooltip-date")
        let date = event.target.getAttribute("date")
        let monthNum = event.target.getAttribute("month")
        let month = monthName(monthNum)
        dateText.innerText = `${date} ${month}`

        let likesText = document.getElementById("tooltip-likes")
        likesText.innerText = likes
         
    })
    bar.addEventListener("mouseleave",()=>{
        let tooltip = document.querySelector('.tooltip')
        tooltip.style.display = "none"
    })

    let span = document.createElement('span')
    span.className = "date"
    span.innerText = ranValue

    // bar.appendChild(span)


    // setHeight(bar)
    
    /**
     * if month changes then values of variables are reset and new monthSection is created for next month
     */
    if(ranDate.month != currentMonth){
        currentMonth = ranDate.month
        
        
        allBarsParent.appendChild(monthGroup)
        monthGroup = document.createElement('section')
        monthGroup.className = "monthSection"
        
        
        monthSize=0
        
        
    }

    /**
     * if month size is 15 then only background is added to monthSection.
     */
    if(monthSize==15){
        monthBG = document.createElement('div')
        monthBG.className = "monthSectionBack"
        monthBG.innerText = monthName(currentMonth)
        monthGroup.appendChild(monthBG)
    }

    monthGroup.appendChild(bar) 
    monthSize+=1
    
}

/**
 * this statement will add final monthSection which is not added in loop because of month changing condition
 */
allBarsParent.appendChild(monthGroup)

}

// addBlocks()
/**
 * this codes set height for each bar. loop is ran to select each bar and then setHeight function set style for each bar
 * height is set after some delay for transition effect
 */ 


function setHeight(element){
    let value = Number(element.getAttribute('value'))
    if(maxHeight<value){
        maxHeight=value
    }
    
    let percent = value/maxHeight * 100
    element.style.height = `${percent}%`;
    
}

// allBars.forEach((elem)=>{
    //     setHeight(elem)
    // })
    
    // allBars = 
    
    // console.log(maxHeight)
    
    
function setHeightAll(){
    let allBars = document.querySelectorAll(".graph .elements .bar")
    setTimeout(() => {
        allBars.forEach((elem)=>setHeight(elem))
    }, 100);
}
// setHeightAll()

// console.log(allBarsParent.scrollLeft, allBarsParent.scrollWidth)


    // console.log(allBarsParent.scrollLeft, allBarsParent.scrollWidth)


/**
 * this code sets scroll to right so by default we see latest data
 */


function scrollLeft(){
    allBarsParent.scrollLeft = allBarsParent.scrollWidth

}
// scrollLeft() 


/**
 * it sets the value of maxLine and midLine
 */

function setGraphLines(){
    document.getElementById('max-line').innerText = maxHeight
    document.getElementById('mid-line').innerText = Math.floor(maxHeight/2)

}
// setGraphLines()

function dateConstructor(date, month){
    return {
        date:date,
        month:month
    }
}

function addElements(list){
    dbms = []
    list.forEach((data)=>{
        let date = new Date(data.date_of_capture)
        let obj = {
            date: dateConstructor(date.getDate(),date.getMonth()+1),
            views: Math.round(data.averageviews),
            likes: data.likesgained
        }

        dbms.push(obj)

        // console.log(Math.round( data.averageviews))
        
    })
}


async function main(){
    const request = await DBclient.from("final_table").select()

    if(request.error != null){ //error
        console.log(request.error)
        return
    }

    // console.log(request)
    addElements(request.data)
    // console.log(dbms)
    addBlocks(dbms)
    // addRandomElements()
    setHeightAll()
    scrollLeft()
    setGraphLines()

}

main()
// console.log(maxHeight)


