document.addEventListener('DOMContentLoaded', function() {
    containers = document.querySelectorAll('div.status-container');

    for (i = 0; i < containers.length; i += 1) {
        addContainerEvents(containers[i]);

    }
});


function getStatusId(str) {
    var re = /status-(.*)/g;
    return re.exec(str)[1];
}


function addContainerEvents(node) {
    node.querySelector("input[type=radio]").onchange = setStatus;
    node.querySelector("button.edit-button").onclick = toggleEdit;
    node.querySelector("button.delete-button").onclick = deleteStatus;

    var text_box = node.querySelector("input[type=text]")
    text_box.oninput = updateStatus;
    text_box.onkeydown = endEdit;
}


function selectStatus(id) {
    var radio_button = document.querySelector(
        "#status-" + id + " > [type=radio]");
    radio_button.checked = true;
    radio_button.onchange();
}


function setStatus(event) {
    var id = getStatusId(this.parentNode.id);
    if (this.checked == true) {
        apiRequest("/api/status/selected", "POST", {id: id});
    }
}


function updateStatus(event) {
    var id = getStatusId(this.parentNode.id)
    if (id == 'custom') {
        apiRequest("/api/status/custom", "POST", {description: this.value});
    }
}


function endEdit(event) {
    if (event.keyCode == 13) {
        var edit_button = this.parentNode.querySelector("button.edit-button");
        edit_button.click();
    }
}


function deleteStatus(event) {
    var parent = this.parentNode;
    var id = getStatusId(parent.id);
    if (id != "custom") {
        if (parent.querySelector("input[type=radio]").checked) {
            selectStatus("custom");
        }

        apiRequest("/api/status/" + id, "DELETE").then(result => {
            if (result.status == "ok") {
                parent.classList.add("deleted");
                parent.addEventListener("animationend", function () {
                    parent.parentNode.removeChild(parent);
                }, {once: true});
            }
        })
    }
}


function toggleEdit(event) {
    var parent = this.parentNode;
    var id = getStatusId(parent.id)

    // For custom ID the edit button creates a new status
    if (id == "custom") {
        var description = parent.querySelector("input[type=text]").value;

        if (description.length > 0) {
            apiRequest(
                "/api/status", "POST", {description: description}
            ).then(result => {
                if (result.status == "ok") {
                    var is_selected = parent.querySelector(
                        "[type=radio]").checked;

                    // Create new list element for the custom status
                    var container = parent.cloneNode(true);
                    var edit_button = container.querySelector(".edit-button");
                    edit_button.classList.add("enabled");
                    container.querySelector("input[type=text]").value = "";
                    addContainerEvents(container);
                    parent.parentNode.appendChild(container);

                    // Change id of current container to the new id
                    parent.id = "status-" + result.id;
                    // Disable edit
                    this.click();

                    if (is_selected) {
                        selectStatus(result.id);
                    }
                }
            });
        }
    }
    else {
        var enabled = !this.classList.contains("enabled");

        parent.classList.toggle("enabled", enabled);
        this.classList.toggle("enabled", enabled)
        var text_box = parent.querySelector("input[type=text]");
        text_box.disabled = !enabled;

        // Select the text-box and move the cursor to the end
        text_box.focus();
        text_box.selectionStart = text_box.value.length;
        text_box.selectionEnd = text_box.value.length;

        if (!enabled) {
            description = parent.querySelector("input[type=text]").value;
            result = apiRequest(
                "/api/status/" + id, "POST", {description: description});
        }
    }
}


function apiRequest(url, method, data = "") {
    return fetch(url, {
        method: method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }).then(response => {
        if (response.ok) {
            return response.json();
        }
    }).then(data => {
        if (data.status == "fail") {
            console.log(data.error);
        }
        return data;
    })
}
