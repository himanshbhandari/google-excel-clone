//dimension
const COLS=26;
const ROWS=100;

//constant
const transparentBlue='#ddddff';
const transparent='transparent';
const arrMatrix="arrMatrix";

//table components
const tHeadRow=document.getElementById("table-heading-row");
const tBody=document.getElementById("table-body")
const currentCellHeading=document.getElementById('current-cell');
const sheetNo=document.getElementById("sheet-no")
const buttonContainer=document.getElementById("button-container");


//excel buttons
const boldBtn=document.getElementById("bold-btn");
const italicsBtn=document.getElementById("italic-btn");
const underlineBtn=document.getElementById("underline-btn");
const leftBtn=document.getElementById("left-btn");
const centerBtn=document.getElementById("center-btn");
const rightBtn=document.getElementById("right-btn");
const cutBtn=document.getElementById("cut-btn");
const copyBtn=document.getElementById("copy-btn");
const pasteBtn=document.getElementById("paste-btn");
const uploadInput=document.getElementById("upload-input");
const  addSheetBtn=document.getElementById("add-sheet-btn");
const saveSheetBtn=document.getElementById("save-sheet-btn");


//dropdown
const fontStyleDropdown=document.getElementById("font-style-dropdown");
const fontSizeDropdown=document.getElementById("font-size-dropdown");

//input tags
const bgColorInput=document.getElementById("bgColor");
const fontColorInput=document.getElementById("fontColor");


//cache
let currentCell;
let previousCell;
let cutCell;  //it variable help cut copy paste. it cell store will my cell data.
let lastPress; 
let numSheets=1; //size
let currentSheet=1;//index
let prevSheet;

let matrix=new Array(ROWS);


function createNewMatrix(){
    // 2D matrix array of table
    for(let row=0; row<ROWS; row++){
        matrix[row]=new Array(COLS);
        
        //for iterating in cells
        for(let col=0;col<COLS; col++){
            matrix[row][col]={};   //matrix[row][col]-->is give me a cell     

        }

    }

}

createNewMatrix();

//for  genrating table columns
function colGen(typeOfCell,tableRow,isInnerText,rowNumber){
    for(let col=0; col<COLS; col++){
        const cell=document.createElement(typeOfCell);
        //A,B,C,D
        //0-->'A;
        //0->65-->ascii char of 65
        if(isInnerText){
            cell.innerText=String.fromCharCode(col+65);
            cell.setAttribute('id',cell.innerText);
        }
        else{
            //col-A,B, C, D
            cell.setAttribute('id',`${String.fromCharCode(col+65)}${rowNumber}`);
            cell.setAttribute('contenteditable',true);
            // cell.addEventListener("focus",(event)=>console.log(event.target));
            cell.addEventListener("input",updateObjectInMatrix) //i attach eventlistner to my every  cell
                                                                //whenever someone writing or inputing any thing it will updating my matrix also

            //event.target is my current cell
            cell.addEventListener("focus", (event)=>focusHandler(event.target));  //i just givemy td cell  to 
                                                                                // focusHandler function
        }
        tableRow.appendChild(cell);
    }

}


colGen('th',tHeadRow,true);  //calling function for generating the columns


//update cell in matrix  , so whenever any change in my table or currentCell i want triggered this  function
function updateObjectInMatrix(){
    // console.log(matrix[0][0]);

    //A1-> 0,0  in my matrix row, col and in my id col,row
    //A2=>1,0  so convert its id to accessible index numbers
    let id=currentCell.id;
    //id[0] -> 'A' -> 'A'.charCodeAt(0) ->65
    let col=id[0].charCodeAt(0)-65;
    let row=id.substring(1)-1;  //id.substr()  and is.substring both will be do same work
    matrix[row][col]={ //either i can  manupulate previous create object or created new object here
        text:currentCell.innerText,
        style:currentCell.style.cssText,
        id:id,
    };

}


function setHeaderColor(colId,rowId,color){
    // console.log(colId);
    const colHead=document.getElementById(colId)
    const rowHead=document.getElementById(rowId);
    colHead.style.backgroundColor=color;
    rowHead.style.backgroundColor=color;

}


