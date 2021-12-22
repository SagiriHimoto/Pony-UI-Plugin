
let idChromeEx = "ofhcjhcmhoaebfldihpfefjkbpkeblcd";


let friends = new Array();
let favourites = new Array();


function Friend(userEl)
{
    this.element = userEl;
    this.nicknamePony = function()
    {
        return userEl.getElementsByClassName("friends-item-name")[0].textContent.toLowerCase();
    }
    this.name = function()
    {
        return userEl.getElementsByClassName("text-muted friends-item-account")[0].textContent;
    }

    this.addFavourite = function()
    {
        userEl.getElementsByClassName("MPPL-favouriteStar")[0].classList.add("active");
        userEl.getElementsByClassName("MPPL-addFav")[0].classList.add("active")
        
        favourites.push(this.name());
    }
    this.removeFavourite = function()
    {
        userEl.getElementsByClassName("MPPL-favouriteStar")[0].classList.remove("active");
        userEl.getElementsByClassName("MPPL-addFav")[0].classList.remove("active")
        
        for(let i = 0; i < favourites.length; i++)
        {
            if(favourites[i] == this.name())
            {
                favourites.splice(i, 1);
                break;
            }
        }
    }
}

function GetLink(link)
{
    return "chrome-extension://" + idChromeEx + "/" + link;
}

$(document).ready(function(){
    
    /*
    $(document).on("click", "#PL-close-friend-list", function()
    {
        $('.friends-box').removeClass('show');
        $('.friends-box > ui-button').attr('aria-expanded', 'false');
        $('.friends-box > ui-button').removeAttr('aria-controls');
        $('.friends-dropdown-menu').remove();
    });
    */
    $(document).on("DOMNodeInserted", function(e)
    {
        /*
        if($(e.target).hasClass("friends-dropdown-menu"))
        {
            $(".dropdown-header").append("<button id='PL-close-friend-list'> <img src=" + GetLink("images/delete.svg") +"> </button>");
        }
        */
       
        if($(e.target).hasClass("friends-item"))
        {
            friends.push(new Friend(e.target));
        }
        if($(e.target).hasClass("friends-dropdown-menu"))
        {
            $(".friends-dropdown-menu").append("<input id='MPPL-searchFriend' class='MPPL form-control' type='text' placeholder='Search'>");

            $("#MPPL-searchFriend").keyup(function (e) {

                let value = $("#MPPL-searchFriend").val().toLowerCase();

                if(value == "")
                {
                    for(let i = 0; i < friends.length; i++)
                    {
                        $(friends[i].element).removeClass("hide");
                    }
                }
                else
                {
                    for(let i = 0; i < friends.length; i++)
                    {
                        if((friends[i].nicknamePony()).includes(value) || (friends[i].name().toLowerCase().includes(value)))
                        {
                            $(friends[i].element).removeClass("hide");
                        }
                        else
                        {
                            $(friends[i].element).addClass("hide");
                        }
                    }
                }
            });

            $(".friends-dropdown-menu").append("<div id='MPPL-favouriteFriends' class='MPPL'><div class='MPPL-all-friends MPPL-friends active'>Все</div><div class='MPPL-favourite MPPL-friends'>Избранное</div></div>");

            $(".MPPL-friends").click(function(e)
            {
                $(".MPPL-friends").removeClass("active");
                $(e.target).addClass("active");
            });
            $(".MPPL-all-friends").click(function(e)
            {
                for(let i = 0; i < friends.length; i++)
                {
                    $(friends[i].element).removeClass("hide");
                }
                $("#MPPL-searchFriend").removeClass("hide");
            });

            $(".MPPL-favourite").click(function(e)
            {
                frie: for(let i = 0; i < friends.length; i++)
                {
                    fav: for(let s = 0; s < favourites.length; s++)
                    {
                        if(friends[i].name() == favourites[s])
                        {
                            $(friends[i].element).removeClass("hide");
                            continue frie;
                        }
                    }
                    $(friends[i].element).addClass("hide");
                }
                $("#MPPL-searchFriend").addClass("hide");
            });
        }
        if($(e.target).hasClass("friends-item"))
        {
            $(e.target).on("click", function()
            {
                friends[0].nicknamePony();
            });
            $(e.target).append("<div class='MPPL-addFav'><svg version='1.1' id='Слой_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'viewBox='0 0 24 24' style='enable-background:new 0 0 24 24;' xml:space='preserve' fill='#323230'><path class='st0' d='M12.5,1.6l3,6.3c0.1,0.2,0.2,0.3,0.4,0.3l6.9,1c0.5,0.1,0.6,0.6,0.3,1l-5,4.8C18,15.1,18,15.2,18,15.4l1.2,6.8c0.1,0.5-0.4,0.8-0.8,0.6l-6.1-3.3c-0.2-0.1-0.4-0.1-0.5,0l-6.1,3.3c-0.4,0.2-0.9-0.1-0.8-0.6L6,15.4c0-0.2,0-0.4-0.2-0.5l-5-4.8c-0.3-0.3-0.2-0.9,0.3-1l6.9-1c0.2,0,0.3-0.1,0.4-0.3l3-6.3C11.7,1.2,12.3,1.2,12.5,1.6z'/></svg></div>");
            $(e.target).append("<div class='MPPL-favouriteStar'><svg version='1.1' id='Слой_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px'viewBox='0 0 24 24' style='enable-background:new 0 0 24 24;' xml:space='preserve' fill='#323230'><path class='st0' d='M12.5,1.6l3,6.3c0.1,0.2,0.2,0.3,0.4,0.3l6.9,1c0.5,0.1,0.6,0.6,0.3,1l-5,4.8C18,15.1,18,15.2,18,15.4l1.2,6.8c0.1,0.5-0.4,0.8-0.8,0.6l-6.1-3.3c-0.2-0.1-0.4-0.1-0.5,0l-6.1,3.3c-0.4,0.2-0.9-0.1-0.8-0.6L6,15.4c0-0.2,0-0.4-0.2-0.5l-5-4.8c-0.3-0.3-0.2-0.9,0.3-1l6.9-1c0.2,0,0.3-0.1,0.4-0.3l3-6.3C11.7,1.2,12.3,1.2,12.5,1.6z'/></svg></div>");

            $(e.target).children(".MPPL-addFav").click(function()
            {
                let name = e.target.getElementsByClassName("text-muted friends-item-account")[0].textContent;
                if($(e.target).children(".MPPL-addFav").hasClass("active"))
                {
                    for(let i = 0; i < friends.length; i++)
                    {
                        if(name == friends[i].name())
                        {
                            friends[i].removeFavourite();
                            break;
                        }
                    }
                }
                else
                {
                    for(let i = 0; i < friends.length; i++)
                    {
                        if(name == friends[i].name())
                        {
                            friends[i].addFavourite();
                            break;
                        }
                    }
                }
                
            });
        }
    });
    
   
});