const mapLang = {
  eng: engData,
  swe: sweData,
  pt: ptData,
};

var langData = ptData;

function gotoPage(pageName) {
  var splitUrl = window.location.href.split("/");

  splitUrl[splitUrl.length - 1] = pageName;

  window.location.href = splitUrl.join("/");
}

function getInitialLanguage(selectElOrSelector) {
  var language = localStorage.getItem('lang') || 'pt';
  // Normalize to a known key; default to pt
  if (!mapLang[language]) language = 'pt';
  langData = mapLang[language];

  try {
    var selectEl = typeof selectElOrSelector === 'string'
      ? document.querySelector(selectElOrSelector)
      : selectElOrSelector;
    if (selectEl) selectEl.value = language;
  } catch (e) {
    // no-op; select might not exist on all pages
  }

  // Persist default on first visit for consistency across pages
  if (!localStorage.getItem('lang')) {
    localStorage.setItem('lang', language);
  }

  return language;
}

function changeDropdown(control) {
  langData = mapLang[control.value];
  localStorage.setItem("lang", control.value);
  translateItems();
}

function initPage(options) {
  const opts = options || {};
  const select = opts.select || 'select';
  getInitialLanguage(select);

  if (opts.withUrlParams && typeof window.setUrlParams === 'function') {
    window.setUrlParams();
  }

  if (opts.withFenoValues && typeof window.setFenoValues === 'function') {
    window.setFenoValues();
  }

  translateItems();

  try {
    document.querySelector('body').style.display = 'block';
  } catch (e) {
    // ignore if body not present yet
  }
}

function translateItems() {
  const translatingElements = document.getElementsByClassName("translate");

  for (let element of translatingElements) {
    const key = element.getAttribute("data-translate");
    if (key && typeof langData[key] !== 'undefined') {
      element.innerHTML = langData[key];
    }
  }

  // Page-specific elements handled defensively
  if (document.getElementById("faq2-img")) {
    document.getElementById("faq2-img").src = langData["image"];
  }

  if (typeof percFeno !== 'undefined' && typeof feno !== 'undefined') {
    const valueAdj = percFeno > 122 ? langData["elevated"] : langData["normal"];
    const mainMsg =
      langData["mainMsg1"] +
      feno +
      " ppb (" +
      Math.round(percFeno) +
      "%) " +
      langData["mainMsg2"] +
      " " +
      valueAdj +
      (langData["mainMsg3"] || "");
    if (document.getElementById("main-msg")) {
      document.getElementById("main-msg").innerHTML = mainMsg;
    }
  }

  if (typeof globalAge !== 'undefined' && document.getElementById("outputAge")) {
    document.getElementById("outputAge").innerHTML = globalAge + (langData["age units"] || "");
  }

  if (typeof patientsex !== 'undefined' && document.getElementById("outputSex")) {
    const sexMap = langData["patientsex"] || {};
    document.getElementById("outputSex").innerHTML = sexMap[patientsex] || patientsex;
  }
}

function newForm() {
  gotoPage("index.html");
}
