const DB_URL = "https://woobttpshqvkjnjvhvis.supabase.co";
const DB_KEY = "sb_publishable_Xx2zd7IeOrekFvPFYQLrXQ_0l61qoNe";

const DB = window.supabase.createClient(DB_URL, DB_KEY);

const name = localStorage.getItem("user_name");
document.getElementById("name").innerText = name + " 학생";

async function board_insert(board) {
  const { data, error } = await DB.from("board").insert([
    {
      user_id: board.user_id,
      name: board.name,
      img: board.img,
      text: board.text,
      category: board.category,
      link: board.link,
    },
  ]);

  if (error) {
    console.log("에러", error);
  } else {
    console.log("성공", data);
  }
}

async function create() {
  const board = {
    user_id: localStorage.getItem("user_id"),
    name: document.getElementById("dong_name").value,
    img: null,
    text: document.getElementById("text").value,
    category: document.getElementById("ctg").value,
    link: document.getElementById("link").value,
  };

  board_insert(board);

  console.log(board);
}
