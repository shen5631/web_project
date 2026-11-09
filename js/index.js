const DB_URL = env.DB_URL;
const DB_KEY = env.DB_KEY;

const DB = window.supabase.createClient(DB_URL, DB_KEY);

const name = localStorage.getItem("user_name");
document.getElementById("name").innerText = name + " 학생";

//console.log("!");


async function select_board(category, search_name) {
  let query = DB.from("board")
    .select("*,user(*)")
    .order("id", { ascending: false });


  if (category) {
    query = query.eq("category", category);
  }
  if (search_name) {
    query = query.eq("name", search_name);
  }

  const { data, error } = await query;
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


async function print(category, search_name) {
  const ctg = {
    soft: "개발 & 전공",
    sport: "스포츠",
    free: "여가",
    gita: "기타",
  };
  const boards = await select_board(category, search_name);


  if (boards.length == 0) {
    document.getElementById("dong_se").innerHTML =
      "<p>조회된 동아리가 없습니다.</p>";
    return;
  }

  let cnt = 1;
  let tags = "<div class='dong_ga'>";

  for (const board of boards) {
    if (cnt % 6 == 0) {
      tags += "<div class='dong_ga'>";
    }
    tags += `<div class="dong" id="dong" onclick="check_dong('${cnt}','${board.user.ban}')" >`;
    tags += `<div class="dong_main">`;
    tags += `    <img
      src="${board.user.ban === true ? "../asset/ban.png" : board.img}" alt="" class="dong_img"/>`;
    tags += `<div class="dong_main_text">`;
    tags += `<div class="dong_text">`;
    tags += `<div class="dong_title" id="dong_title${cnt}">${board.name}</div>`;
    tags += `<div class="dong_ex">${board.text.length > 18 ? board.text.slice(0, 18) + "..." : board.text}</div>`;
    tags += `</div>`;
    tags += `<div class="dong_ctg_main">`;
    tags += `<span class="dong_ctg">${ctg[board.category]}</span>`;
    tags += `<span class="dong_ctg">${board.to}명 지원 가능</span>`;
    tags += `</div>`;
    tags += `</div>`;
    tags += `</div>`;
    tags += `</div>`;
    if (cnt % 5 == 0) {
      tags += "</div>";
    }
    cnt++;
  }
  cnt--;
  if (cnt % 5 != 0) {
    tags += "</div>";
  }
  //console.log(tags);
  document.getElementById("dong_se").innerHTML = tags;
}

print();


function ctg_color(select) {
  document.getElementById("catego").className = "catego select_" + select;
}


function ctg_click(category) {
  document.getElementById("serch_ip").value = "";
  ctg_color(category == "" ? "total" : category);
  print(category, "");
}

function serch() {
  const search_name = document.getElementById("serch_ip").value;
  ctg_color("total");
  print("", search_name);
}

function check_dong(id, ban) {
  if (ban === "true") {
    alert("정지된 사용자의 게시물 입니다.");
  } else {
    const check_name = document.getElementById("dong_title" + id).innerText;
    console.log(check_name);
    localStorage.setItem("dong_name", check_name);
    location.href = "check_dong.html";
  }
}
