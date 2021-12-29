
let friends = new Array();
let favourites = new Array();
let settingsData = new Settings();

let versionPlugin = "1.1.0";
let linkToAuthor = "https://www.youtube.com/channel/UC-X7_-qML3aXqrDQ2UKLFkA";

function Friend(userEl) {
    this.element = userEl;
    this.nicknamePony = function () {
        return userEl.getElementsByClassName("friends-item-name")[0].textContent.toLowerCase();
    }
    this.name = function () {
        return userEl.getElementsByClassName("text-muted friends-item-account")[0].textContent;
    }

    this.addFavourite = function () {
        this.addVisualFavourite();

        favourites.push(this.name());
        chrome.storage.local.set({ "MPPL-Favourites": favourites }, function () {
            console.log("MPPL Loaded data for favourites (Added)");
        });
    }
    this.removeFavourite = function () {
        userEl.getElementsByClassName("MPPL-favouriteStar")[0].classList.remove("active");
        userEl.getElementsByClassName("MPPL-addFav")[0].classList.remove("active")

        for (let i = 0; i < favourites.length; i++) {
            if (favourites[i] == this.name()) {
                favourites.splice(i, 1);
                break;
            }
        }

        chrome.storage.local.set({ "MPPL-Favourites": favourites }, function () {
            console.log("MPPL Loaded data for favourites (Removed)");
        });
    }
    this.addVisualFavourite = function () {
        userEl.getElementsByClassName("MPPL-favouriteStar")[0].classList.add("active");
        userEl.getElementsByClassName("MPPL-addFav")[0].classList.add("active");
    }
}
function Settings()
{
    this.darkTheme = false;
    this.squareImage = false;

    this.setData = function()
    {
        chrome.storage.local.set({ "MPPL-settings-data": settingsData }, function () {
            console.log("MPPL Loaded data for settings (Added)");
        });
    }
    this.applySettings = function()
    {
        let body = document.body;
        if(this.darkTheme)
            body.classList.add("MPPL-S-DarkTheme");
        else
            body.classList.remove("MPPL-S-DarkTheme");

        if(this.squareImage)
            body.classList.add("MPPL-S-square-portrait");
        else
            body.classList.remove("MPPL-S-square-portrait");
        console.log(settingsData);
        console.log("Settings applied");
    }
}

try {
    chrome.storage.local.get(["MPPL-Favourites"], function (items) {
        favourites = items["MPPL-Favourites"];
    });
}
catch
{
    console.log("Not found data");
}
try {
    console.log("Checking....");
    chrome.storage.local.get(["MPPL-settings-data"], function (items) {
        settingsData.darkTheme = items["MPPL-settings-data"].darkTheme;
        settingsData.squareImage = items["MPPL-settings-data"].squareImage;

        settingsData.applySettings();
    });
}
catch
{
    console.log("Not found data");
    standartSetting();
}

function standartSetting()
{
    settingsData = new Settings();
    settingsData.setData();
    settingsData.applySettings();
}

