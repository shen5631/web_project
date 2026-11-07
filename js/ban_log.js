const DB_URL = env.DB_URL;
const DB_KEY = env.DB_KEY;

const DB = window.supabase.createClient(DB_URL, DB_KEY);

async function board_select() {
  const { data, error } = await DB.from("board").select(
    "id,user_id,name,user(ban)",
  );

  if (error) {
    console.log("에러 : ", error);
  } else {
    console.log("성공 : ", data);
    return data;
  }
}

async function print() {
  const boards = await board_select();
  let tag = "<table>";
  tag += `<tr><th>ID</th><th>user_ID</th><th>name</th><th>ban</th><th>ban_check</th></tr>`;

  for (let board of boards) {
    tag += `<tr><td>${board.id}</td><td>${board.user_id}</td><td>${board.name}</td><td>${board.user.ban}</td><td><input type = "checkbox" id = "ban_check" onchange = "check(this.checked,'${board.user_id}')" ${board.user.ban ? "checked" : ""}></td></tr>`;
  }
  tag += "</table>";
  document.getElementById("table_log").innerHTML = tag;
}

async function check(ban_check, id) {
  //   console.log(ban_check);
  const { data, error } = await DB.from("user")
    .update({ ban: ban_check })
    .eq("user_id", id)
    .select("*");
  if (error) {
    console.log("에러 : ", error);
  } else {
    console.log("성공 : ", data);
  }
  print();
}
print();
