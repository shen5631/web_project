const DB_URL = env.DB_URL;
const DB_KEY = env.DB_KEY;

const DB = window.supabase.createClient(DB_URL, DB_KEY);

const name = localStorage.getItem("user_name");
document.getElementById("name").innerText = name + " 학생";

async function board_select_eq() {
    const {data,error} = await DB.from("board").select("*").eq("user_id",localStorage.getItem("user_id"))
    if(error){
        console.log("에러 : ",error);
    }
    else{
        console.log("성공 : ",data);
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
}

async function print() {
    const boards = await board_select_eq();
    let tag = '<select name="" id="" class="main_select">'
    for(let board of boards){
        tag+=`<option value="${board.name}" class="option">${board.name}</option>`
    }
    tag += '</select>';

    document.getElementById("select_div").innerHTML = tag;
}

print();
/*
<select name="" id="" class="main_select">
  <option value="" class="option">축구동아리</option>
</select>;
*/  
