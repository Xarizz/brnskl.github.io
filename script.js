let accounts;
let accountList;
function checkIfExtensionInstalled() {
    const extensionId = "gopjiknjldjjlmdnkhlekkcblcjccjbe";
    const checkConnection = chrome.runtime.connect(extensionId);

    checkConnection.postMessage({ message: "checkIfInstalled" });
    checkConnection.onMessage.addListener(function (response) {
        if (response.message === "extensionInstalled") {
            console.log("Extension is installed.");
        } else {
            console.log("Extension is not installed.");
        }
    });
}
function setCookie(name, value, days) {
    let expires = '';
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = '; expires=' + date.toUTCString();
    }
    document.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/';
}

function getCookie(name) {
    const value = '; ' + document.cookie;
    const parts = value.split('; ' + name + '=');
    if (parts.length === 2) return decodeURIComponent(parts.pop().split(';').shift());
}

function saveArrayToCookie(array) {
    const arrayJSON = JSON.stringify(array);
    setCookie('steamAccs', arrayJSON, 7);
}

function getArrayFromCookie() {
    const arrayJSON = getCookie('steamAccs');
    try {
        const array = JSON.parse(arrayJSON);
        return array || [];
    } catch (error) {
        return [];
    }
}
function refreshAccountList() {
    accountList.innerHTML = '';

    for (let i = 0; i < accounts.length; i++) {
        let accountItem = document.createElement('p');
        accountItem.textContent = accounts[i];
        accountList.appendChild(accountItem);
    }
}

function toggleHistory() {
    accountList.classList.toggle('hidden');
    refreshAccountList();
}

function addAccount(newAccount) {
    accounts.push(newAccount);
    saveArrayToCookie(accounts);
    refreshAccountList();
}

const steamAccs = [];

document.getElementById("backgroundMusic").volume = 0.1;

document.addEventListener('DOMContentLoaded', () => {
    checkIfExtensionInstalled()
    accountList = document.getElementById('accountList');
    accounts = getArrayFromCookie();
    if (accounts.length > 0) {
        accountList.classList.add('visible');
    }
    refreshAccountList();

    document.getElementById('generate').addEventListener('click', () => {
        function gens(length) {
            const charset = 'abcdfeghijklmnopQRSTUVWXYZ0987654321';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += charset.charAt(Math.floor(Math.random() * charset.length));
            }
            return result;
        }

        const login = gens(8) + "BRNSKL";
        const pass = gens(8) + "BRNSKL";
        addAccount(`log: ${login} pas: ${pass}`)

        steamAccs.push(`log: ${login} pas: ${pass}`);

        const arrayJSON = JSON.stringify(steamAccs);
        localStorage.setItem('steamAccs', arrayJSON);

        const message = {
            action: 'generateSteamAcc',
            login: login,
            password: pass
        };

        window.postMessage(message, "*");
    })
});