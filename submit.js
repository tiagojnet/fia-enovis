function submit () {
    // Get form values
    let feno = document.getElementById("feno").value;
    const height = document.getElementById("height").value;
    const age = document.getElementById("age").value;
    const patientsex = document.querySelectorAll('input[name="patientsex"]:checked')[0].value;

    if (checkErrors(height, age, feno)) {
        return;
    }

    if (feno.replace(/\s/g,'') == "<5") {
        feno = 5;
    }

    gotoPage(`result.html?feno=${feno}&height=${height}&age=${age}&sex=${patientsex}`);
}

function checkErrors(height, age, feno) {

    document.getElementById("fenoError").innerHTML = "";
    document.getElementById("heightError").innerHTML = "";
    document.getElementById("ageError").innerHTML = "";

    var hasError = false;

    if (feno.replace(/\s/g,'') != "<5" && (feno < 5 || feno > 300 || isNaN(parseFloat(feno)))) {
        document.getElementById("fenoError").innerHTML = langData['feno error'];
        hasError = true;
    }

    if (height < 80 || height > 250 || isNaN(parseInt(height))) {
        document.getElementById("heightError").innerHTML = langData['height error'];
        hasError = true;
    }

    if (age < 5 || age > 99 || isNaN(parseInt(age)) ) {
        document.getElementById("ageError").innerHTML = langData['age error'];
        hasError = true;
    }

    return hasError;
}

function clearForm () {
    // Get form values
    document.getElementById("feno").value= "";
    document.getElementById("height").value= "";
    document.getElementById("age").value= "";
}

function setUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);

    const feno = urlParams.get('feno');
    const height = urlParams.get('height');
    const age = urlParams.get('age');
    const patientsex = urlParams.get('sex');

    if (feno) {
        document.getElementById('feno').value = feno;
    }

    if (height) {
        document.getElementById('height').value = height;
    }

    if (age) {
        document.getElementById('age').value = age;
    }

    if (patientsex && document.getElementById(patientsex)) {
        document.getElementById(patientsex).checked = true;
    }
}

function afterLoading() {
    initPage({ select: 'select', withUrlParams: true });
}

window.onload = afterLoading;
