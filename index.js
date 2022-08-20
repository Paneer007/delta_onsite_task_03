let userData = []
let deathArr =[]
let casesArr=[]
let xFeature;
let yFeature;
let userDataCases
let userDataDeaths
const clearGraph=()=>{
    const SearchGridCases = document.getElementById("SearchGridCases")
    SearchGridCases.innerHTML=''
    const SearchGridDeaths = document.getElementById("SearchGridDeaths")
    SearchGridDeaths.innerHTML=''
}
const bufferGraph=()=>{
    document.getElementById("searchCasesText").textContent="Waiting"
    document.getElementById("searchDeathText").textContent="Waiting"
}
const unBufferGraph=()=>{
    document.getElementById("searchCasesText").textContent="Cases"
    document.getElementById("searchDeathText").textContent="Deaths"
}
const makeGraph=()=>{

    const SearchGridCases = document.getElementById("SearchGridCases")
    for(let i=-1;75>i;i++){
        const row = document.createElement('div')
        SearchGridCases.appendChild(row)
        row.id=`caserow ${i}`
        row.className='row'
        row.dataset.row=i
        for(let j=-2;62>j;j++){
            const col = document.createElement('div')
            row.appendChild(col)
            col.id=`casecol ${i} ${j}`
            if(j%2==0 || j==0){
                col.className='col'
            }else{
                col.className='altcol'
            }
            col.dataset.row=i
            col.dataset.col=j
        }
    }
    const SearchGridDeaths = document.getElementById("SearchGridDeaths")
    for(let i=-1;75>i;i++){
        const row = document.createElement('div')
        SearchGridDeaths.appendChild(row)
        row.id=`deathrow ${i}`
        row.className='row'
        row.dataset.row=i
        for(let j=-2;62>j;j++){
            const col = document.createElement('div')
            row.appendChild(col)
            col.id=`deathcol ${i} ${j}`
            if(j==0 || j%2==0){
                col.className='col'
            }else{
                col.className='altcol'
            }
            col.dataset.row=i
            col.dataset.col=j
        }
    }
}
const maxminCases =(array)=>{
    const max= Math.max(...array)
    const min = Math.min(...array)
    return {max,min}
}
const colorCases=()=>{
    const {max,min} = maxminCases(casesArr)
    const limit = (max)/74
    for(let i=62;i>-2;i--){
        console.log('here')
        if(i%2==1 || i/2 >casesArr.length){
            continue
        }
        z=i/2
        for(let j=73;j>1;j--){
            if((casesArr[z]> limit*(73-j)) && casesArr[z]>=0 ){
                document.getElementById(`casecol ${j} ${i}`).style.backgroundColor="red"
            }else{
                break
            }
        }
    }
    labelGraphsCases()
}
const colorDeaths=()=>{
    const {max,min} = maxminCases(deathArr)
    const limit = (max)/74
    console.log(max)
    for(let i=62;i>-2;i--){
        if(i%2==1 || i/2 >casesArr.length){
            continue
        }
        z=i/2
        for(let j=73;j>1;j--){
            if(deathArr[z]> limit*(73-j)){
                document.getElementById(`deathcol ${j} ${i}`).style.backgroundColor="red"
            }else{
                break
            }
        }
    }
    labelGraphsDeath()
}
const labelGraphsDeath=()=>{
    //x labelling
    console.log(casesArr)
    for(let i = -1 ;i<31;i++){
        const col = document.getElementById(`deathcol 74 ${i*2}`)
        if(i==-1){
            col.textContent='y/x';
            col.className="dayClass"
            continue
        }
        col.textContent=i+1;
        col.className="dayClass"
    }
    //y labelling
    const {max,min} = maxminCases(deathArr)
    console.log(deathArr)
    const limit = (max)/73
    for(let i=73;i>1;i-=5){
        let val = 73-i;
        let fval = Math.round(val*limit);
        console.log(fval)
        let row = document.getElementById(`deathcol ${i} -2`)
        row.classList.add('textContent')
        row.textContent=fval

    }
}
const labelGraphsCases =()=>{
    //x labelling
    for(let i = -1 ;i<31;i++){
        const col = document.getElementById(`casecol 74 ${i*2}`)
        if(i==-1){
            col.textContent='y/x';
            col.className="dayClass"
            continue
        }
        col.textContent=i+1;
        col.className="dayClass"
    }
    //y labelling
    const {max,min} = maxminCases(casesArr)
    const limit = (max)/73
    for(let i=73;i>0;i-=5){
        let val = 73-i;
        console.log()
        let fval = Math.round(val*limit);
        console.log(fval)
        let row = document.getElementById(`casecol ${i} -2`)
        row.classList.add('textContentSmaller')
        row.textContent=fval

    }
}
const colorGraph=()=>{
    colorCases()
    colorDeaths()
}
function diffOfDays(arr) {
    var newArray = [];
    for (var i = 1; i < arr.length; i++){
        newArray.push(arr[i] - arr[i - 1])
    }
    return newArray;
}
const updateTheArrays=()=>{
    const cases = userDataCases.map(x=>{
        return x.Cases
    })
    const deaths = userDataDeaths.map(x=>{
        return x.Cases
    })
    casesArr = diffOfDays(cases)
    deathArr = diffOfDays(deaths)

}
const startBarGraph = () =>{
    updateTheArrays()
    clearGraph()
    bufferGraph()
    makeGraph()
    unBufferGraph()
    colorGraph()
}

