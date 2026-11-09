const DB_URL = env.DB_URL;
const DB_KEY = env.DB_KEY;

const DB = window.supabase.createClient(DB_URL, DB_KEY);

const name = localStorage.getItem("user_name");
document.getElementById("name").innerText = name + " 학생";

async function board_select_eq() {
  const { data, error } = await DB.from("board")
    .select("*")
    .eq("user_id", localStorage.getItem("user_id"));
  if (error) {
    console.log("에러 : ", error);
  } else {
    console.log("성공 : ", data);
    return data;
  }
}

async function apply_select() {
  const { data, error } = await DB.from("apply").select("*,user(*),board(*)");
  if (error) {
    console.log("에러 : ", error);
  } else {
    console.log("성공 : ", data);
    return data;
  }
}

function test() {
  const check = localStorage.getItem("user_auth");
  if (check === "false") {
    alert("게시물 생성 권한이 없습니다.");
    console.log("!");
  } else {
    location.href = "add_dong.html";
  }
}
if (localStorage.getItem("user_master") == "true") {
  document.getElementById("board_log").innerText = "게시물 조회";
}
if (localStorage.getItem("user_auth") == "true") {
  document.getElementById("apply_log").innerText = "지원 목록";
} else {
  document.getElementById("apply_log").innerText = "지원 내역";
  document.getElementById("apply_log").href = "apply_check.html";
}

async function print() {
  const boards = await board_select_eq();
  const applys = await apply_select();
  let tag =
    '<select name="" id="select" class="main_select" onchange = "print_table()">';

  for (let board of boards) {
    tag += `<option value="${board.id}" class="option">${board.name}</option>`;
  }
  tag += "</select>";
  //console.log(tag);
  document.getElementById("select_div").innerHTML = tag;
  print_table();
}

async function print_table() {
  const applys = await apply_select();
  let table_tag =
    '<tr class="apply_tr_th"><th class="apply_th">이름</th><th class="apply_th">학번</th><th class="apply_th">지원일</th></tr>';

  for (const apply of applys) {
    if (apply.board_id == document.getElementById("select").value) {
      table_tag += '<tr class="apply_tr">';
      table_tag += `<td class="apply_td_n">${apply.user.user_name}</td>`;
      table_tag += `<td class="apply_td">${apply.user.user_num}</td>`;
      table_tag += `<td class="apply_td">${apply.time}</td>`;
      table_tag += `</tr>`;
    }
  }

  if (!table_tag.includes("td")) {
    table_tag += '<tr class="apply_tr">';
    table_tag += `<td class="apply_td_n">지원자 없음</td>`;
    table_tag += `</tr>`;
  }

  document.getElementById("table_apply").innerHTML = table_tag;
}

print();
