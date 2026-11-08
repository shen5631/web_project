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
  document.getElementById("dong_main_img").src = board[0].img;
  document.getElementById("dong_img_sub_1").src = board[0].img;
  document.getElementById("dong_ctg").innerText = ctg[board[0].category];
  document.getElementById("dong_to").innerText = board[0].to+"명 지원";
  document.getElementById("dong_title").innerText = board[0].name;
  document.getElementById("dong_text").innerText = board[0].text;
  //console.log(sub_img);
  for(let i = 0 ; i <= 2 ; i++){
    let tag = "dong_img_sub_"+(i+2);
    document.getElementById(tag).src = sub_img[i];
  }
  for(let i = 1 ; i <= 4 ; i++){
    if(document.getElementById("dong_img_sub_"+i).src === "http://127.0.0.1:5500/html/undefined"){
      document.getElementById("dong_img_sub_"+i).src = "../asset/Rectangle 112.png";
    }
  }
  


}

async function change(id) {
  const board = await select_board_eq();
  const sub_img = board[0].sub_img.split(",");
  sub_img.pop();
  document.getElementById("dong_main_img").src =  document.getElementById("dong_img_sub_"+id).src;
}

const time_img = setInterval(()=>{

})

print();
