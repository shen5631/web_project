// =====================================================
// sign_up.js : 회원가입 (지금 user 테이블)
// user_id 칸에는 학번을 그대로 넣어요.
// =====================================================

// 같은 학번이 이미 있는지
async function is_num_taken(user_num) {
  const { data, error } = await DB.from("user").select("user_num").eq("user_num", user_num);
  if (error) {
    console.log("오류 : ", error);
    return false;
  }
  return data.length > 0;
}

async function user_insert(user) {
  const { error } = await DB.from("user").insert([
    {
      user_id: user.num,
      user_pw: user.pw,
      user_name: user.name,
      user_num: user.num,
      user_auth: false,
    },
  ]);

  if (error) {
    console.log("오류 : ", error);
    return false;
  }
  return true;
}

async function accession(e) {
  e.preventDefault();

  const form = e.target;
  const button = form.querySelector('button[type="submit"]');
  clearErrors(form);

  const user = {
    name: document.getElementById("user_name").value.trim(),
    num: document.getElementById("user_num").value.trim(),
    pw: document.getElementById("user_pw").value,
    pw2: document.getElementById("user_pw2").value,
  };

  let ok = true;
  if (!user.name) {
    showError("user_name", "이름을 입력해 주세요.");
    ok = false;
  }
  if (!/^\d{4}$/.test(user.num)) {
    showError("user_num", "학번 4자리를 숫자로 입력해 주세요.");
    ok = false;
  }
  if (user.pw.length < 6) {
    showError("user_pw", "비밀번호는 6자 이상이어야 해요.");
    ok = false;
  }
  if (user.pw !== user.pw2) {
    showError("user_pw2", "비밀번호가 서로 달라요.");
    ok = false;
  }
  if (!ok) return;

  button.disabled = true;
  button.textContent = "가입하는 중…";

  if (await is_num_taken(user.num)) {
    showError("user_num", "이미 가입된 학번이에요.");
  } else if (await user_insert(user)) {
    alert("회원가입이 완료되었습니다! 로그인을 해주세요!");
    location.href = "sign_in.html";
    return;
  } else {
    document.getElementById("form_error").textContent = "가입하지 못했어요. 잠시 후 다시 시도해 주세요.";
  }

  button.disabled = false;
  button.textContent = "가입하기";
}

document.addEventListener("DOMContentLoaded", () => {
  if (getLoginUser()) {
    location.href = "start_page.html";
    return;
  }
  document.getElementById("sign_up_form").addEventListener("submit", accession);
});