const makeCountryRequest=async()=>{
    const inputStuff = document.getElementById("searchForCountry")
    const value = inputStuff.value
    const startDate = document.getElementById("startDate").value
    let d = new Date(startDate);
    let endDate = new Date(d.setMonth(d.getMonth() + 1));
    endDate =  endDate.getFullYear()+ "-" + (endDate.getMonth()+1) +"-" +endDate.getDate()
    console.log(startDate,endDate)
    if(!(startDate&&endDate&&value)){
        alert("Enter valid credentials")
        return
    }
    try{
        const confirm = await axios.get(`https://api.covid19api.com/total/country/${value}/status/confirmed?from=${startDate}T00:00:00Z&to=${endDate}T00:00:00Z`)
        const deaths = await axios.get(`https://api.covid19api.com/total/country/${value}/status/deaths?from=${startDate}T00:00:00Z&to=${endDate}T00:00:00Z`) 
        userData = confirm.data
        userDataCases = confirm.data
        userDataDeaths = deaths.data
        console.log(userDataDeaths)
        startBarGraph()   
    }catch(e){
        alert("Enter valid credentials")
    }
    
}
const addHomePageEventListeners=()=>{
    const SearchStuff = document.getElementById("SearchStuff")
    SearchStuff.addEventListener('click',()=>{
        makeCountryRequest()
    })
}
const makeHomePage=()=>{
    const root = document.getElementById("root")
    root.innerHTML=`
    <div id="titleOfSite">
        <p>Covid Country Search</p>
    </div>
    <div class="Units">
        <p>X axis - Number of cases/deaths</p>
        <p>Y axis - Day of the month from start to stop in terms of days</p>
    </div>
    <div class="inputDateAndCountry">
        <div id="parentInputDiv">
            <div id="inputData">
                <input type="date" id="startDate" name="start">
            </div>
            <div class="SearchingContent" >
                <input id="searchForCountry" placeholder="search for a country">
                <span id="SearchStuff" class="material-symbols-outlined">
                    search
                </span>
            </div>
        </div>
    </div>
    
    <div class="SearchGraphMainDiv">
        <p class="searchContent" id="searchCasesText">Search to show cases</p>
            <div id="SearchGridCases">
        </div>
    </div>

    <div class="DeathGraphMainDiv">
        <p class="searchContent" id="searchDeathText">Search to show deaths</p>
        <div id="SearchGridDeaths">
        </div>
    </div>
    
    `
}
const main =()=>{
    makeHomePage()
    addHomePageEventListeners()
}
main()