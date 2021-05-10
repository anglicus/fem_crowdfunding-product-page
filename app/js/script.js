const valueRegex = /^\d*(\.\d{0,2})?$/;
const pledgesGoal = 100000;
var pledgesTotal = 89914;
var totalBackers = 5007;
const pledgesLeft = {"no-reward": 99999999,
                     "bamboo-stand": 101,
                     "black-edition-stand": 64,
                     "mahogany-special-edition": 0};

function formatNumber(num) {
    let numStr = num.toString();
    if (numStr.length <= 3) {
        return numStr;
    } else {
        let formattedStr = "";
        let rem = numStr.length % 3;
        let i = 0;
        if (rem == 0) {
            i++;
            formattedStr = numStr.slice(0,3);
        } else {
            formattedStr = numStr.slice(0,rem);
        };
        while (numStr.length - rem >= (i + 1) * 3) {
            formattedStr = formattedStr + "," + numStr.slice(rem + i * 3, rem + (i+1) * 3);
            i++;
        }
        return formattedStr;
    }
}

function updatePledgeStats (pledgeType, pledgeAmount) {
    pledgesTotal += parseInt(pledgeAmount);
    totalBackers++;
    pledgesLeft[pledgeType]--;

    // update stats
    $("#stat-total").text("$" + formatNumber(pledgesTotal));
    $("#stat-backers").text(formatNumber(totalBackers));
    const progress = Math.min(100, parseInt(100 * pledgesTotal/pledgesGoal));
    $(".progress-total").css("width", progress + "%");

    // update rewards / pledges and reset inputs
    for (const reward in pledgesLeft) {
        $(".left-value." + reward).text(pledgesLeft[reward]);
        if (pledgesLeft[reward] == 0) {
            $(".reward." + reward).addClass("sold-out");
            $(".reward." + reward).children("button").text("Out of stock");

            $(".pledge." + reward).addClass("sold-out");
            $(".pledge." + reward).children(".radio-pledge").attr("disabled", true);
        }
        
        const input = $(".pledge." + reward).find(".pledge-input");
        input.val(input.attr("value"));
    }



}

$(document).ready(function() {
    // initialize the progress bar
    $(".progress-total").css("width", parseInt(100* pledgesTotal/pledgesGoal) + "%");
    
    $("button.btn-bookmark").on("click", function() {
        console.log("bookmark button");
        $(this).toggleClass("bookmark-selected");
    });

    $("button.btn-back-project").on("click", function() {
        $("div.modal-back-project").toggleClass("modal-hide");

        $("input:radio[name=pledge]").each(function(){
            var radio = $(this);
            radio.prop("checked", false);
            radio.parents(".pledge").removeClass("selected");
        });
    });

    $("button.btn-select-reward").on("click", function() {
        const reward = $(this).parent().attr("data-reward");
        const radio = $("input:radio#" + reward);
        radio.prop("checked", true).change();
        $("div.modal-back-project").toggleClass("modal-hide");
        radio[0].scrollIntoView({block: "center", behavior: "smooth"});

    });

    $("button.btn-close-modal").on("click", function() {
        $(this).parents(".modal").toggleClass("modal-hide");
    });

    $(".pledge-title-div").on("click", function() {
       $(this).children("input[type=radio]").prop("checked", true).change();
    });

    $("input:radio[name=pledge]").change(function() {
        if ($(this).is(":checked")) {
            console.log("a button got checked");
            $(this).parents(".pledge").addClass("selected");
        }
        $("input:radio[name=pledge]").each(function(){
            var radio = $(this);
            if (!(radio.is(":checked"))) {
                radio.parents(".pledge").removeClass("selected");
            }
        });
    });

    $(".btn-submit-pledge").on("click", function() {
        const input = $(this).siblings(".pledge-input-wrapper").children(".pledge-input");
        const pledgeMin = Math.max(input.attr("value"), 0.01);
        const pledgeVal = input.val();
        const pledgeMsg = $(this).siblings(".pledge-message");
        const reward = $(this).parent().attr("data-reward");
        console.log("pledge val is", pledgeVal);
        pledgeMsg.removeClass("warn-pledge");
        pledgeMsg.text("Enter your pledge");
        input.removeClass("invalid");
        if (valueRegex.test(pledgeVal)) {
            console.log('good value');
            if (+pledgeVal < +pledgeMin) {
                console.log("too small value");
                input.addClass("invalid");
                const p = "Please enter at least $" + pledgeMin;
                pledgeMsg.text(p);
                pledgeMsg.addClass("warn-pledge");
            } else {
                updatePledgeStats(reward, pledgeVal);
                // close this modal and open the thank you
                $(".modal-back-project").addClass("modal-hide");
                $(".modal-success").removeClass("modal-hide");
                window.scrollTo({top: 0, behavior: "smooth"});
            }
        } else {
            console.log('bad value');
            input.addClass("invalid");
            pledgeMsg.text("Please enter a valid amount");
            pledgeMsg.addClass("warn-pledge");
        }
    });

    $("button.btn-gotit").on("click", function() {
        $("div.modal-success").addClass("modal-hide");
    });

    $("button.btn-mobile-hamburger").on("click", function() {
        $("div.header-links").toggleClass("mobile-hide");
        $(this).children("img").toggleClass("mobile-hide");
        $("header").children(".mobile-menu-background-screen").toggleClass("mobile-hide");
    })

});
