// =====================================================
// db.js : 모든 페이지 공통
// (Supabase 연결, 로그인 정보, 헤더, 공통 함수)
// 다른 js보다 먼저 연결해야 해요.
// =====================================================

// ----- 1. Supabase 연결 -----
const DB_URL = "https://woobttpshqvkjnjvhvis.supabase.co";
const DB_KEY = "sb_publishable_Xx2zd7IeOrekFvPFYQLrXQ_0l61qoNe";

const DB = window.supabase.createClient(DB_URL, DB_KEY);


// ----- 2. 로그인 정보 (localStorage, 기존 키 그대로) -----
function getLoginUser() {
  const id = localStorage.getItem("user_id");
  if (!id) return null;
  return {
    id: id,
    name: localStorage.getItem("user_name"),
    num: localStorage.getItem("user_num"),
    auth: localStorage.getItem("user_auth") === "true",
  };
}

function saveLoginUser(user) {
  localStorage.setItem("user_id", user.user_id);
  localStorage.setItem("user_name", user.user_name);
  localStorage.setItem("user_num", user.user_num);
  localStorage.setItem("user_auth", user.user_auth);
}

function logout() {
  localStorage.removeItem("user_id");
  localStorage.removeItem("user_name");
  localStorage.removeItem("user_num");
  localStorage.removeItem("user_auth");
  location.href = "start_page.html";
}


// ----- 3. 동아리 (board 테이블) -----
async function loadClubs() {
  const { data, error } = await DB.from("board").select("*").order("id");
  if (error) {
    console.log("에러 : ", error);
    return null;
  }
  return data;
}

// 분야 이름만 겹치지 않게 뽑기
function getCategories(clubs) {
  const list = [];
  for (const club of clubs) {
    if (club.category && !list.includes(club.category)) list.push(club.category);
  }
  return list;
}


// ----- 4. 글자 안전 처리 -----
// DB에서 온 글자를 HTML에 넣기 전에 꼭 거치기
function escapeHTML(text) {
  return String(text ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

// 사진 주소로 써도 되는 값인지 (http 주소 또는 올린 이미지)
function isImageURL(value) {
  return typeof value === "string" && /^(https?:\/\/|data:image\/)/.test(value);
}


// ----- 5. 입력칸 오류 표시 -----
// 입력칸 id가 user_pw 이면 오류 문구 칸 id는 user_pw_error
function showError(inputId, message) {
  const input = document.getElementById(inputId);
  const msg = document.getElementById(inputId + "_error");
  if (input) input.classList.add("오류");
  if (msg) msg.textContent = message;
}

function clearErrors(form) {
  form.querySelectorAll(".입력칸.오류").forEach((el) => el.classList.remove("오류"));
  form.querySelectorAll(".오류문구").forEach((el) => (el.textContent = ""));
}


// ----- 6. 헤더 : 로그인하면 바꾸기 -----
function renderHeader() {
  const user = getLoginUser();
  if (!user) return;

  document.body.classList.add("로그인됨");
  const menu = document.querySelector(".메뉴");
  if (!menu) return;

  const page = document.body.dataset.page;

  menu.innerHTML = `
    <a href="clubs.html" class="${page === "clubs" || page === "detail" ? "현재" : ""}">전체 동아리</a>
    ${user.auth ? `<a href="add_dong.html" class="${page === "add_dong" ? "현재" : ""}">동아리 등록</a>` : ""}
    <span class="구분선"></span>
    <span class="사용자">
      <span class="학번">${escapeHTML(user.num)}</span>
      <span>${escapeHTML(user.name)}님</span>
    </span>
    <button type="button" class="로그아웃" id="logout_btn">로그아웃</button>
  `;
  document.getElementById("logout_btn").addEventListener("click", logout);
}

document.addEventListener("DOMContentLoaded", renderHeader);
