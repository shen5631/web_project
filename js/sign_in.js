// =====================================================
// sign_in.js : 로그인 (학번 + 비밀번호, 지금 user 테이블)
// =====================================================

// 그 학번인 사람들만 불러오기
async function user_select(user_num) {
  const { data, error } = await DB.from("user")
    .select("user_id, user_pw, user_name, user_num, user_auth")
    .eq("user_num", user_num);

  if (error) {
    console.log("에러 : ", error);
    return [];
  }
  return data;
}

async function login(e) {
  e.preventDefault();

  const form = e.target;
  const button = form.querySelector('button[type="submit"]');
  clearErrors(form);

  const user_num = document.getElementById("user_num").value.trim();
  const user_pw = document.getElementById("user_pw").value;

  if (!/^\d{4}$/.test(user_num)) {
    showError("user_num", "학번 4자리를 숫자로 입력해 주세요.");
    return;
  }
  if (!user_pw) {
    showError("user_pw", "비밀번호를 입력해 주세요.");
    return;
  }

  button.disabled = true;
  button.textContent = "확인하는 중…";

  const users = await user_select(user_num);
  const user = users.find((u) => u.user_pw == user_pw);

  if (user) {
    saveLoginUser(user);
    location.href = "start_page.html";
    return;
  }

  document.getElementById("user_num").classList.add("오류");
  showError("user_pw", "학번 또는 비밀번호가 맞지 않아요. 다시 입력해 주세요.");
  button.disabled = false;
  button.textContent = "로그인";
}

document.addEventListener("DOMContentLoaded", () => {
  if (getLoginUser()) {
    location.href = "start_page.html";
    return;
  }
  document.getElementById("sign_in_form").addEventListener("submit", login);
});
