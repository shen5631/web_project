const DB_URL = "https://woobttpshqvkjnjvhvis.supabase.co";
const DB_KEY = "sb_publishable_Xx2zd7IeOrekFvPFYQLrXQ_0l61qoNe";

const DB = window.supabase.createClient(DB_URL, DB_KEY);

async function user_select() {
  const { data, error } = await DB.from("user").select("*");

  if (error) {
    console.log("에러 : ", error);
    return [];
  } else {
    return data;
  }
}

async function login() {
  const user_id = document.getElementById("user_id").value;
  const user_pw = document.getElementById("user_pw").value;
  const user_list = await user_select();
  let login_check = false;
  for (const user of user_list) {
    if (user.user_id == user_id && user.user_pw == user_pw) {
      alert("로그인 성공!");
      localStorage.setItem("user_id", user.user_id);
      localStorage.setItem("user_pw", user.user_pw);
      localStorage.setItem("user_name", user.user_name);
      localStorage.setItem("user_num", user.user_num);
      localStorage.setItem("user_auth", user.user_auth);
      login_check = true;
      location.href = "index.html";
      break;
    }
  }

  if (!login_check) {
    alert("로그인 실패 다시 입력해주세요!");
  }
}