//i want converted my matrix or code form to file format
// now i want save my file into outer memoery that is accesible outside of vs code
function downloadMatrix(){
        //2d  matrix iinto a memory that's accesible outside;
        //toh matrix  ko localstorage me rakhenge but first wee need cconvert matrix into strig  tabhi ham localStorage  me save krwa payenge
    const matrixString=JSON.stringify(matrix);
                //blob -> its peace of memory that is accessible outside the browser or vs code
                //so i want convert my matrix or peace of code into blob
    const blob=new Blob([matrixString], {type:'application/json'})
    // console.log(blob);  //blob just  piee of  memory it is  telling us size when i click download btn
    //blob will take two argument 1st is array and second is object(typeof format you need to convert);

    //'url download in html' search in google-> 1st) creating anchor a tag
                                        //2nd) pass blob into href
                                        //3rd) add  download attribute in a tg
                                        //download="title" whatever you write in download attribute yeh download karte timme woh title dega
    const link=document.createElement('a');
    //we cant directly pass here blob because blob is peice of memory and href is expecting link
    link.href=URL.createObjectURL(blob) //yeh blob ko as a object consider karega then inbuilt URL method se url me cchange ho jayega
    //createObjectURL convert my blob to link
    link.download='table.json';
    link.click(); 

}


//upload_innput eventlistener
uploadInput.addEventListener("input",uploadMatrix);


function uploadMatrix(event){ //uploadInpput par jo eventlistener lagyawoh hame yeh event de raha hai
    // console.log(event);  // toh target pe hame hamari  file milti hai check it into expanding obj  in console
    // console.log(event.target.files);
    // console.log(event.target.files[0]);  //oth index of this object contain my files

    //now i want convert my file into matrix
    const file=event.target.files[0];
    //FileReader helps me to read  my blob
    if(file){
        const reader=new FileReader();
        reader.readAsText(file);  //iam loading  my file in reader instances
            //reader class read my file as text
            //this will trigger noload method of reader instances

        reader.onload=function(event){//this event converted my peice of memory or file into  text or you can  say into code
            // console.log(event);
            // console.log(event.target.result);
            const fileContent=JSON.parse(event.target.result);
            // console.log(fileContent);
            //update virtual memory
            matrix=fileContent;
            renderMatrix();
        }
    }

}


//typeOfButton-> boldbtn,italic btn
//styleProperty->fontweight,textDecoration
//style
function buttonHiglighter(button,styleProperty,style){
    if(currentCell.style[styleProperty]===style){//yha function my style propety as a string pass hori hai iss liye square bbraces ke andar likhenge
        button.style.backgroundColor=transparentBlue;
    }else{
        button.style.backgroundColor=transparent;
    }
}


function focusHandler(cell){
    // console.log(cell.style); //is pure style object ko lo ya only cssText ko lo

    currentCell=cell;
    if(previousCell){
        //set header colors as transparent
        setHeaderColor(previousCell.id[0], previousCell.id.substring(1),'transparent');
    }

    // //setting bold button according to cell fontweight
    // if(currentCell.style.fontWeight==='bold'){
    //     boldBtn.style.backgroundColor=transparentBlue;
    // }
    // else{
    //     boldBtn.style.backgroundColor=transparent;
    // }

    // //setting bold button according to cell style
    // if(currentCell.style.fontStyle==='italic'){
    //     italicsBtn.style.backgroundColor=transparentBlue;
    // }
    // else{
    //     italicsBtn.style.backgroundColor=transparent;
    // }

    // //setting bold button according to cell style
    // if(currentCell.style.textDecoration==='underline'){
    //     underlineBtn.style.backgroundColor=transparentBlue;
    // }
    // else{
    //     underlineBtn.style.backgroundColor=transparent;
    // }
    buttonHiglighter(boldBtn,"fontWeight","bold")
    buttonHiglighter(italicsBtn,"fontStyle","italic")
    buttonHiglighter(underlineBtn,"textDecoration","underline")

    //for text alignment
    buttonHiglighter(leftBtn,"textAlign","left")
    buttonHiglighter(centerBtn,"textAlign","center")
    buttonHiglighter(rightBtn,"textAlign","right")


    //A11 -> A,11  toh A1 ko alg alg kar degne toh heading and row ki sperate id mil jayegi then higlight karenge
    // A->cell.id[0]; its column id
    //11->cell.id(0).substring(1);   its row id
     //z100 -> "  "  ' '
    setHeaderColor(cell.id[0], cell.id.substring(1),'#ddddff');
    currentCellHeading.innerText=cell.id+' '+"selected";
    previousCell=currentCell;
}


