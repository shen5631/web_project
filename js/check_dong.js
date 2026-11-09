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

async function insert_apply(apply) {
  const {data,error} = await DB.from("apply").insert([
    {
      user_id : apply.user_id,
      board_id : apply.board_id,
      time : apply.time
    }
  ]);

  if(error){
    console.log("에러 : ",error);
  }
  else{
    console.log("성공 : ",data);
  }
}

async function select_board_eq() {
  const { data, error } = await DB.from("board")
    .select("*")
    .eq("name", localStorage.getItem("dong_name"));
  if (error) {
    console.log("에러 : ", error);
  } else {
    console.log("성공 : ", data);
    return data;
  }
}

const time_img = setInterval(() => {
  right_button();
}, 3000);

async function print() {
  const ctg = {
    soft: "개발 & 전공",
    sport: "스포츠",
    free: "여가",
    gita: "기타",
  };
  const board = await select_board_eq();
  const sub_img = board[0].sub_img.split(",");
  sub_img.pop();
  localStorage.setItem("check_img", "dong_img_sub_1");
  document.getElementById("dong_main_img").src = board[0].img;
  document.getElementById("dong_img_sub_1").src = board[0].img;
  document.getElementById("dong_ctg").innerText = ctg[board[0].category];
  document.getElementById("dong_to").innerText = board[0].to + "명 지원";
  document.getElementById("dong_title").innerText = board[0].name;
  document.getElementById("dong_text").innerText = board[0].text;
  link_print();
  //console.log(sub_img);
  for (let i = 0; i <= 2; i++) {
    let tag = "dong_img_sub_" + (i + 2);
    document.getElementById(tag).src = sub_img[i];
  }
  for (let i = 1; i <= 4; i++) {
    if (
      document.getElementById("dong_img_sub_" + i).src ===
      "http://127.0.0.1:5500/html/undefined"
    ) {
      document.getElementById("dong_img_sub_" + i).src =
        "../asset/Rectangle 112.png";
    }
  }
}

async function change(id) {
  const board = await select_board_eq();
  const sub_img = board[0].sub_img.split(",");
  sub_img.pop();
  document.getElementById(localStorage.getItem("check_img")).className =
    "dong_img_sub";
  document.getElementById("dong_img_sub_" + id).className =
    "dong_img_sub_check";
  localStorage.setItem("check_img", "dong_img_sub_" + id);

  document.getElementById("dong_main_img").src = document.getElementById(
    "dong_img_sub_" + id,
  ).src;
}

async function left_button() {
  let now_img = Number(localStorage.getItem("check_img").slice(-1)) - 1;
  if (now_img == 0) now_img = 4;

  document.getElementById("dong_main_img").src = document.getElementById(
    "dong_img_sub_" + now_img,
  ).src;
  document.getElementById(localStorage.getItem("check_img")).className =
    "dong_img_sub";
  document.getElementById("dong_img_sub_" + now_img).className =
    "dong_img_sub_check";
  localStorage.setItem("check_img", "dong_img_sub_" + now_img);
}

async function right_button() {
  let now_img = Number(localStorage.getItem("check_img").slice(-1)) + 1;
  if (now_img == 5) {
    now_img = 1;
  }

  document.getElementById("dong_main_img").src = document.getElementById(
    "dong_img_sub_" + now_img,
  ).src;
  document.getElementById(localStorage.getItem("check_img")).className =
    "dong_img_sub";
  document.getElementById("dong_img_sub_" + now_img).className =
    "dong_img_sub_check";
  localStorage.setItem("check_img", "dong_img_sub_" + now_img);
}

async function link_print() {
  const board = await select_board_eq();
  let tag = "<div class='dong_link_int'>링크</div>";
  if (board[0].link != null) {
    const links = board[0].link.split(",");
    links.pop();
    console.log(links);

    for (let link of links) {
      let src = "";
      if (link.includes("naver")) {
        src = "../asset/naver.svg";
      } else if (link.includes("blog")) {
        src = "../asset/blog.svg";
      } else if (link.includes("git")) {
        src = "../asset/git.svg";
      } else if (link.includes("insta")) {
        src = "../asset/insta.svg";
      }
      tag += '<div class="dong_link">';
      tag += `<img src="${src}" alt="" class="dong_link_img" />`;
      tag += `<a class="dong_link_url" href="${link}">`
      tag += `${link}</a></div>`
      tag
    }
  }

  if(tag =="<div class='dong_link_int'>링크</div>" ){
    tag+="<div class = 'dong_link_no'>링크가 없습니다.</div>"
  }
  document.getElementById("dong_link_main").innerHTML = tag;  
  console.log(tag);
}

async function apply() {
  const time = new Date();
  const board = await select_board_eq();
  const check = confirm(`${board[0].name}에 정말로 신청하시겠습니까?`);
  console.log(time.getFullYear(),time.getMonth()+1,time.getDate());

  if(check){
    const apply = {
      user_id : localStorage.getItem("user_id"),
      board_id : board[0].id,
      time : time.getFullYear()+"-"+(time.getMonth()+1)+"-"+time.getDate()
    }

    insert_apply(apply);
  }
}

function back(){
  location.href = "index.html";
}

print();


