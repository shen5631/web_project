const DB_URL = "https://woobttpshqvkjnjvhvis.supabase.co";
const DB_KEY = "sb_publishable_Xx2zd7IeOrekFvPFYQLrXQ_0l61qoNe";

const DB = window.supabase.createClient(DB_URL, DB_KEY);

async function user_id_select() {
  const { data, error } = await DB.from("user").select("user_id");
  if (error) {
    console.log("오류 : ", error);
    return [];
  } else {
    return data;
  }
}

async function user_insert(user) {
  const { data, error } = await DB.from("user").insert([
    {
      user_id: user.id,
      user_pw: user.pw,
      user_name: user.name,
      user_num: user.num,
      user_auth: user.auth,
    },
  ]);

  if (error) {
    console.log("오류 : ", error);
    return [];
  } else {
    console.log("DB삽입 성공");
  }
}

async function accession() {
  const user = {
    id: document.getElementById("user_id").value,
    pw: document.getElementById("user_pw").value,
    pw2: document.getElementById("user_pw2").value,
    name: document.getElementById("user_name").value,
    num: document.getElementById("user_num").value,
    auth: false,
  };

  let null_cnt = 0;
  for (let key in user) {
    if (!user[key] && "auth" != key) {
      null_cnt++;
    }
  }

  const users_id = await user_id_select();
  let user_id_list = [];
  for (const user_id of users_id) {
    user_id_list.push(user_id.user_id);
  }

  console.log(user_id_list);

  if (user.pw != user.pw2) {
    alert("비밀번호가 다릅니다 다시 확인해주세요!");
  } else if (null_cnt != 0) {
    alert("입력창에 마저 입력해주세요!");
  } else if (user_id_list.indexOf(user.id) != -1) {
    alert("아이디를 다시 입력해주세요!");
  } else {
    await user_insert(user);
  }
}