function tableBodyGen(){
    //for creating a table row
    tBody.innerHTML='';
    for(let row=1;row<=ROWS; row++){
        const tr=document.createElement('tr');
        const th=document.createElement('th');
        th.innerText=row;
        th.setAttribute('id',row);
        tr.appendChild(th);

        colGen('td',tr,false,row)
        tBody.appendChild(tr);
    }

}

tableBodyGen();

if(localStorage.getItem(arrMatrix)){
    matrix=JSON.parse(localStorage.getItem(arrMatrix)[0]);
    renderMatrix();
}



//once you click any cell header get highlighted
//and when you clik on any other ccell the previous headers color go away


boldBtn.addEventListener("click",()=>{
    if(currentCell.style.fontWeight==='bold'){
        currentCell.style.fontWeight='normal';
        boldBtn.style.backgroundColor=transparent;
    }
    else{
        currentCell.style.fontWeight='bold';
        boldBtn.style.backgroundColor=transparentBlue;
    }
    updateObjectInMatrix();
})

italicsBtn.addEventListener("click",()=>{
    if(currentCell.style.fontStyle==='italic'){
        currentCell.style.fontStyle='normal';
        italicsBtn.style.backgroundColor=transparent;
    }
    else{
        currentCell.style.fontStyle='italic';
        italicsBtn.style.backgroundColor=transparentBlue;
    }
    updateObjectInMatrix();
})

underlineBtn.addEventListener("click",()=>{
    if(currentCell.style.textDecoration==='underline'){
        currentCell.style.textDecoration='none';
        underlineBtn.style.backgroundColor=transparent;
    }
    else{
        currentCell.style.textDecoration='underline';
        underlineBtn.style.backgroundColor=transparentBlue;
    }
    updateObjectInMatrix();
})


//give  text alignment->
leftBtn.addEventListener('click',()=>{
    if(currentCell.style.textAlign==='left'){
        currentCell.style.textAlign='justify';
        leftBtn.style.backgroundColor=transparent;
    }else{
        currentCell.style.textAlign='left';
        leftBtn.style.backgroundColor=transparentBlue;

        //new  modificaiton
        rightBtn.style.backgroundColor=transparent;
        centerBtn.style.backgroundColor=transparent;
    }
    updateObjectInMatrix();
})

centerBtn.addEventListener('click',()=>{
    // currentCell.style.textAlign='center'
    if(currentCell.style.textAlign==='center'){
        currentCell.style.textAlign='left';  //by default it is left
        centerBtn.style.backgroundColor=transparent
    }else{
        currentCell.style.textAlign='center'
        centerBtn.style.backgroundColor=transparentBlue;

        //new modification
        leftBtn.style.backgroundColor=transparent;
        rightBtn.style.backgroundColor=transparent;
    }
    updateObjectInMatrix();
})

rightBtn.addEventListener('click',()=>{
    // currentCell.style.textAlign='right'
    if(currentCell.style.textAlign==='right'){
        currentCell.style.textAlign='left';
        rightBtn.style.backgroundColor=transparent


    }else{
        currentCell.style.textAlign='right'
        rightBtn.style.backgroundColor=transparentBlue;


        //new modificaiton
        leftBtn.style.backgroundColor=transparent;
        centerBtn.style.backgroundColor=transparent;
    }
    updateObjectInMatrix();
})



fontStyleDropdown.addEventListener("change" ,(event)=>{
    // console.log(event.target.value)  === fontStyleDropdown.value  both are same thing; 
    // console.log(fontStyleDropdown.value);
    currentCell.style.fontFamily=fontStyleDropdown.value;
    updateObjectInMatrix();
})

fontSizeDropdown.addEventListener("change",()=>{
    currentCell.style.fontSize=fontSizeDropdown.value;
    updateObjectInMatrix();
})

bgColorInput.addEventListener("input",()=>{
    currentCell.style.backgroundColor=bgColorInput.value;
    updateObjectInMatrix();
})

fontColorInput.addEventListener('input',()=>{
    currentCell.style.color=fontColorInput.value
    updateObjectInMatrix();
})


//cell1 data -> cell2 data
//cell1 -> is empty in case  of cut
//cel1-> data is still saame in case of copy
//but diff is  cut data paste only onetime clipboard loose data after paste
// but in caseof copy we will pase it multible  time clipboard not lose 

cutBtn.addEventListener("click",()=>{

    lastPress="cut";
    cutCell={
        text:currentCell.innerText,
        style:currentCell.style.cssText,  //cssText is kind of inline css hame currentcell ke andar 
                                        //jo bhi css hai iss se woh aa jayega we could  use only currentCell.style but we dont want 
                                        //full our clipboard with empty style things 
    }
    currentCell.innerText="";
    currentCell.style.cssText="";
    updateObjectInMatrix();
})

