function fetchStatus() {
    status = fetch(
        "/api/status/selected",
        {method: "GET"}
    ).then(response => {
        if (response.ok) {
            return response.json();
        }
    }).then(data => {
        if (data.status == "ok" && !in_transition) {
            updatePanel(data.description);
        }
    });
}


function updatePanel(new_status) {
    var status_text = document.getElementById("status_text");
    var status_container = document.getElementById("status_container");

    var old_status = status_text.innerHTML.trim();

    if (new_status != old_status) {
        in_transition = true;

        var characters = new_status.match(/[^\s]\s*/g);

        status_text.classList.add("fadeout");
        status_text.addEventListener("animationend", function () {
            status_text.classList.remove("fadeout");
            status_text.innerHTML = "";

            if (characters === null) {
                in_transition = false;
                return;
            }

            // Add characters from the new state one by one
            var intervalId = setInterval(function () {
                var last = false;
                // Lengths 0 and 1 are checked separately to avoid problems
                // with empty strings
                if (characters.length == 0) {
                    clearInterval(intervalId);
                    return;
                }
                else if (characters.length == 1) {
                    last = true;
                }

                var char_box = document.createElement("span");
                char_box.classList.add("fadein");
                char_box.innerHTML = characters.shift();
                status_container.appendChild(char_box);

                char_box.addEventListener("animationend", function () {
                    status_text.innerHTML += char_box.innerHTML;
                    char_box.parentNode.removeChild(char_box);
                    if (last) {
                        in_transition = false;
                    }
                }, {once: true});
            }, 50);
        }, {once: true});

    }
}

in_transition = false;
setInterval(fetchStatus, 10000);
