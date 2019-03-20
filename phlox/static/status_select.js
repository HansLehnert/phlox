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
    node.querySelector("input[type=text]").oninput = updateStatus;
    node.querySelector("input[type=checkbox]").onchange = toggleEdit;
    node.querySelector("button").onclick = deleteStatus;
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
        apiRequest("/api/status/selected", "POST", {id: this.parentNode.id});
    }
}


function updateStatus(event) {
    var id = getStatusId(this.parentNode.id)
    if (id == 'custom') {
        apiRequest("/api/status/custom", "POST", {description: this.value});
    }
}


function deleteStatus(event) {
    var parent = this.parentNode;
    var id = getStatusId(parent.id);
    if (id != "custom") {
        if (parent.querySelector("input[type=radio]").checked) {
            selectStatus("custom");
        }

        console.log("/api/status/" + id)
        apiRequest("/api/status/" + id, "DELETE").then(result => {
            if (result.status == "ok") {
                parent.parentNode.removeChild(parent);
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

        if (this.checked == false && description.length > 0) {
            apiRequest(
                "/api/status", "POST", {description: description}
            ).then(result => {
                if (result.status == "ok") {
                    var is_selected = parent.querySelector(
                        "[type=radio]").checked;

                    // Create new list element for the custom status
                    var container = parent.cloneNode(true);
                    container.querySelector("[type=checkbox]").checked = true;
                    addContainerEvents(container);
                    parent.parentNode.appendChild(container);

                    // Change id of current container to the new id
                    parent.id = "status-" + result.id;
                    this.onchange();

                    if (is_selected) {
                        selectStatus(result.id);
                    }
                }
            });
        }
        else {
            this.checked = true;
        }
    }
    else {
        parent.classList.toggle("edit-enabled", this.checked);
        parent.querySelector("input[type=text]").disabled = !this.checked;

        if (this.checked == false) {
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
    }).then(
        function (response) {
            if (response.ok) {
                var data = response.json()
                if (data.status == "fail") {
                    console.log(data.error)
                }
                return data
            }
        }
    );
}
