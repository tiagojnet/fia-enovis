const mapLang = {
  eng: engData,
  swe: sweData,
  pt: ptData,
};

var langData = engData;
var feno, percFeno, globalAge, patientsex;

function gotoPage(pageName) {
  var splitUrl = window.location.href.split("/");

  splitUrl[splitUrl.length - 1] = pageName;

  window.location.href = splitUrl.join("/");
}

function goBack() {
  gotoPage("index.html" + window.location.search);
}

function newForm() {
  gotoPage("index.html");
}

function copyValues() {
  var text = "";

  text +=
    langData["measured"] +
    " " +
    document.getElementById("outputFeno").innerHTML +
    "\n";
  text +=
    langData["height"] +
    " " +
    document.getElementById("outputHeight").innerHTML +
    "\n";
  text +=
    langData["age"] +
    " " +
    document.getElementById("outputAge").innerHTML +
    "\n";
  text +=
    langData["sex"] +
    " " +
    document.getElementById("outputSex").innerHTML +
    "\n";
  text +=
    langData["predicted"] +
    " " +
    document.getElementById("predictedFeno").innerHTML +
    "\n";
  text +=
    langData["percent predicted"] +
    " " +
    document.getElementById("percFeno").innerHTML +
    "\n";

  navigator.clipboard.writeText(text);
}

function changeDropdown(control) {
  langData = mapLang[control.value];
  localStorage.setItem("lang", control.value);
  translateItems();
}

function getPredictedFeno(sex, age, height) {
  let data = allData[sex][age];
  let mspline = data["m0"] - data["m1"];
  let predFeno = Math.exp(
    Math.exp(
      parseFloat(data["a0"]) +
        data["a1"] * Math.log(height) +
        data["a2"] * Math.log(age) +
        mspline,
    ),
  );

  return predFeno;
}

function getColor(percentageFeno) {
  if (percentageFeno < 122) {
    return "green";
  }

  if (percentageFeno < 143) {
    return "yellow";
  }

  if (percentageFeno < 178) {
    return "red";
  }

  return "dark-red";
}

function setFenoValues() {
  const urlParams = new URLSearchParams(window.location.search);

  feno = urlParams.get("feno");
  const height = urlParams.get("height");
  globalAge = urlParams.get("age");
  patientsex = urlParams.get("sex");

  if (
    !feno ||
    !height ||
    !globalAge ||
    !patientsex ||
    feno < 5 ||
    feno > 300 ||
    isNaN(feno) ||
    height < 80 ||
    height > 250 ||
    isNaN(height) ||
    globalAge < 5 ||
    globalAge > 80 ||
    isNaN(globalAge) ||
    (patientsex != "Male" && patientsex != "Female")
  ) {
    gotoPage("index.html");
  }

  // Compute output
  const predFeno = getPredictedFeno(patientsex, globalAge, height);
  percFeno = (100 * feno) / predFeno;
  let widthPercentage = (Math.round(percFeno) * 100) / 300;

  document.getElementById("outputFeno").innerHTML = feno + " ppb";
  document.getElementById("outputHeight").innerHTML = height + " cm";
  document.getElementById("outputAge").innerHTML =
    globalAge + langData["age units"];
  document.getElementById("outputSex").innerHTML = patientsex;

  document.getElementById("measuredFeno").innerHTML = feno + " ppb";
  document.getElementById("predictedFeno").innerHTML =
    Math.round(predFeno) + " ppb";
  document.getElementById("percFeno").innerHTML = Math.round(percFeno) + "%";

  if (widthPercentage > 100) {
    widthPercentage = 100;
    document.getElementById("floatingPerc").innerHTML = "> 300%";
  } else {
    document.getElementById("floatingPerc").innerHTML =
      Math.round(percFeno) + "%";
  }

  document.getElementById("line").style.width = widthPercentage + "%";
  document.getElementById("floatingPerc").style.paddingLeft =
    widthPercentage - 5 + "%";

  const valueAdj = percFeno > 122 ? langData["elevated"] : langData["normal"];

  document.getElementById("main-msg").innerHTML =
    langData["mainMsg1"] +
    feno +
    " ppb (" +
    Math.round(percFeno) +
    "%) " +
    langData["mainMsg2"] +
    " " +
    valueAdj;

  const color = getColor(percFeno);
  document.getElementsByClassName("answer-" + color)[0].style.display = "block";
}

function afterLoading() {
  var language = localStorage.getItem("lang");

  if (language) {
    langData = mapLang[language];
    document.querySelector("select").value = language;
  }

  setFenoValues();
  translateItems();
  document.querySelector("body").style.display = "block";
}

function translateItems() {
  const translatingElements = document.getElementsByClassName("translate");

  for (let element of translatingElements) {
    let key = element.getAttribute("data-translate");

    if (element.innerHTML.length > 1) {
      element.innerHTML = langData[key];
    }
  }

  if (document.getElementById("main-msg")) {
    const valueAdj = percFeno > 122 ? langData["elevated"] : langData["normal"];
    document.getElementById("main-msg").innerHTML =
      langData["mainMsg1"] +
      feno +
      " ppb (" +
      Math.round(percFeno) +
      "%) " +
      langData["mainMsg2"] +
      " " +
      valueAdj +
      langData["mainMsg3"];
  }

  if (document.getElementById("outputAge")) {
    document.getElementById("outputAge").innerHTML =
      globalAge + langData["age units"];
  }

  if (document.getElementById("outputSex")) {
    document.getElementById("outputSex").innerHTML =
      langData["patientsex"][patientsex];
  }

  if (document.getElementById("faq2-img")) {
    document.getElementById("faq2-img").src = langData["image"];
  }
}

function printPage() {
  document.getElementById("outputDate").innerHTML = new Date(
    Date.now(),
  ).toLocaleString();
  document.getElementById("date-row").style.display = "block";
  window.print();
}

window.onload = afterLoading;
