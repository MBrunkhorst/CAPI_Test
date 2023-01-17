console.log ("Setting up CAPI");

function completeDisabled() {
    document.getElementById("first").toggleAttribute("disabled");
    buttonModel.set("button1Enabled", false);
}

function notComplete() {
    var element = document.getElementById("first");
    element.classList.toggle("complete");
    buttonModel.set("button1Complete", true);
}

function checkEvent() {
    buttonModel.set("button1Selected", true);
    simcapi.Transporter.triggerCheck();
}


document.getElementById("first").addEventListener("click", completeDisabled);
document.getElementById("first").addEventListener("click", notComplete);
document.getElementById("first").addEventListener("click", checkEvent);

var preventRecursion = false;
function capiHandler (name, value) {
    if (preventRecursion) {return;}

    preventRecursion = true;

    switch (name) {
        case 'button1Enabled': break;
        case 'button1Complete': break;
        case 'button1Selected': break;

        default:
            console.log (name, value);
            break;
    }
    preventRecursion = false;
}

var capi = {
    defaults: {
        button1Enabled: true,
        button1Complete: false,
        button1Selected: false,
    },

    exposeWith: {
        button1Enabled: {alias: "button1.Enabled"},
        button1Complete: {alias: "button1.Complete"},
        button1Selected: {alias: "button1.Selected"},

    }
}

var buttonModel = new simcapi.CapiAdapter.CapiModel (capi.defaults);

function addListener (key) {
    buttonModel.on ("change:" + key, (buttonModel, value) => {
        capiHandler (key, value); })
}

var item, key;
for (key in capi.defaults) {
    item = capi.exposeWith [key];

    simcapi.CapiAdapter.expose (key, buttonModel, item);
    addListener(key);
}

simcapi.Transporter.notifyOnReady();