$(document).ready(function () {

    let footerAppend = '<div class="app-version">Plugin Pony Town UI: <b>' + versionPlugin +'</b><div class="text-nowrap d-inline d-sm-block">by <a target="_blank" href="'+ linkToAuthor +'">Mariana Ponyriama</a></div></div>';
    $("footer").append(footerAppend);
    

    $(document).on("DOMNodeInserted", function (e) {
        if($(e.target).is("footer"))
        {
            $(e.target).append(footerAppend);
        }
        if($(e.target).hasClass("modal"))
        {
            $("settings-modal .nav").append("<button id='MPPL-setting-plugin' class='btn-unstyled nav-link'>Plugin</button>")

            $("#MPPL-setting-plugin").click(function()
            {
                $("body").append('<div class="MPPL-container"><div class="MPPL-settings"><div class="MPPL-modal-header">Settings for Plugin</div><div class="MPPL-modal-content"></div><div class="MPPL-modal-footer"><div class="MPPL-left"><div class="MPPL-version-setting">Version '+ versionPlugin +' by <a href="'+ linkToAuthor +'" target="_blank">Mariana Ponyriama</a></div></div><div class="MPPL-right"><button type="button" class="btn" id="MPPL-reset-plugin">Reset</button><button type="button" class="btn" id="MPPL-close-plugin">Close</button></div></div></div></div>');

                $("#MPPL-close-plugin").click(function()
                {
                    $(".MPPL-container").remove();
                });
                $("#MPPL-reset-plugin").click(function()
                {
                    alert("Settings was set as default");
                    standartSetting();
                    $(".MPPL-container").remove();
                });

                // Тёмная тема
                itemSettingsCheckbox("darkTheme", "Dark mode", function()
                {
                    settingsData.darkTheme = true;
                    settingsData.setData();
                    settingsData.applySettings();
                }, function(){
                    settingsData.darkTheme = false;
                    settingsData.setData();
                    settingsData.applySettings();
                }, settingsData.darkTheme, "Turns on dark mode in the game interface");

                // Закруглённость
                itemSettingsCheckbox("squarePortrait", "Square portrait", function()
                {
                    settingsData.squareImage = true;
                    settingsData.setData();
                    settingsData.applySettings();
                }, function(){
                    settingsData.squareImage = false;
                    settingsData.setData();
                    settingsData.applySettings();
                }, settingsData.squareImage, "Rounded square character's icons");

                function itemSettingsCheckbox(id, label, func, unfunc, settedValue, sublabel = "")
                {
                    $(".MPPL-modal-content").append('<div class="item" id="'+ id + '-item' +'"><div class="top"><input type="checkbox" name="" id="'+ id +'"><label for="'+ id +'">'+ label +'</label></div></div>');
                    if(sublabel != "")
                    {
                        $(document.getElementById(id + "-item")).append('<div class="subtop"><label for="'+ id +'">'+ sublabel +'</label></div>');
                    }
                    if(settedValue)
                    {
                        $(document.getElementById(id)).attr('checked', true);
                    }
                    else
                    {
                        $(document.getElementById(id)).attr('checked', false);
                    }
                    $(document.getElementById(id)).click(function()
                    {
                        if (document.getElementById(id).checked) {
                              func();
                          } else {
                              unfunc();
                          }
                    })
                }
            });
        }

        if ($(e.target).hasClass("friends-dropdown-menu")) {
            friends = new Array();
            searchFavourite = false;

            $(".friends-dropdown-menu").append("<input id='MPPL-searchFriend' class='MPPL form-control' type='text' placeholder='Search'>");

            $("#MPPL-searchFriend").keyup(function (e) {

                let value = $("#MPPL-searchFriend").val().toLowerCase();

                if (value == "") {
                    for (let i = 0; i < friends.length; i++) {
                        $(friends[i].element).removeClass("hide");
                    }
                }
                else {
                    for (let i = 0; i < friends.length; i++) {
                        let char1 = friends[i].nicknamePony().includes(value);
                        let char2 = friends[i].name().toLowerCase().includes(value);

                        if (char1 || char2) {
                            $(friends[i].element).removeClass("hide");
                        }
                        else {
                            $(friends[i].element).addClass("hide");
                        }
                    }
                }
            });

            $(".friends-dropdown-menu").append("<div id='MPPL-favouriteFriends' class='MPPL'><div class='MPPL-all-friends MPPL-friends active'>Все</div><div class='MPPL-favourite MPPL-friends'>Избранное</div></div>");

            $(".MPPL-friends").click(function (e) {
                $(".MPPL-friends").removeClass("active");
                $(e.target).addClass("active");

                $("#MPPL-searchFriend").prop("disabled", true);
            });
            $(".MPPL-all-friends").click(function (e) {
                for (let i = 0; i < friends.length; i++) {
                    $(friends[i].element).removeClass("hide");
                }
                $("#MPPL-searchFriend").removeAttr("disabled");
            });



            $(".MPPL-favourite").click(function (e) {
                frie: for (let i = 0; i < friends.length; i++) {
                    fav: for (let s = 0; s < favourites.length; s++) {
                        if (friends[i].name() == favourites[s]) {
                            $(friends[i].element).removeClass("hide");
                            continue frie;
                        }
                    }
                    $(friends[i].element).addClass("hide");
                }
            });
        }

        if ($(e.target).hasClass("friends-item")) {
            let friend = new Friend(e.target);
            friends.push(friend);

            let UserName = e.target.getElementsByClassName("text-muted friends-item-account")[0];


            $(UserName).on("DOMSubtreeModified", function () {
                for (let i = 0; i < favourites.length; i++) {
                    if (favourites[i] == friend.name()) {
                        friend.addVisualFavourite();
                        break;
                    }
                }
            });

        }

        if ($(e.target).hasClass("friends-item")) {
            $(e.target).on("click", function () {
                friends[0].nicknamePony();
            });
            $(e.target).append("<div class='MPPL-addFav'><svg version='1.1' id='Слой_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'viewBox='0 0 24 24' style='enable-background:new 0 0 24 24;' xml:space='preserve' fill='#323230'><path class='st0' d='M12.5,1.6l3,6.3c0.1,0.2,0.2,0.3,0.4,0.3l6.9,1c0.5,0.1,0.6,0.6,0.3,1l-5,4.8C18,15.1,18,15.2,18,15.4l1.2,6.8c0.1,0.5-0.4,0.8-0.8,0.6l-6.1-3.3c-0.2-0.1-0.4-0.1-0.5,0l-6.1,3.3c-0.4,0.2-0.9-0.1-0.8-0.6L6,15.4c0-0.2,0-0.4-0.2-0.5l-5-4.8c-0.3-0.3-0.2-0.9,0.3-1l6.9-1c0.2,0,0.3-0.1,0.4-0.3l3-6.3C11.7,1.2,12.3,1.2,12.5,1.6z'/></svg></div>");
            $(e.target).append("<div class='MPPL-favouriteStar'><svg version='1.1' id='Слой_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'viewBox='0 0 24 24' style='enable-background:new 0 0 24 24;' xml:space='preserve' fill='#323230'><path class='st0' d='M12.5,1.6l3,6.3c0.1,0.2,0.2,0.3,0.4,0.3l6.9,1c0.5,0.1,0.6,0.6,0.3,1l-5,4.8C18,15.1,18,15.2,18,15.4l1.2,6.8c0.1,0.5-0.4,0.8-0.8,0.6l-6.1-3.3c-0.2-0.1-0.4-0.1-0.5,0l-6.1,3.3c-0.4,0.2-0.9-0.1-0.8-0.6L6,15.4c0-0.2,0-0.4-0.2-0.5l-5-4.8c-0.3-0.3-0.2-0.9,0.3-1l6.9-1c0.2,0,0.3-0.1,0.4-0.3l3-6.3C11.7,1.2,12.3,1.2,12.5,1.6z'/></svg></div>");

            $(e.target).children(".MPPL-addFav").click(function () {
                let name = e.target.getElementsByClassName("text-muted friends-item-account")[0].textContent;
                if ($(e.target).children(".MPPL-addFav").hasClass("active")) {
                    for (let i = 0; i < friends.length; i++) {
                        if (name == friends[i].name()) {
                            friends[i].removeFavourite();
                            break;
                        }
                    }
                }
                else {
                    for (let i = 0; i < friends.length; i++) {
                        if (name == friends[i].name()) {
                            friends[i].addFavourite();
                            break;
                        }
                    }
                }

            });
        }

        

    });


});