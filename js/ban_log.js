const DB_URL = env.DB_URL;
const DB_KEY = env.DB_KEY;

const DB = window.supabase.createClient(DB_URL, DB_KEY);

async function board_select() {
  const { data, error } = await DB.from("board").select("*");

  if (error) {
    console.log("에러 : ", error);
  } else {
    console.log("성공 : ", data);
    return data;
  }
}

async function print() {
  const boards = await board_select();
  let tag ="<table>";



  for (let board of boards) {
    tag+= `<>`
  }
}

print();
