function getFormData() {
    return {
        instituteName: document.getElementById("instituteName").value.trim(),
        principal: document.getElementById("principal").value.trim(),
        students: document.getElementById("students").value.trim(),
        collegeCode: document.getElementById("collegeCode").value.trim(),
        program: document.getElementById("program").value.trim()
    };
}

function validateData(data) {
    var errors = [];

    if (!data.instituteName) errors.push("Institute Name is required.");
    if (!data.principal) errors.push("Principal Name is required.");
    if (!data.students || Number(data.students) <= 0) {
        errors.push("Total Students must be a positive number.");
    }
    if (!data.collegeCode) errors.push("College Code is required.");
    if (!data.program) errors.push("Program Name is required.");

    var errorBox = document.getElementById("errorBox");
    if (errors.length > 0) {
        errorBox.hidden = false;
        errorBox.innerHTML = errors.map(function (e) {
            return "• " + e;
        }).join("<br>");
        return false;
    } else {
        errorBox.hidden = true;
        errorBox.innerHTML = "";
        return true;
    }
}

function buildReports(data) {
    var dteReport =
        "DTE INSPECTION REPORT\n" +
        "------------------------------\n" +
        "Institute Name   : " + data.instituteName + "\n" +
        "Principal        : " + data.principal + "\n" +
        "Total Students   : " + data.students + "\n" +
        "Remarks          : Infrastructure and academic records verified.";

    var gtuReport =
        "GTU AFFILIATION REPORT\n" +
        "------------------------------\n" +
        "College Code (GTU) : " + data.collegeCode + "\n" +
        "Institute Name     : " + data.instituteName + "\n" +
        "Total Students     : " + data.students + "\n" +
        "Summary            : The institute satisfies the GTU academic norms.";

    var nbaReport =
        "NBA ACCREDITATION REPORT\n" +
        "------------------------------\n" +
        "Program Name   : " + data.program + "\n" +
        "Institute Name : " + data.instituteName + "\n" +
        "Principal      : " + data.principal + "\n" +
        "Observation    : Program outcomes and course files checked carefully.";

    return {
        dteReport: dteReport,
        gtuReport: gtuReport,
        nbaReport: nbaReport
    };
}

function updatePreview() {
    var data = getFormData();
    if (!validateData(data)) {
        return;
    }

    var reports = buildReports(data);

    document.getElementById("dte").innerText = reports.dteReport;
    document.getElementById("gtu").innerText = reports.gtuReport;
    document.getElementById("nba").innerText = reports.nbaReport;
}

function generateReports() {
    updatePreview();
    attachLiveUpdate();
}

var liveUpdateAttached = false;

function attachLiveUpdate() {
    if (liveUpdateAttached) return;
    liveUpdateAttached = true;

    var inputs = document.querySelectorAll("#dataForm input");
    inputs.forEach(function (input) {
        input.addEventListener("input", function () {
            updatePreview();
        });
    });
}

function resetForm() {
    document.getElementById("dataForm").reset();
    document.getElementById("errorBox").hidden = true;
    liveUpdateAttached = false;

    document.getElementById("dte").innerText = "// DTE report will appear here";
    document.getElementById("gtu").innerText = "// GTU report will appear here";
    document.getElementById("nba").innerText = "// NBA report will appear here";
}

function copyReport(type) {
    var map = {
        dte: "dte",
        gtu: "gtu",
        nba: "nba"
    };
    var elementId = map[type];
    if (!elementId) return;

    var text = document.getElementById(elementId).innerText;
    if (!text || text.indexOf("//") === 0) {
        showToast("Generate the report first.");
        return;
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(function () {
                showToast("Copied to clipboard!");
            })
            .catch(function () {
                fallbackCopy(text);
            });
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    var textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand("copy");
        showToast("Copied to clipboard!");
    } catch (e) {
        alert("Unable to copy. Please select and copy manually.");
    }
    document.body.removeChild(textarea);
}

function showToast(message) {
    var toast = document.getElementById("toast");
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add("show");

    setTimeout(function () {
        toast.classList.remove("show");
        setTimeout(function () {
            toast.hidden = true;
        }, 250);
    }, 1800);
}

document.addEventListener("DOMContentLoaded", function () {
    var tabButtons = document.querySelectorAll(".tab-button");
    var dteTab = document.getElementById("dteTab");
    var gtuTab = document.getElementById("gtuTab");
    var nbaTab = document.getElementById("nbaTab");

    var tabMap = {
        dte: dteTab,
        gtu: gtuTab,
        nba: nbaTab
    };

    tabButtons.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var target = btn.getAttribute("data-target");

            tabButtons.forEach(function (b) {
                b.classList.remove("active");
            });
            btn.classList.add("active");

            Object.keys(tabMap).forEach(function (key) {
                tabMap[key].classList.remove("active");
            });

            if (tabMap[target]) {
                tabMap[target].classList.add("active");
            }
        });
    });
});
