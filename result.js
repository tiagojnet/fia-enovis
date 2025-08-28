var feno, percFeno, globalAge, patientsex;

function goBack() {
  gotoPage("index.html" + window.location.search);
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
  initPage({ select: 'select', withFenoValues: true });
}

function printPage() {
  document.getElementById("outputDate").innerHTML = new Date(
    Date.now(),
  ).toLocaleString();
  document.getElementById("date-row").style.display = "block";
  window.print();
}

window.onload = afterLoading;
