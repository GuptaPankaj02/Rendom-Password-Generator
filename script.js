// Featching All Elements
const inputSlider = document.querySelector(".slider");
const dataLength = document.querySelector("[lengthNumber]");
const passworddisplay = document.querySelector("[data-PasswordDisplay]");
const copyBtn = document.querySelector(".cbtn");
const copyMsg = document.querySelector("[data-copymsg]");
const uppercase = document.querySelector("#uppercase");
const lowercase = document.querySelector("#lowercase");
const numbers = document.querySelector("#numbers");
const symbols = document.querySelector("#Symbols");
const indicator = document.querySelector(".indicator");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const generateButton = document.querySelector(".Generate-btn")
const symbol = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';



// Initially
let password = "";
let passwordLength = 10;
let checkCount = 0;
sliderHandle();
setIndicator("#ccc");



// set the password length
function sliderHandle() {
    inputSlider.value = passwordLength;
    dataLength.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}



// set the indicator color
function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}


function getRendomInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


function generateRandomNumber() {
    return getRendomInteger(0, 9);
}


function generateLowerCase() {
    return String.fromCharCode(getRendomInteger(97, 123));
}


function generateUpperCase() {
    return String.fromCharCode(getRendomInteger(65, 91));
}


function generateSymbol() {
    const rendom = getRendomInteger(0, symbol.length);
    return symbol.charAt(rendom);
}


function calculateStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercase.checked) hasUpper = true;
    if (lowercase.checked) hasLower = true;
    if (numbers.checked) hasNum = true;
    if (symbols.checked) hasSym = true;

    if (hasUpper && hasLower && hasNum && hasSym && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0")
    } else {
        setIndicator("#f00")
    }
}



async function copyContent() {
    try {
        await navigator.clipboard.writeText(passworddisplay.value);
        copyMsg.innerText = "Copied";
    } catch (error) {
        copyMsg.innerText = "Failed";
    }
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 3000);
}



function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}



function handleCheckBox() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked)
            checkCount++;
    });

    //special condition
    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        sliderHandle();
    }
}



allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBox);
});

inputSlider.addEventListener('input', (eve) => {
    passwordLength = eve.target.value;
    sliderHandle();
})



copyBtn.addEventListener('click', () => {
    if (passworddisplay.value)
        copyContent();

    // if(passwordlength > 0)
    // copyContent();
})



generateButton.addEventListener('click', () => {
    if (checkCount == 0)
        return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount
        sliderHandle();
    }


    password = "";


    let funcArray = [];


    if (uppercase.checked)
        funcArray.push(generateUpperCase);

    if (lowercase.checked)
        funcArray.push(generateLowerCase);

    if (numbers.checked)
        funcArray.push(generateRandomNumber);

    if (symbols.checked)
        funcArray.push(generateSymbol);



    //compulsary addition for checkbox whose checked
    for (let i = 0; i < funcArray.length; i++) {
        password += funcArray[i]();
    }



    // remaining addition
    for (let i = 0; i < passwordLength - funcArray.length; i++) {
        let rendomInd = getRendomInteger(0, funcArray.length);
        password += funcArray[rendomInd]();
    }



    // shuffling the password

    password = shufflePassword(Array.from(password));

    // show UI
    passworddisplay.value = password;


    calculateStrength();
})