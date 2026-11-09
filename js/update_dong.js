const DB_URL = env.DB_URL;
const DB_KEY = env.DB_KEY;

const DB = window.supabase.createClient(DB_URL, DB_KEY);
let link_cnt = 0;
const name = localStorage.getItem("user_name");
document.getElementById("name").innerText = name + " 학생";

if (localStorage.getItem("user_master") == "true") {
  document.getElementById("board_log").innerText = "게시물 조회";
}
if (localStorage.getItem("user_auth") == "true") {
  document.getElementById("apply_log").innerText = "지원 목록";
} else {
  document.getElementById("apply_log").innerText = "지원 내역";
  document.getElementById("apply_log").href = "apply_check.html";
}

let old_board = null;


async function select_board_eq() {
  const { data, error } = await DB.from("board")
    .select("*")
    .eq("name", localStorage.getItem("update_name"));
  if (error) {
    console.log("에러 : ", error);
  } else {
    console.log("성공 : ", data);
    return data;
  }
}

async function board_update(board, main_img, sub_img) {
  const { data, error } = await DB.from("board")
    .update({
      name: board.name,
      img: main_img,
      sub_img: sub_img,
      text: board.text,
      category: board.category,
      link: board.link,
      to: board.to,
    })
    .eq("id", old_board.id);

  if (error) {
    console.log("에러", error);
  } else {
    console.log("성공", data);
  }
}

async function main_img_add(board) {
  
  if (!board.img1) return old_board.img;

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

async function sub_img_add(board) {
  
  if (board.sub_files.length == 0) return old_board.sub_img;

  let sub_url = "";
  for (let i = 0; i < board.sub_files.length; i++) {
    const path = `/sub_${Date.now()}_${i}.png`;
    const { data, error } = await DB.storage
      .from("sub_img")
      .upload(path, board.sub_files[i]);

    if (error) {
      console.log("에러 : ", error);
    } else {
      console.log("성공 : ", data);
    }
    sub_url +=
      "https://woobttpshqvkjnjvhvis.supabase.co/storage/v1/object/public/sub_img" +
      path;
    sub_url += ",";
  }
  return sub_url;
}


const img = () => {
  const save = document.getElementById("iimg").files[0];
  if (!save) return;
  const url = URL.createObjectURL(save);
  const old = document.getElementById("main_img");
  if (old) old.remove();
  document.getElementById("url_img").innerHTML +=
    `<img src="${url}" alt="" id ="main_img">`;
};

const img1 = () => {
  const saves = document.getElementById("iimg1").files;
  if (saves.length == 0) return;
  const olds = document.querySelectorAll(".sub_img");
  for (let i = 0; i < olds.length; i++) {
    olds[i].remove();
  }
  for (let i = 0; i < saves.length; i++) {
    const url = URL.createObjectURL(saves[i]);
    document.getElementById("url_img").innerHTML +=
      `<img src="${url}" alt="" class="sub_img">`;
  }
};


const site = {
  naver: "../asset/naver.svg",
  git: "../asset/git.svg",
  insta: "../asset/insta.svg",
  blog: "../asset/blog.svg",
};

const add_link_row = (tag) => {
  const id = "link_input" + link_cnt++;
  document.getElementById("link_line").innerHTML +=
    `<div class = "link_line"><img src="${site[tag]}" alt="" class = "link_img"><input type="text" class = "link_input" id = "${id}" ></div>`;
};

const dong_link = () => {
  const tag = document.getElementById("link").value;
  const saved = link_values();
  add_link_row(tag);
  link_fill(saved);
};

function link_values() {
  const arr = [];
  for (let i = 0; i < link_cnt; i++) {
    arr.push(document.getElementById("link_input" + i).value);
  }
  return arr;
}

function link_fill(arr) {
  for (let i = 0; i < arr.length; i++) {
    document.getElementById("link_input" + i).value = arr[i];
  }
}


async function fill() {
  const board = await select_board_eq();
  
  if (!board || board.length == 0) {
    alert("동아리 정보를 불러오지 못했습니다.");
    location.href = "index.html";
    return;
  }
  old_board = board[0];

  
  document.getElementById("dong_name").value = old_board.name;
  document.getElementById("text").value = old_board.text;
  document.getElementById("ctg").value = old_board.category; 
  document.getElementById("dong_to").value = old_board.to;


  let img_tag = `<img src="${old_board.img}" alt="" id="main_img">`;
  if (old_board.sub_img) {
    const subs = old_board.sub_img.split(",");
    subs.pop(); 
    for (let s of subs) {
      img_tag += `<img src="${s}" alt="" class="sub_img">`;
    }
  }
  document.getElementById("url_img").innerHTML = img_tag;

  if (old_board.link != null) {
    const links = old_board.link.split(",");
    links.pop();
    for (let link of links) {
      let tag = "naver";
      if (link.includes("naver")) tag = "naver";
      else if (link.includes("blog")) tag = "blog";
      else if (link.includes("git")) tag = "git";
      else if (link.includes("insta")) tag = "insta";
      add_link_row(tag);
    }
    link_fill(links); 
  }
}


async function update() {
  if (!old_board) return;

  let link_tag = "";
  for (let i = 0; i < link_cnt; i++) {
    const value = document.getElementById("link_input" + i).value;
    if (value == "") continue; 
    link_tag += value;
    link_tag += ",";
  }

  const board = {
    name: document.getElementById("dong_name").value,
    img1: document.getElementById("iimg").files[0],
    sub_files: document.getElementById("iimg1").files,
    text: document.getElementById("text").value,
    category: document.getElementById("ctg").value,
    link: link_tag,
    to: document.getElementById("dong_to").value,
    path: `/main_${Date.now()}.png`,
  };

  const img_url = await main_img_add(board);
  const sub_url = await sub_img_add(board);
  await board_update(board, img_url, sub_url);

  localStorage.setItem("update_name", board.name);
  alert("게시물 수정 완료");
  location.href = "index.html";
}

async function remove() {
  if (!old_board) return;

  const check = confirm(
    `'${old_board.name}' 동아리를 정말로 삭제하시겠습니까?\n삭제하면 되돌릴 수 없고, 지원 내역도 함께 사라집니다.`,
  );
  if (!check) return;

  const apply_res = await DB.from("apply")
    .delete()
    .eq("board_id", old_board.id);
  if (apply_res.error) {
    console.log("에러 : ", apply_res.error);
    alert("삭제 중 오류가 발생했습니다.");
    return; 
  }

  const board_res = await DB.from("board").delete().eq("id", old_board.id);
  if (board_res.error) {
    console.log("에러 : ", board_res.error);
    alert("삭제 중 오류가 발생했습니다.");
    return;
  }

  alert("동아리가 삭제되었습니다.");
  location.href = "index.html";
}


function cancel() {
  history.back();
}

fill();
