'use strict'

//-------------------Global variable-------------------
var acidTable;
var baseTextAreaSize;

//-------------------References-------------------
var btn_translate;
var txt_input;
var txt_output;
var p_errorField;
var select_inputType;
var select_outputType;

//-------------------Loading function-------------------

window.addEventListener("load", load);

function load() {
    { // set references, made to be hidden
        btn_translate = document.getElementById('translate');
        txt_input = document.getElementById('inputText');
        txt_output = document.getElementById('outputText');
        p_errorField = document.getElementById('errorField');
        select_inputType = document.getElementById('inputType');
        select_outputType = document.getElementById('outputType');
    }

    btn_translate.addEventListener("click", translateAcid);

    baseTextAreaSize = txt_input.offsetHeight * 2;
    updateTextSize();
    document.addEventListener("keydown", updateTextSize);
    txt_input.addEventListener("input", updateTextSize);
    txt_output.addEventListener("input", updateTextSize);

    init();
}

//-------------------Core functions-------------------

function init() {
    //Creation of the acid table
    //0 : name
    //1 : monoLetter
    //2 : triLetter
    acidTable = [
        ["Alanine", "A", "Ala"],
        ["Arginine", "R", "Arg"],
        ["Acide Aspartique", "D", "Asp"],
        ["Acide_Aspartique", "D", "Asp"],
        ["Aspartique", "D", "Asp"],
        ["Asparagine", "N", "Asn"],
        ["Cystéine", "C", "Cys"],
        ["Glutamine", "Q", "Gln"],
        ["Acide Glutamique", "E", "Glu"],
        ["Acide_Glutamique", "E", "Glu"],
        ["Glutamique", "E", "Glu"],
        ["Glycine", "G", "Gly"],
        ["Histidine", "H", "His"],
        ["Isoleucine", "I", "Ile"],
        ["Leucine", "L", "Leu"],
        ["Lysine", "K", "Lys"],
        ["Méthionine", "M", "Met"],
        ["Phénylalanine", "F", "Phe"],
        ["Proline", "P", "Pro"],
        ["Sélénocystéine", "U", "Sec"],
        ["Sérine", "S", "Ser"],
        ["Thréonine", "T", "Thr"],
        ["Tryptophane", "W", "Trp"],
        ["Tyrosine", "Y", "Tyr"],
        ["Valine", "V", "Val"]
    ]
}

function translateAcid() {
    var res = "";
    p_errorField.setAttribute("hidden", "");

    if(txt_input.value.length !== 0) parseString(txt_input.value).forEach(element => {
        var translation = findTranslation(element);
        if(translation.search(/[\u{1D5EE}-\u{1D607}|\u{1D56C}-\u{1D585}]/gu) != -1) {
            txt_input.value = cleanString(txt_input.value).replace(element, stringToBold);
            p_errorField.removeAttribute("hidden");
        }
        res += translation;
        res += " ";
    });
    res = res.trim();
    txt_output.value = res;

    updateTextSize();

    txt_output.textContent.set
}

function findTranslation(string){
    if(typeof string !== "string") throw new Error('parameter type error,   expected : string   receive : ' + (typeof string));

    //Get the number
    var regex = /\d+/i;
    var number = string.match(regex);
    string = string.replace(number, '');
    if(number == null) number = "";

    string = cleanString(string);
    for(var i = 0; i < acidTable.length; i++) {
        if(cleanString(acidTable[i][select_inputType.value]) === string) {
            return number + acidTable[i][select_outputType.value];
        }
    }
    return `Acid_"${number + string}"_not_found`.replace(/[A-Za-z]/g, charToBold);
}

//-------------------Functionnal functions-------------------

function parseString(string) {
    if(typeof string !== "string") throw new Error('parameter type error,   expected : string   receive : ' + (typeof string));

    string = cleanString(string);

    if(select_inputType.value == 0) var regex = /\b(?!acide)\w+\b/ig; //get all words, except acide
    else if(select_inputType.value == 1) var regex = /\d*[a-zA-Z]/ig; //get all letters, numbers are put with matching letter
    else if(select_inputType.value == 2) var regex = /\d*[a-zA-Z]{1,3}/ig; //get groups of 3 letters, numbers are put with matching group
    
    var res = string.match(regex);
    res.forEach(element => cleanString);
    
    return res;
}

function cleanString(string) {
    if(typeof string !== "string") throw new Error('parameter type error,   expected : string   receive : ' + (typeof string));

    string = string.toLowerCase();
    string = string.normalize('NFD').replace(/\p{Diacritic}/gu, ''); //remove accents and special char

    var regex = /[ ,;.:!?\/\|]+/g; //convert any separator into one
    string = string.replaceAll(regex, ' ');

    regex = /(?<!\d *)(\d)/g //number not preceded by number
    string = string.replaceAll(regex, ' $1');

    regex = /(?<=\d) /g; //space preceded by number
    string = string.replaceAll(regex, '');

    string = string.trim();

    return string;
}

function updateTextSize() {
    txt_input.style.height = "5px";
    txt_output.style.height = "5px";

    var newHeight = Math.max(baseTextAreaSize, txt_input.scrollHeight + 5, txt_output.scrollHeight + 5);
    txt_input.style.height = newHeight + "px";
    txt_output.style.height = newHeight + "px";
}

function stringToBold(string) {
    return string.replace(/[A-Za-z]/g, charToBold);
}

function charToBold (char) {
    let diff;
    if (/[A-Z]/.test (char)) {
        diff = "𝗔".codePointAt(0) - "A".codePointAt(0);
    }
    else {
        diff = "𝗮".codePointAt(0) - "a".codePointAt(0);
    }
    return String.fromCodePoint(char.codePointAt(0) + diff);
}