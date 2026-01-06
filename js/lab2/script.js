let arr = [2,4,5,6,1,2,7,9];
// let arr = [6,1,4,7,-10,7,2];
function MinMax(arr) {
    let min = Infinity;
    let max = -Infinity;
    let result = [];
    for (let i = 0; i < arr.length; i++) {
        if (min > arr[i]) {
            min = arr[i];
        }
        if (max < arr[i]) {
            max = arr[i];
        }
    }
    result.push(min,max);
    return result;
}
console.log(arr);
console.log(MinMax(arr));
function CompareGuys(guy1,guy2) {
    console.log(guy1);
    console.log(guy2);
    let response1 = guy1.number > guy2.number ? "Guy1 has greater number than Guy2" : "Guy2 has greater number than Guy1";
    let response2 = guy1.prop2 > guy2.prop2 ? "Guy1 has greater prop2 than Guy2" : "Guy2 has greater prop2 than Guy1";
    console.log(response1);
    console.log(response2);
}
let obj1 = {
    number: 1,
    prop2: "Guy"
}

let obj2 = {
    number: 7,
    prop2: "Abc"
}

CompareGuys(obj1,obj2);

function CheckRange() {
    let inputNode = document.getElementById("number");
    let inputNumber = inputNode.value;
    let lowerRangeNode = document.getElementById("low-range");
    let upperRangeNode = document.getElementById("upper-range");
    let low = lowerRangeNode.value;
    let up = upperRangeNode.value;
    let response;
    if (!inputNode || !low || !up) {
        response = "Please, enter all values!";
        return;
    }
    response = (inputNumber >= low) && (inputNumber <= up) ? "In range!" : "Not in range!";
    document.querySelector("h2").innerHTML = response;
}
let btn = document.getElementById("btn");
btn.addEventListener("click", CheckRange);
let display = document.getElementById("grade-display");
let gradeNode = document.getElementById("grade-input");
let grade = Number(gradeNode.value);
function updateGrade() {
    grade = Number(document.getElementById("grade-input").value);
    switch(grade) {
        case 1:
        case 2:
            display.innerHTML = "Незадовільно";
            break;
        case 3:
            display.innerHTML = "Задовільно";
            break;
        case 4:
            display.innerHTML = "Добре";
            break;
        case 5:
            display.innerHTML = "Відмінно";
            break;
        default:
            display.innerHTML = "Invald value!";
            break;
    }
}
gradeNode.addEventListener("change", updateGrade);

let monthNode = document.getElementById("month-input");
function checkSeason() {
    let month = Number(monthNode.value);
    let display = document.getElementById("season-display");
    let response = "Plese select something!";
    if (month) {
        if (month <= 2 || month == 12) {
            response = "It's Winter!";
        } else if (month <= 5) {
            response = "It's Spring!";
        } else if (month <= 8) {
            response = "It's Summer!";
        } else if (month <= 11) {
            response = "It's Autumn!";
        }
    }
    display.innerHTML = response;
}
monthNode.addEventListener("change", checkSeason);




