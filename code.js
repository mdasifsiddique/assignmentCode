//how to Run code in terminal
//node .\code.js --source=rawdata.txt --url=https://mobiux.in/assignment/sales-data.txt 


let minimist = require("minimist");
let args = minimist(process.argv);
let fs=require("fs");





//STEP1 READING THE RAW DATA

let stext=fs.readFileSync(args.source,"utf-8");


//STEP2 MAKING AN ARRAY OF OBJECTS

let arr=stext.split("\r\n");
let allInfo=[];


for(let i=0;i<arr.length;i++){
let newArray=arr[i].split(",");
    let info={
        date:"",
        product:"",
        price:"",
        qty:"",
        total:"",

    }

    info.date=newArray[0];
    info.product=newArray[1];
    info.price=newArray[2];
    info.qty=newArray[3];
    info.total=newArray[4];
    allInfo.push(info);
}


//STEP3 CREATING JSON

let allInfoJSON=JSON.stringify(allInfo);
fs.writeFileSync("allInfo.json",allInfoJSON,"utf-8");


//STEP4 ITEMS Array and filling the informations

let items = []; 
    for (let i = 0; i < allInfo.length; i++) {
        putItemInItemsArrayIfMissing(items, allInfo[i]);
    }

    

    for (let i = 0; i < allInfo.length; i++) {
        putInfoItemsArray(items, allInfo[i]);
    }

    let itemsJSON=JSON.stringify(items);
    fs.writeFileSync("items.json",itemsJSON,"utf-8");

//STEP5 DATA Array

let allProduct=[];

for(let i=0;i<items.length;i++){
    allProduct.push(items[i].itemName);
}

let monthsArray=[];
for (let i = 0; i < allInfo.length; i++) {
    putMOnthInMonthsArrayIfMissing(monthsArray, allInfo[i]);
}

//STEP6 QUANTITY & TOTAL PRICE Array FOR EACH MONTH FOR EACH ITEMS    
    
    let janQty=[];
    let febQty=[];
    let marQty=[];

    let janPrice=[];
    let febPrice=[];
    let marPrice=[];



    for(let i=0;i<items.length;i++)
    {
       let sum1=0;
       let sum2=0;
       let sum3=0;

       let sum1p=0;
       let sum2p=0;
       let sum3p=0;

       let p1=items[i];
       for(let j=0;j<p1.otherInfo.length;j++){

        if("2019-01-01"<=p1.otherInfo[j].OrderDate && p1.otherInfo[j].OrderDate<="2019-01-31"){
           sum1=sum1+parseInt(p1.otherInfo[j].ItemQty);
           sum1p=sum1p+parseInt(p1.otherInfo[j].TotalPrice);}

           else if("2019-02-01"<=p1.otherInfo[j].OrderDate && p1.otherInfo[j].OrderDate<="2019-02-28")
           {
            sum2=sum2+parseInt(p1.otherInfo[j].ItemQty);
            sum2p=sum2p+parseInt(p1.otherInfo[j].TotalPrice);}
            
            
           else{
            sum3=sum3+parseInt(p1.otherInfo[j].ItemQty);
            sum3p=sum3p+parseInt(p1.otherInfo[j].TotalPrice);
            }  


         }

           janQty.push(sum1);
           febQty.push(sum2);
           marQty.push(sum3);

           janPrice.push(sum1p);
           febPrice.push(sum2p);
           marPrice.push(sum3p);
    }


// STEP7 TOTAL SALE Array OF EACH ITEMS OF 3 MONTHS
    let totalSaleArray=[];
    for(let i=0;i<items.length;i++){
        let s=0;
        let p1=items[i];
        for(let j=0;j<p1.otherInfo.length;j++){
            s=s+parseInt(p1.otherInfo[j].TotalPrice);
        }
        totalSaleArray.push(s);
    }
    


//Step 8 Total sale of each month

let janSale=saleCal(janPrice);
let febSale=saleCal(febPrice);
let marSale=saleCal(marPrice);
let totalSale=saleCal(totalSaleArray);

//Step 9 finding all required solutions


//first qn
console.log("Total sales of the store of all 3 months is " + totalSale);

