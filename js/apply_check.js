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



/*

          <div class="apply_check">
            <img src="" alt="" class="apply_img" />
            <div class="apply_text_main">
              <div class="ti_ct">
                <div class="apply_title">인공지능 크리에이터</div>
                <div class="apply_ctg">개발 & 전공</div>
              </div>
              <div class="apply_text">관심있는 사람 누구나 지원하세요!</div>
            </div>
            <div class="apply_time">2026-11-03지원</div>
            <button class="apply_check_button">상세 보기</button>
          </div>
          
          <div class="apply_check">
            <img src="" alt="" class="apply_img" />
            <div class="apply_text_main">
              <div class="ti_ct">
                <div class="apply_title">인공지능 크리에이터</div>
                <div class="apply_ctg">개발 & 전공</div>
              </div>
              <div class="apply_text">관심있는 사람 누구나 지원하세요!</div>
            </div>
            <div class="apply_time">2026-11-03지원</div>
            <button class="apply_check_button">상세 보기</button>
          </div>

*/
