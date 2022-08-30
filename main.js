
var data = []; // Khai báo mảng trong javascript
var mode = "";
let selectedRow = -1;
//khai bao cac bien
var modal = document.querySelector(".model");
//fc modal
function toggleModal(e) {
    modal.classList.toggle("hide");
}

document.querySelector("body").addEventListener("click", (e) => {
    // add event to button edit task
    if (e.target.id === "btnEdit") {
        mode = "edit";
        // console.log(e.target.parentNode.parentNode.firstChild.innerText)
        // tìm chỉ số hàng đang được chọn để edit
        /**
         * tìm giá trị ô id của hàng đang được chọn (selectedId)
         * dùng for đối chiếu với mảng data để tìm chỉ số hàng tương ứng (selectedRow)
         */
        let selectedId = Number.parseInt(e.target.parentNode.parentNode.firstChild.innerText);
        for (let i = 0; i < data.length; i++) {
            if (data[i].id == selectedId) {
                selectedRow = i;
                break;
            }
        }

        toggleModal();
    }

    // add event to button add task
    if (e.target.id === "btnAddTask") {
        mode = "add";
        toggleModal();
    }

    // add event to button cancel
    if (e.target.id === "Cancel") {
        toggleModal();
    }

    // add event to button save
    if (e.target.id === "Save") {
        toggleModal();
        if (mode === "edit") {
            Add(selectedRow);
        } else Add();
    }

    // add event to button view
    if (e.target.id === "btnView") {
        toggleModal();
    }
});

function saveDataToStore(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadDataFromStore() {
    return [...JSON.parse(localStorage.getItem("tasks"))];
}

// Check chưa nhập thông tin
function checkInfo() {
    var id = document.getElementById("id").value;
    var taskname = document.getElementById("taskname").value;
    var deadline = document.getElementById("deadline").value;
    var status = document.getElementById("status").value;

    if (!id) {
        alert("ID must be filled out");
        return false;
    }
    if (!taskname) {
        alert("Name must be filled out");
        return false;
    } else if (!deadline) {
        alert("Deadline must be filled out");
        return false;
    } else if (!status) {
        alert("Status must be filled out");
        return false;
    }
    return true;
}

// Thêm mới nhân viên
function Add(selectedRow = -1) {
    // mặc định selectedRow = -1, đang ở chế độ thêm task
    var id = document.getElementById("id").value;
    var taskname = document.getElementById("taskname").value;
    var deadline = document.getElementById("deadline").value;
    var status = document.getElementById("status").value;

    var item = {
        id: id,
        taskname: taskname,
        deadline: deadline,
        status: status,
    };

    if (!checkInfo()) return;

    // mode thêm task
    if (selectedRow == -1) {
        let index = data.findIndex((c) => c.id == item.id);
        if (index >= 0) {
            data.splice(index, 1, item);
        } else {
            this.data.push(item);
        }
    }

    //mode edit task
    else {
        data.splice(selectedRow, 1, item);
    }

    View();
    Refresh();
    saveDataToStore(data);
}

// Hiển thị nhân viên
function View() {
    var list = this.data;
    // lấy ngày hiện tại theo format viêt nam
    const now = new Date().toLocaleDateString("vi");

    // Xử lý cộng chuỗi thành html - table
    var datas =
        '<table border="1" cellpadding="10" width=100%><tr><th>ID</th><th>NAME<th>CREATED</th><th>DEALINE</th><th>STATUS</th><th>ACTION</th></tr>';
    for (var i = 0; i < list.length; i++) {
        datas += "<tr>";

        datas += "<td>" + list[i].id + "</td>";
        datas += "<td>" + list[i].taskname + "</td>";
        datas += "<td>" + now + "</td>";
        datas += "<td>" + list[i].deadline + "</td>";
        datas += "<td>" + list[i].status + "</td>";

        datas +=
            "<td colspan=3><button onclick='Deletes(" +
            list[i].id +
            ")' id='DeleModal' >Xóa</button>&nbsp;&nbsp;<button onclick='Edit(" +
            list[i].id +
            ")' id='btnEdit'>Edit</button>&nbsp;&nbsp;<button onclick='getInfo(" +
            list[i].id +
            ")' id='btnView'>Xem</button>";
        datas += "</tr>";
    }
    datas += "</table>";

    if (list.length != 0) {
        document.getElementById("database").innerHTML = datas;
    } else {
        document.getElementById("database").innerHTML = "Dữ liệu trống!";
    }
}

// Xóa nhân viên theo id
function Deletes(id) {
    var list = this.data;

    var check = confirm("Bạn có muốn xóa task này không?");

    if (check) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == id) {
                list.splice(i, 1);
                saveDataToStore(list);
                alert("Đã xoá task");
            }
        }
    }
    View(); // gọi hàm hiển thị
}

function Edit(id) {
    var list = this.data;
    console.log(id);

    //var check = confirm("Bạn có muốn edit task này không?")
    for (var i = 0; i < list.length; i++) {
        if (list[i].id == id) {
            document.getElementById("id").value = data[i].id;
            document.getElementById("taskname").value = data[i].taskname;
            document.getElementById("deadline").value = data[i].deadline;
            document.getElementById("status").value = data[i].status;
        }
    }

    View(); // gọi hàm hiển thị
}
// Refresh
function Refresh() {
    document.getElementById("id").value = "";
    document.getElementById("taskname").value = "";
    document.getElementById("deadline").value = "";
    document.getElementById("status").value = "";
}

// xem thông tin chi tiết của task
function getInfo(id) {
    document.querySelector(".model_header h3").innerText = "View";
    for (var i = 0; i < data.length; i++) {
        if (data[i].id == id) {
            document.getElementById("id").value = data[i].id;
            document.getElementById("id").readOnly = true;
            document.getElementById("taskname").value = data[i].taskname;
            document.getElementById("taskname").readOnly = true;
            document.getElementById("deadline").value = data[i].deadline;
            document.getElementById("deadline").readOnly = true;
            document.getElementById("status").value = data[i].status;
            // document.getElementById("status ").setAttribute("disabled", true);
        }
    }

    document.getElementById("Save").style.display = "none";
    document.getElementById("Cancel").style.marginRight = "10px";
    document.getElementById("Cancel").innerText = "Đóng";

}

// load data for the first time render page
data = loadDataFromStore();
View();