//second qn
console.log("Total sales of the store of Jan months is " + janSale);
console.log("Total sales of the store of Feb months is " + febSale);
console.log("Total sales of the store of Mar months is " + marSale);


//third qn

let mostSoldInJan=max(janQty);
let mostSoldInFeb=max(febQty);
let mostSoldInMar=max(marQty);

console.log(`Most Popular Item of Jan is ${allProduct[mostSoldInJan[0]]} having total sold qauntity ${mostSoldInJan[1]}`);

console.log(`Most Popular Item of Feb is ${allProduct[mostSoldInFeb[0]]} having total sold qauntity ${mostSoldInFeb[1]}`);

console.log(`Most Popular Item of March is ${allProduct[mostSoldInMar[0]]} having total sold qauntity ${mostSoldInMar[1]}`);


// 4th qn

let mostRevInJan=max(janPrice);
let mostRevInFeb=max(febPrice);
let mostRevInMar=max(marPrice);
console.log(`Most Reveune generated Item of Jan is ${allProduct[mostRevInJan[0]]} having total of rupees ${mostRevInJan[1]}`);

console.log(`Most Reveune generated Item of Feb is ${allProduct[mostRevInFeb[0]]} having total of rupees ${mostRevInFeb[1]}`);

console.log(`Most Reveune generated Item of Mar is ${allProduct[mostRevInMar[0]]} having total of rupees ${mostRevInMar[1]}`);



//5th qn


let dataArrayOfPopularJan=[];
let popularOfJan=allProduct[mostSoldInJan[0]];

for(let i=0;i<items.length;i++){

    if(popularOfJan==items[i].itemName){

        for(let j=0;j<items[i].otherInfo.length;j++){
            if("2019-01-01"<=items[i].otherInfo[j].OrderDate && items[i].otherInfo[j].OrderDate<="2019-01-31"){
            dataArrayOfPopularJan.push(items[i].otherInfo[j].ItemQty);}
        }
    }
}

let minJan=min(dataArrayOfPopularJan);
let maxjan=max(dataArrayOfPopularJan);
let lengthOfJan=dataArrayOfPopularJan.length;
let sumOfJan=sum(dataArrayOfPopularJan);
let resultjan=sumOfJan/lengthOfJan;

console.log(`The popular item of jan is ${popularOfJan} having minimum order of ${minJan}, maximum order of ${maxjan[1]} and average order of  ${resultjan}`);


//start of 2

let dataArrayOfPopularFeb=[];
let popularOfFeb=allProduct[mostSoldInFeb[0]];

for(let i=0;i<items.length;i++){

    if(popularOfFeb==items[i].itemName){

        for(let j=0;j<items[i].otherInfo.length;j++){
            if("2019-02-01"<=items[i].otherInfo[j].OrderDate && items[i].otherInfo[j].OrderDate<="2019-02-28"){
            dataArrayOfPopularFeb.push(items[i].otherInfo[j].ItemQty);}
        }
    }
}

let minFeb=min(dataArrayOfPopularFeb);
let maxFeb=max(dataArrayOfPopularFeb);
let lengthOfFeb=dataArrayOfPopularFeb.length;
let sumOfFeb=sum(dataArrayOfPopularFeb);
let resultFeb=sumOfFeb/lengthOfFeb;

console.log(`The popular item of feb is ${popularOfFeb} having minimum order of ${minFeb}, maximum order of ${maxFeb[1]} and average order of  ${resultFeb}`);


//start 3

let dataArrayOfPopularMar=[];
let popularOfMar=allProduct[mostSoldInMar[0]];

for(let i=0;i<items.length;i++){

    if(popularOfMar==items[i].itemName){

        for(let j=0;j<items[i].otherInfo.length;j++){
            if("2019-03-01"<=items[i].otherInfo[j].OrderDate && items[i].otherInfo[j].OrderDate<="2019-03-31"){
            dataArrayOfPopularMar.push(items[i].otherInfo[j].ItemQty);}
        }
    }
}

let minMar=min(dataArrayOfPopularMar);
let maxMar=max(dataArrayOfPopularMar);
let lengthOfMar=dataArrayOfPopularMar.length;
let sumOfMar=sum(dataArrayOfPopularMar);
let resultMar=sumOfMar/lengthOfMar;


