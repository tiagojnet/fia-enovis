function afterLoading() {
    var language = localStorage.getItem('lang');

    if (language) {
        langData = mapLang[language];
        document.querySelector('select').value = language;
    }

    translateItems();
    document.querySelector('body').style.display = 'block';
}

window.onload = afterLoading;