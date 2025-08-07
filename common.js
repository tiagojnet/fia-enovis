const mapLang = {
  eng: engData,
  swe: sweData,
  pt: ptData,
};

var langData = engData;

function gotoPage(pageName) {
  var splitUrl = window.location.href.split("/");

  splitUrl[splitUrl.length - 1] = pageName;

  window.location.href = splitUrl.join("/");
}

function changeDropdown(control) {
  langData = mapLang[control.value];
  localStorage.setItem("lang", control.value);
  translateItems();
}

function translateItems() {
  const translatingElements = document.getElementsByClassName("translate");

  for (let element of translatingElements) {
    let key = element.getAttribute("data-translate");

    if (element.innerHTML.length > 1) {
      element.innerHTML = langData[key];
    }
  }

  if (document.getElementById("faq2-img")) {
    document.getElementById("faq2-img").src = langData["image"];
  }
}

function newForm() {
  gotoPage("index.html");
}