console.log(`The popular item of march is ${popularOfMar} having minimum order of ${minMar}, maximum order of ${maxMar[1]} and average order of  ${resultMar}`);



//Step10 writing in text file all the outputs

var logger = fs.createWriteStream('outputResult.txt', {
  flags: 'a' // 'a' means appending (old data will be preserved)
})

logger.write("Total sales of the store of all 3 months is " + totalSale + "\n") 
logger.write("Total sales of the store of Jan months is " + janSale + "\n");
logger.write("Total sales of the store of Feb months is " + febSale + "\n");
logger.write("Total sales of the store of Mar months is " + marSale + "\n");

logger.write(`Most Popular Item of Jan is ${allProduct[mostSoldInJan[0]]} having total sold qauntity ${mostSoldInJan[1]} ` + "\n");

logger.write(`Most Popular Item of Feb is ${allProduct[mostSoldInFeb[0]]} having total sold qauntity ${mostSoldInFeb[1]}` + "\n");

logger.write(`Most Popular Item of March is ${allProduct[mostSoldInMar[0]]} having total sold qauntity ${mostSoldInMar[1]}` + "\n");


logger.write(`Most Reveune generated Item of Jan is ${allProduct[mostRevInJan[0]]} having total of rupees ${mostRevInJan[1]}`+ "\n");

logger.write(`Most Reveune generated Item of Feb is ${allProduct[mostRevInFeb[0]]} having total of rupees ${mostRevInFeb[1]}`+ "\n");

logger.write(`Most Reveune generated Item of Mar is ${allProduct[mostRevInMar[0]]} having total of rupees ${mostRevInMar[1]}`+ "\n");

logger.write(`The popular item of jan is ${popularOfJan} having minimum order of ${minJan}, maximum order of ${maxjan[1]} and average order of  ${resultjan}` +"\n");

logger.write(`The popular item of feb is ${popularOfFeb} having minimum order of ${minFeb}, maximum order of ${maxFeb[1]} and average order of  ${resultFeb}` + "\n");

logger.write(`The popular item of march is ${popularOfMar} having minimum order of ${minMar}, maximum order of ${maxMar[1]} and average order of  ${resultMar}` + "\n");











//FUNCTIONS
    function putItemInItemsArrayIfMissing(items, info) {
        let t1idx = -1;
        for (let i = 0; i < items.length; i++) {
            if (items[i].itemName == info.product) {
                t1idx = i;
                break;
            }
        }
    
        if (t1idx == -1) {
            items.push({
                itemName: info.product,
                otherInfo: []
            });
        }
    
    }


    function putInfoItemsArray(items, info) {
        let t1idx = -1;
        for (let i = 0; i < items.length; i++) {
            if (items[i].itemName == info.product) {
                t1idx = i;
                break;
            }
        }


    
        let p1 = items[t1idx];
        p1.otherInfo.push({
            OrderDate: info.date,
            ItemPrice: info.price,
            ItemQty: info.qty,
            TotalPrice: info.total,
        });
    
       
    }



    function putMOnthInMonthsArrayIfMissing(monthsArray, info) {
        let d1=info.date;
        let t1idx=-1;
        for(let i=0;i<monthsArray.length;i++){
            if(d1==monthsArray[i]){
                t1idx=i;
                break;
            }
        }

        if(t1idx==-1){
            monthsArray.push(d1);
        }
    }

    function saleCal(arr){
        let s=0;
        for(let i=0;i<arr.length;i++){
            s=s+arr[i];
        }
        return s;
    }


    function max(sample){
    let retArr=[];
    let maximum = sample[0]; 
    let index=0;
    for (let i=1; i<sample.length; i++) {
        if (sample[i] > maximum) {
            maximum = sample[i]; 
            index=i;
        }
    }

    retArr.push(index);
    retArr.push(maximum);

    return retArr;


    }


    function min(sample){
    let minimum = sample[0]; 
    let index=0;
    for (let i=1; i<sample.length; i++) {
        if (sample[i] < minimum) {
            minimum= sample[i]; 
            index=i;
        }
    }

  

    return minimum;


    }


    function sum(arr){
    let s=0;
    for(let i=0;i<arr.length;i++){
        s=s+parseInt(arr[i]);
    }

    return s;
    }



   
    
