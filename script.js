(function () {
  if (typeof feature === "undefined") {
    var feature = {
      initialize: () => {
        //if the start variable does not exist or she is from 0, we initialize from date.now ().
        if (localStorage.getItem("start") === null || localStorage.getItem("start") == 0) {
          localStorage.setItem("start", Date.now());
        }

        //if the launch variable does not exist, we initialize from true.
        if (localStorage.getItem("launch") == null) {
          localStorage.setItem("launch", true);
        }

        //if the timeOut variable don't exist we initialize from 0.
        if (localStorage.getItem("timeOut") === null) {
          localStorage.setItem("timeOut", Date.now());
        }
      },

      display: {
        //Choose theme light or dark
        theme: () => {
          //const toggleSwitchTheme = document.querySelector('.theme-switch input[type="checkbox"]');

          if (localStorage.getItem("theme") === "true") {
            document.documentElement.setAttribute("data-theme", "dark");
            //toggleSwitchTheme.checked = true;
          } else {
            document.documentElement.setAttribute("data-theme", "light");
          }

          function switchTheme(e) {
            localStorage.setItem("theme", e.target.checked);

            if (localStorage.getItem("theme") === "true") {
              document.documentElement.setAttribute("data-theme", "dark");
            } else {
              document.documentElement.setAttribute("data-theme", "light");
            }
          }

          //toggleSwitchTheme.addEventListener("change", switchTheme, false);
        },
        //Show or hide milliseconds
        showMilli: () => {
          const toggleSwitchMilli = document.querySelector(".milli-switch input[type=checkbox]");

          if (localStorage.getItem("showMilli") === "true") {
            milliseconds.style.display = "initial";
            milliseconds.checked = true;
          } else {
            milliseconds.style.display = "none";
          }

          function switchMilli(e) {
            localStorage.setItem("showMilli", e.target.checked);

            if (localStorage.getItem("showMilli") === "true") {
              milliseconds.style.display = "initial";
            } else {
              milliseconds.style.display = "none";
            }
          }

          toggleSwitchMilli.addEventListener("change", switchMilli);
        },
        //In this function I create elements neccesary to add the time captured in our table
        captureTime: () => {
          const hour = document.getElementById("hour"),
            minute = document.getElementById("minute"),
            second = document.getElementById("seconds"),
            milliseconds = document.getElementById("milliseconds");

          let table = document.querySelector("table"),
            tr = document.createElement("tr"),
            tdStage = document.createElement("th"),
            tdTime = document.createElement("td"),
            previousChild = tbody.lastElementChild;

          tdStage.textContent =
            previousChild === null
              ? (tdStage.textContent = 1)
              : (tdStage.textContent = parseInt(previousChild.firstChild.textContent, 10) + 1);
          tdTime.textContent =
            hour.textContent +
            "h" +
            minute.textContent +
            '"' +
            second.textContent +
            milliseconds.textContent;

          tdStage.scope = "row";
          tr.className = "time";
          tr.appendChild(tdStage);
          tr.appendChild(tdTime);
          tbody.appendChild(tr);
          table.style.display = "table";
        },
        /*In this function, delete the required time and decrement each identifier*/
        deleteTime: (e) => {
          let tr = document.querySelectorAll(".time"),
            nextTime = e.target.parentNode.nextElementSibling;

          if (nextTime) {
            while (nextTime) {
              nextTime.firstChild.textContent -= 1;
              nextTime = nextTime.nextElementSibling;
            }
          }
          tbody.removeChild(e.target.parentNode);
          if (tbody.firstElementChild === null) {
            tbody.parentNode.style.display = "none";
          }
        },
      },

      timer: {
        tick: () => {
          const hour = document.getElementById("hour"),
            minute = document.getElementById("minute"),
            second = document.getElementById("seconds"),
            milliseconds = document.getElementById("milliseconds");

          //calulates the difference of the stop.
          localStorage.setItem(
            "diff",
            localStorage.getItem("timeOut") != 0
              ? parseInt(Date.now(), 10) -
                  parseInt(localStorage.getItem("timeOut"), 10) +
                  parseInt(localStorage.getItem("diff"), 10)
              : localStorage.getItem("diff")
          );

          localStorage.setItem("timeOut", 0);
          const currentTime =
            Date.now() -
            (parseInt(localStorage.getItem("start"), 10) +
              parseInt(localStorage.getItem("diff"), 10));
          hour.textContent = String(Math.trunc(currentTime / 3600000)).padStart(2, "0");
          minute.textContent = String(Math.trunc(currentTime / 60000) % 60).padStart(2, "0");
          second.textContent = String(Math.trunc(currentTime / 1000) % 60).padStart(2, "0");
          milliseconds.textContent =
            "." +
            String(Math.trunc(currentTime) % 1000)
              .padStart(2, "0")
              .slice(0, 2);
        },
        stopAndStart: () => {
          //variable Start initialized if we make reset.
          localStorage.setItem(
            "start",
            localStorage.getItem("start") == 0 ? Date.now() : localStorage.getItem("start")
          );

          if (localStorage.getItem("launch") == "true") {
            //In progress

            feature.timer.tick();
            clearInterval(_interval);
            _interval = setInterval(feature.timer.tick, 1);
            localStorage.setItem("launch", false);
            document.querySelector(".timer").classList.remove("animatedPause");
          } else {
            //Stop
            document.querySelector(".timer").classList.add("animatedPause");
            localStorage.setItem("timeOut", Date.now());
            localStorage.setItem("launch", true);
            clearInterval(_interval);
          }
        },
        //we set the counters to zero for the difference and start variables and we stop the timer.
        reset: () => {
          clearInterval(_interval);
          localStorage.setItem("diff", 0);
          localStorage.setItem("start", Date.now());
          feature.timer.tick();
          localStorage.setItem("start", 0);
          localStorage.setItem("launch", true);
        },
      },
    };
  } else {
    alert("Feature already exist.");
  }

  /*=========================================================================================================*/

  feature.initialize();

  localStorage.setItem("diff", localStorage.getItem("diff") ? localStorage.getItem("diff") : 0);

  const timer = document.querySelector(".timer"),
    sendTime = document.getElementById("sendTime"),
    tbody = document.getElementsByTagName("tbody")[0];

  let _interval;

  //if "start"  exists and "launch" is not on paused when the refreshed of the page, the clock continues.
  if (localStorage.getItem("start") && localStorage.getItem("launch") == "false") {
    feature.timer.tick();
    _interval = setInterval(feature.timer.tick, 1);
  } else {
    //I launch the clock and I take timeOut time
    feature.timer.tick();
    _interval = setInterval(feature.timer.tick, 1);
    clearInterval(_interval);
    localStorage.setItem("timeOut", Date.now());
  }

  timer.addEventListener("click", feature.timer.stopAndStart);

  timer.addEventListener("dblclick", feature.timer.reset);

  const start_stop = document.querySelector("#start_stop");
  const reset = document.querySelector("#reset");

  start_stop.addEventListener("click", feature.timer.stopAndStart);
  reset.addEventListener("click", feature.timer.reset);

  feature.display.theme();

  feature.display.showMilli();

  sendTime.addEventListener("click", feature.display.captureTime);

  tbody.addEventListener("click", feature.display.deleteTime);

})();

//I expand the settings menu if it is not visible and I fold it up if it is visible.
document.querySelector(".logo-setting").addEventListener("click", () => {
  let setting = document.querySelector(".setting");

  if (setting.style.display === "inline-block") {
    setting.classList.replace("settingOpen", "settingClose");

    setTimeout(() => {
      setting.style.display = "none";
    }, 200);
  } else {
    setting.classList.remove("settingClose");
    setting.classList.add("settingOpen");
    setting.style.display = "inline-block";
  }
});

document.addEventListener("click", (e) => {
  const setting = document.querySelector(".setting");

  if (
    e.target.className !== "logo-setting" &&
    e.target.className !== "slider round" &&
    e.target.className !== "slider2 round2" &&
    e.target.className !== "check"
  ) {
    if (setting.style.display === "inline-block") {
      setting.classList.replace("settingOpen", "settingClose");

      setTimeout(() => {
        setting.style.display = "none";
        setting.classList.remove("settingClose");
      }, 200);
    }
  }
});