copyBtn.addEventListener("click",()=>{
    lastPress="copy";
    cutCell={
        text:currentCell.innerText,
        style:currentCell.style.cssText,  //cssText is kind of inline css hame currentcell ke andar 
                                        //jo bhi css hai iss se woh aa jayega we could  use only currentCell.style but we dont want 
                                        //full our clipboard with empty style things 
    }

})


pasteBtn.addEventListener("click",()=>{
    currentCell.innerText=cutCell.text;
    currentCell.style=cutCell.style;   //currentCell.style.cssTextt=cutCell.style  both can we do it automatically manageble


    //i need to cleanup my cutCell object after paste
    if(lastPress==='cut'){
        cutCell=undefined;   //yha cutCell={}  me empty object dena se brower me cell  me undefined aayega for that we use here cutCell=undefined
        //beecause emptyobj.property  is undefined so i dont want it
    }
    updateObjectInMatrix();    

})


function genNextSheetButton(){
    const btn=document.createElement('button');
    numSheets++;
    currentSheet=numSheets;
    btn.innerText=`Sheet ${currentSheet}`;
    btn.setAttribute('id',`sheet-${currentSheet}`);
    btn.setAttribute('onclick','viewSheet(event)');
    buttonContainer.append(btn);


}


addSheetBtn.addEventListener("click",()=>{
    //next nextSheetBtn add karenge
    genNextSheetButton();
    //after this update Sheet No heading
    sheetNo.innerText=`Sheet No - ${currentSheet}`;

    //save Matrix-> save my 2D matrix because it contain my data
    saveMatrix();

    //clean Matrix->
    //1. 2D iteration and clean my object and 
    //2. create 2D  matrix again we choose 2nd option beccause we already have  code for this
    createNewMatrix();//short of use of cleaner function

    //clean html-> recreating a table instead of clean both required same effort
    tableBodyGen();


})


//save Matrix function
function saveMatrix(){
    //i should keep my arrMatrix inn localstorage because whenver user refresh i dont want my data isi losted
    if(localStorage.getItem(arrMatrix)){ //arrMatrix already exists in localStorage
        let tempArrMatix=JSON.parse(localStorage.getItem(arrMatrix));
        tempArrMatix.push(matrix);
        localStorage.setItem(arrMatrix ,JSON.stringify(tempArrMatix));
    }
    else{//when you adding sheet for the first time
        //creating array which we will store in localStorage
        let tempArrMatix=[matrix];
        localStorage.setItem(arrMatrix,JSON.stringify(tempArrMatix));

    }
    
}


//render matrix
function renderMatrix(){
    matrix.forEach((row)=>{
        row.forEach((cellObj)=>{
            if(cellObj.id){ //because if any update is any cell it must be id. id represting  something happen in cell
                // console.log(cellObj.id);
                let currentCell=document.getElementById(cellObj.id);
                currentCell.innerText=cellObj.text;
                currentCell.style=cellObj.style;
                // console.log(cellObj);
            }
        });
    });

}


//i have sheet1,sheet2,sheet3 button
//get matrix from localstorage and render it
function viewSheet(event){
    prevSheet=currentSheet; //currensheet par jane se pehle prevsheet me store kar denge jis se uska data dusri sheet par jane se gyab na ho


    // console.log(event);
    // console.log(event.target);
    // console.log(event.target.id); 
    //this is eventually use get matrix from my localstorage

    //id of button-> sheet-(number)===>so i wana get this number use it as a index(subtracting-1) and get matrix from localStorage
    //[matrix1,matrix2,matrix3]
    currentSheet=event.target.id.split('-')[1]; //Sheet-1 isko split karke ['sheet','1'] so access 1and subtract from 1 from converting 0 base indexing
    let matrixArr=JSON.parse(localStorage.getItem(arrMatrix));
    //i  have  updated my virtual memory here


    matrixArr[prevSheet-1]=matrix; //this will give me matrix of previous Sheet
    //so i want to save my matrix in the (localStorage) matrix array before moving nextsheet
    localStorage.setItem(arrMatrix,JSON.stringify(matrixArr)); //toh previous sheet ko localstorage me add kar denge


    matrix=matrixArr[currentSheet-1];
    //clean my html table  before render anything because i want empty table for rendering
    tableBodyGen();
    //now render the matrix in html
    renderMatrix();

}

