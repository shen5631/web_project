const DB_URL = env.DB_URL;
const DB_KEY = env.DB_KEY;

const DB = window.supabase.createClient(DB_URL, DB_KEY);

const name = localStorage.getItem("user_name");
document.getElementById("name").innerText = name + " 학생";

//console.log("!");

async function select_board() {
  const { data, error } = await DB.from("board").select("*");
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

async function print() {
  const ctg = {
    soft: "개발 & 전공",
    sport: "스포츠",
    free: "여가",
    gita: "기타",
  };
  const boards = await select_board();
  let cnt = 0;
  let tags = "";

  for (const board of boards) {
    if (cnt % 5 == 0) {
      tags += "<div class='dong_ga'>";
    }
    tags += `<div class="dong" id="dong">`;
    tags += `<div class="dong_main">`;
    tags += `    <img
      src="${board.img}" alt="" class="dong_img"/>`;
    tags += `<div class="dong_main_text">`;
    tags += `<div class="dong_text">`;
    tags += `<div class="dong_title">${board.name}</div>`;
    tags += `<div class="dong_ex">${board.text}</div>`;
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
  tags += "</div>";
  console.log(tags);
  document.getElementById("dong_se").innerHTML = tags;
}

print();

{
  /* <div class="dong" id="dong">
  <div class="dong_main">
    <img
      src="https://woobttpshqvkjnjvhvis.supabase.co/storage/v1/object/public/main_img/main_1794071785694.png"
      alt=""
      class="dong_img"
    />
    <div class="dong_main_text">
      <div class="dong_text">
        <div class="dong_title">MSG</div>
        <div class="dong_ex">관심있는 사람은 언제나 지원하세요!</div>
      </div>
      <div class="dong_ctg_main">
        <span class="dong_ctg">개발 전공</span>
        <span class="dong_ctg">8명 지원 가능</span>
      </div>
    </div>
  </div>
</div> */
}
