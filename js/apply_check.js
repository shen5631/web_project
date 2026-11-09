const DB_URL = env.DB_URL;
const DB_KEY = env.DB_KEY;

const DB = window.supabase.createClient(DB_URL, DB_KEY);

const name = localStorage.getItem("user_name");
document.getElementById("name").innerText = name + " 학생";

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

async function apply_select() {
  const { data, error } = await DB.from("apply").select("*,user(*),board(*)");
  if (error) {
    console.log("에러 : ", error);
  } else {
    console.log("성공 : ", data);
    return data;
  }
}

async function print() {
  const applys = await apply_select();
  const ctg = {
    soft: "개발 & 전공",
    sport: "스포츠",
    free: "여가",
    gita: "기타",
  };
  let tag = "";
  for (const apply of applys) {
    if (apply.user.user_id == localStorage.getItem("user_id")) {
      tag += `<div class="apply_check">`;
      tag += `<img src="${apply.board.img}" alt="" class="apply_img" />`;
      tag += `<div class="apply_text_main">`;
      tag += `<div class="ti_ct">`;
      tag += `<div class="apply_title">${apply.board.name}</div>`;
      tag += `<div class="apply_ctg">${ctg[apply.board.category]}</div>`;
      tag += `</div>`;
      tag += `<div class="apply_text">${apply.board.text}</div>`;
      tag += `</div>`;
      tag += `<div class="apply_time">${apply.time}지원</div>`;
      tag += `<button class="apply_check_button" onclick = "apply_button('${apply.board.name}')">상세 보기</button>`;
      tag += `</div>`;
    }
  }
  if(tag === ""){
    tag = "<div class = 'apply_empty'>동아리 지원 내역 없음</div>"
  }
  document.getElementById("total_apply").innerHTML = tag;
}

async function apply_button(name) {
  console.log(name);
  localStorage.setItem("dong_name",name);
  location.href = "check_dong.html";
}

print();

