let counter = () => {
    let result = 0;
    let i = 1;
    while (i <= 51) {
        result += i;
        i++;
    }
    console.log(result);
}

function factor(inp) {
    let result = 1;
    for (let i = 1; i <= inp; i++) {
        result *= i;
    }
    return result;
}

function checkMonth(month) {
    switch (month) {
        case 1:
            console.log("January");
            break;
        case 2:
            console.log("February");
            break;
        case 3:
            console.log("March");
            break;
        case 4:
            console.log("April");
            break;
        case 5:
            console.log("May");
            break;
        case 6:
            console.log("June");
            break;
        case 7:
            console.log("July");
            break;
        case 8:
            console.log("August");
            break;
        case 9: 
            console.log("September");
            break;
        case 10:
            console.log("October");
            break;
        case 11:
            console.log("November");
            break;
        case 12:
            console.log("December");
            break;
        default:
            console.log("Error");
            break;
    }
}

function evenArray(arr) {
    let sum = 0;
    arr.forEach(element => {
       sum += (element % 2 === 0) ? element : 0;
    });
    return sum;
}

const countVowels = (str) => {
    const vowels = "aeiouAEIOU";
    let count = 0;
    for (let ch of str) {
        if (vowels.includes(ch)) count++;
    }
    return count;
};

function power(base, exponent) {
    return base ** exponent;
}