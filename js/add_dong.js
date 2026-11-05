const DB_URL = env.DB_URL;
const DB_KEY = env.DB_KEY;

const DB = window.supabase.createClient(DB_URL, DB_KEY);
let link_cnt = 0;
const name = localStorage.getItem("user_name");
document.getElementById("name").innerText = name + " 학생";

async function board_insert(board, main_img) {
  const { data, error } = await DB.from("board").insert([
    {
      user_id: board.user_id,
      name: board.name,
      img: main_img,
      text: board.text,
      category: board.category,
      link: board.link,
      to: board.to,
    },
  ]);

  if (error) {
    console.log("에러", error);
  } else {
    console.log("성공", data);
  }
}

async function main_img_add(board) {
  const { data, error } = await DB.storage
    .from("main_img")
    .upload(board.path, board.img1);

  if (error) {
    console.log("에러 : ", error);
  } else {
    console.log("성공 : ", data);
  }
  return (
    "https://woobttpshqvkjnjvhvis.supabase.co/storage/v1/object/public/main_img" +
    board.path
  );
}

const img = () => {
  const save = document.getElementById("iimg").files[0];
  if (!save) return;
  const url = URL.createObjectURL(save);
  document.getElementById("url_img").innerHTML +=
    `<img src="${url}" alt="" id ="main_img">`;
};

const img1 = () => {
  const save = document.getElementById("iimg1").files[0];
  if (!save) return;
  const url = URL.createObjectURL(save);
  document.getElementById("url_img").innerHTML += `<img src="${url}" alt="">`;
};

const dong_link = () => {
  const site = {
    naver: "../asset/naver.svg",
    git: "../asset/git.svg",
    insta: "../asset/insta.svg",
    blog: "../asset/blog.svg",
  };
  const tag = document.getElementById("link").value;

  document.getElementById("link_line").innerHTML +=
    `<div class = "link_line"><img src="${site[tag]}" alt="" class = "link_img"><input type="text" class = "link_input" id = "link_input${link_cnt++}" ></div>`;
};

async function create() {
  //링크 여러개 불러오기
  let link_tag = "";
  for (let i = 0; i < link_cnt; i++) {
    let id = "link_input" + i;
    console.log(id);
    link_tag += document.getElementById(id).value;
    link_tag += ",";
  }

  const board = {
    user_id: localStorage.getItem("user_id"),
    name: document.getElementById("dong_name").value,
    img1: document.getElementById("iimg").files[0],
    text: document.getElementById("text").value,
    category: document.getElementById("ctg").value,
    link: link_tag,
    to: document.getElementById("dong_to").value,
    path: `/main_${Date.now()}.png`,
  };

  console.log(board);

  alert("게시물 생성 완료");
  const img_url = await main_img_add(board);
  await board_insert(board, img_url);

  //location.href = "index.html";
}
